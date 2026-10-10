// content/*.ko.md → Notion pages (front matter `notion:` id). Replaces each page's content.
// Env: NOTION_TOKEN (integration with access to both pages), plus one env var per
// {{PLACEHOLDER}} in the markdown (RESUME_PHONE, RESUME_BIRTHDATE) — kept out of this public repo.
import { Client } from '@notionhq/client'
import { marked } from 'marked'
import { load, PLACEHOLDER } from './content.mjs'

const dry = process.argv.includes('--dry') // print the blocks instead of writing them
if (!dry && !process.env.NOTION_TOKEN) {
  console.log('NOTION_TOKEN not set — skipping Notion sync.')
  process.exit(0)
}
const notion = new Client({ auth: process.env.NOTION_TOKEN })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Notion allows ~3 requests/s; retry rate limits and transient errors.
async function call(fn) {
  for (let i = 0; ; i++) {
    try { await sleep(350); return await fn() } catch (e) {
      if (i < 5 && (e.status === 429 || e.status >= 500)) { await sleep(2000 * (i + 1)); continue }
      throw e
    }
  }
}

const unescape = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')

// marked inline tokens → Notion rich_text
function rich(tokens = [], a = {}, link = null) {
  return tokens.flatMap((t) => {
    switch (t.type) {
      case 'strong': return rich(t.tokens, { ...a, bold: true }, link)
      case 'em': return rich(t.tokens, { ...a, italic: true }, link)
      case 'del': return rich(t.tokens, { ...a, strikethrough: true }, link)
      case 'codespan': return [text(unescape(t.text), { ...a, code: true }, link)]
      case 'link': return rich(t.tokens, a, t.href)
      case 'br': return [text('\n', a, link)]
      case 'text': return t.tokens ? rich(t.tokens, a, link) : [text(unescape(t.text), a, link)]
      default: return [text(unescape(t.text ?? t.raw ?? ''), a, link)]
    }
  })
}
const text = (content, a, link) => ({
  type: 'text',
  text: { content, link: link ? { url: link } : null },
  annotations: { bold: !!a.bold, italic: !!a.italic, strikethrough: !!a.strikethrough, underline: false, code: !!a.code, color: 'default' },
})
const block = (type, rich_text) => ({ object: 'block', type, [type]: { rich_text } })

// marked block tokens → Notion blocks (only the shapes our documents use)
function blocks(tokens) {
  return tokens.flatMap((t) => {
    switch (t.type) {
      case 'heading': return [block(`heading_${Math.min(t.depth, 3)}`, rich(t.tokens))]
      case 'paragraph': return [block('paragraph', rich(t.tokens))]
      case 'blockquote': return [block('quote', t.tokens.filter((p) => p.tokens).flatMap((p, i) => [...(i ? [text('\n', {})] : []), ...rich(p.tokens)]))]
      case 'hr': return [{ object: 'block', type: 'divider', divider: {} }]
      case 'list': return t.items.map((it) => block(t.ordered ? 'numbered_list_item' : 'bulleted_list_item', rich(it.tokens.flatMap((x) => x.tokens ?? []))))
      case 'table': return [{
        object: 'block', type: 'table',
        table: {
          table_width: t.header.length, has_column_header: true, has_row_header: false,
          children: [t.header, ...t.rows].map((row) => ({ object: 'block', type: 'table_row', table_row: { cells: row.map((c) => rich(c.tokens)) } })),
        },
      }]
      case 'space': return []
      default: throw new Error(`Unsupported markdown block for Notion: ${t.type}`)
    }
  })
}

async function sync(name) {
  const { meta, body } = load(name, 'ko')
  const missing = []
  const filled = body.replace(PLACEHOLDER, (_, key) => {
    const v = process.env[`RESUME_${key}`]
    if (!v) missing.push(`RESUME_${key}`)
    return v ?? ''
  })
  if (missing.length && !dry) throw new Error(`${name}: missing env ${missing.join(', ')}`)

  const children = blocks(marked.lexer(filled))
  if (dry) {
    const count = {}
    for (const b of children) count[b.type] = (count[b.type] ?? 0) + 1
    console.log(name, count)
    return
  }
  const old = []
  for (let cursor; ;) {
    const r = await call(() => notion.blocks.children.list({ block_id: meta.notion, start_cursor: cursor, page_size: 100 }))
    old.push(...r.results.map((b) => b.id))
    if (!r.has_more) break
    cursor = r.next_cursor
  }
  // Append the new content first, then remove the old — a failure midway never leaves the page empty.
  for (let i = 0; i < children.length; i += 100) {
    await call(() => notion.blocks.children.append({ block_id: meta.notion, children: children.slice(i, i + 100) }))
  }
  for (const id of old) await call(() => notion.blocks.delete({ block_id: id }))
  console.log(`${name}: ${children.length} blocks written, ${old.length} old blocks removed`)
}

const names = process.argv.slice(2).filter((a) => !a.startsWith('--'))
for (const name of names.length ? names : ['resume', 'career']) await sync(name)
