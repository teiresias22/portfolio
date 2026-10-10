// content/*.md → dist/ (GitHub Pages). English at /, Korean at /ko/.
import { mkdirSync, writeFileSync, copyFileSync, rmSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { marked } from 'marked'
import { load } from './content.mjs'

const SITE = 'https://joon.is-a.dev'
const PAGES = [
  { name: 'resume', path: '', toc: 2 },
  { name: 'career', path: 'career/', toc: 3 },
]
const UI = {
  en: { toc: 'Contents', skip: 'Skip to content', name: 'Joonhwan Jeon', role: 'Cross-platform developer · Flutter · Swift · React · Laravel', resume: 'Resume', career: 'Career', other: '한국어', otherLang: 'ko', contact: 'Get in touch', contactSub: 'For questions or opportunities, email is the fastest way to reach me.', apps: 'My apps', updated: 'Updated', top: 'Back to top' },
  ko: { toc: '목차', skip: '본문 바로가기', name: '전준환', role: '크로스플랫폼 개발자 · Flutter · Swift · React · Laravel', resume: '이력서', career: '경력기술서', other: 'English', otherLang: 'en', contact: '연락하기', contactSub: '문의나 제안은 이메일로 주시면 가장 빠르게 답변드립니다.', apps: '내 앱 모음', updated: '최종 업데이트', top: '맨 위로' },
}
const url = (lang, path) => `${SITE}/${lang === 'ko' ? 'ko/' : ''}${path}`
// Cache-bust the stylesheet: the URL changes whenever its content does.
const CSS = `/style.css?v=${createHash('sha1').update(readFileSync(new URL('../static/style.css', import.meta.url))).digest('hex').slice(0, 8)}`
// Build date in KST, shown as the document's last update.
const UPDATED = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

const EMOJI = /^(?:\p{Extended_Pictographic}|\uFE0F|\u200D)+\s*/u
const FACTS = 'Problem|Engineering Challenge|Design Decision|Evidence'
const slug = (s) => s.replace(/<[^>]+>/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')

function toHtml(body, tocDepth) {
  // Notion-only blocks (profile table with phone/birthdate) never reach the web.
  body = body.replace(/<!-- notion-only -->[\s\S]*?<!-- \/notion-only -->\n*(---\n+)?/g, '')
  // Shift headings so the top level in each document becomes <h2> (the page header owns <h1>).
  const depths = [...body.matchAll(/^(#{1,6}) /gm)].map((m) => m[1].length)
  const shift = 2 - Math.min(...depths)
  body = body.replace(/^(#{1,6}) /gm, (_, h) => '#'.repeat(Math.min(6, h.length + shift)) + ' ')
  const toc = []
  const used = new Set()
  const html = marked.parse(body)
    // Emoji are section markers in Notion; on the web they read as noise.
    .replace(/(<h\d>|<blockquote>\n<p>)([^<]*)/g, (_, tag, text) => tag + text.replace(EMOJI, ''))
    // Anchor every heading so sections can be linked and listed in the contents.
    .replace(/<h([2-4])>([\s\S]*?)<\/h\1>/g, (_, n, inner) => {
      let id = slug(inner) || 'section'
      while (used.has(id)) id += '-'
      used.add(id)
      if (n <= tocDepth) toc.push({ n: Number(n), id, text: inner.replace(/<code>[\s\S]*?<\/code>/g, '').replace(/<[^>]+>/g, '').trim() })
      return `<h${n} id="${id}"><a class="anchor" href="#${id}">${inner}</a></h${n}>`
    })
    // Problem / Challenge / Decision / Evidence lists get a label column.
    .replace(new RegExp(`<li><strong>(${FACTS})</strong> — `, 'g'), '<li class="fact"><span class="k">$1</span><span class="v">')
    .replace(/(<li class="fact">[\s\S]*?)<\/li>/g, '$1</span></li>')
    .replace(/<ul>\n<li class="fact">/g, '<ul class="facts">\n<li class="fact">')
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>')
  return { html, toc }
}

function page(lang, { name, path }) {
  const { meta, body } = load(name, lang)
  const t = UI[lang]
  const { html, toc } = toHtml(body, PAGES.find((p) => p.name === name).toc)
  const tocHtml = `<nav class="toc" aria-label="${t.toc}"><details><summary>${t.toc}</summary><ol>${toc.map((h) => `<li class="l${h.n}"><a href="#${h.id}">${h.text}</a></li>`).join('')}</ol></details></nav>`
  const nav = PAGES.map((p) => {
    const href = `/${lang === 'ko' ? 'ko/' : ''}${p.path}`
    return `<a href="${href}"${p.name === name ? ' aria-current="page"' : ''}>${t[p.name]}</a>`
  }).join('')
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description || meta.title)}">
<link rel="canonical" href="${url(lang, path)}">
<link rel="alternate" hreflang="en" href="${url('en', path)}">
<link rel="alternate" hreflang="ko" href="${url('ko', path)}">
<link rel="alternate" hreflang="x-default" href="${url('en', path)}">
<link rel="stylesheet" href="${CSS}">
</head>
<body id="top">
<a class="skip" href="#main">${t.skip}</a>
<header class="top">
  <div class="wrap">
    <div class="who"><h1 class="name"><a href="/${lang === 'ko' ? 'ko/' : ''}">${t.name}</a></h1><span class="role">${t.role}</span><span class="links"><a href="https://github.com/teiresias22">GitHub</a><a href="mailto:teiresias1987@gmail.com">Email</a></span></div>
    <nav aria-label="Pages">${nav}<a class="lang" href="${url(t.otherLang, path).replace(SITE, '')}" hreflang="${t.otherLang}" lang="${t.otherLang}">${t.other}</a></nav>
  </div>
</header>
<div class="layout">
${tocHtml}
<main id="main" class="doc">
${html}
</main>
</div>
<script>if (matchMedia('(min-width: 1100px)').matches) document.querySelector('.toc details').open = true</script>
<footer class="foot">
  <div class="wrap">
    <section class="foot-cta" aria-labelledby="contact">
      <h2 id="contact">${t.contact}</h2>
      <p>${t.contactSub}</p>
      <div class="foot-links">
        <a class="btn primary" href="mailto:teiresias1987@gmail.com">Email</a>
        <a class="btn" href="https://github.com/teiresias22">GitHub</a>
        <a class="btn" href="https://apps.joon.is-a.dev/">${t.apps}</a>
      </div>
    </section>
    <div class="foot-bottom">
      <span>© 2026 ${t.name} · ${t.updated} <time datetime="${UPDATED}">${UPDATED}</time></span>
      <a href="#top">${t.top} ↑</a>
    </div>
  </div>
</footer>
</body>
</html>
`
}

const out = new URL('../dist/', import.meta.url)
rmSync(out, { recursive: true, force: true })
for (const lang of ['en', 'ko']) {
  for (const p of PAGES) {
    const dir = new URL(`${lang === 'ko' ? 'ko/' : ''}${p.path}`, out)
    mkdirSync(dir, { recursive: true })
    writeFileSync(new URL('index.html', dir), page(lang, p))
  }
}
copyFileSync(new URL('../static/style.css', import.meta.url), new URL('style.css', out))
copyFileSync(new URL('../CNAME', import.meta.url), new URL('CNAME', out))
console.log('built dist/')
