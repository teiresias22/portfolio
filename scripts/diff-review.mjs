// Render uncommitted changes to content/*.md as a word-level HTML review page.
// Usage: node scripts/diff-review.mjs <out.html>
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = process.argv[2]
if (!out) {
  console.error('usage: node scripts/diff-review.mjs <out.html>')
  process.exit(1)
}

const files = [
  ['content/resume.ko.md', '이력서 (한국어)'],
  ['content/career.ko.md', '경력기술서 (한국어)'],
  ['content/resume.en.md', 'Resume (English)'],
  ['content/career.en.md', 'Career (English)'],
]

const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 64 << 20 })
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')

// Heading path (h1 › h2 › h3) in effect at each line of the working-tree file.
function headingsFor(path) {
  let stack = []
  return readFileSync(join(root, path), 'utf8').split('\n').map((line) => {
    const m = line.match(/^(#{1,3}) (.+)/)
    if (m) stack = [...stack.filter(([level]) => level < m[1].length), [m[1].length, m[2].trim()]]
    return stack.map(([, text]) => text).join(' › ')
  })
}

// One hunk per changed region; rows are lists of [kind, text] where kind is ' ', '+' or '-'.
function hunksFor(path) {
  const raw = git('diff', '-U2', '--word-diff=porcelain', '--word-diff-regex=[^[:space:]]+|[[:space:]]+', '--', path)
  const heads = headingsFor(path)
  const hunks = []
  let cur = null
  for (const line of raw.split('\n')) {
    if (line.startsWith('@@')) {
      const start = Number(line.match(/\+(\d+)/)[1])
      cur = { head: heads[Math.min(start, heads.length) - 1] ?? '', rows: [[]] }
      hunks.push(cur)
    } else if (!cur || /^(diff |index |--- |\+\+\+ )/.test(line)) {
      continue
    } else if (line === '~') {
      cur.rows.push([])
    } else if (line) {
      cur.rows.at(-1).push([line[0], line.slice(1)])
    }
  }
  return hunks
}

function renderRow(row) {
  const kinds = new Set(row.map(([k]) => k))
  const changed = kinds.has('+') || kinds.has('-')
  const [cls, mark] =
    kinds.size === 1 && kinds.has('+') ? ['add', '+'] :
    kinds.size === 1 && kinds.has('-') ? ['del', '−'] :
    changed ? ['mod', '±'] : ['ctx', '']
  const body = row.map(([k, t]) => (k === '+' ? `<ins>${inline(t)}</ins>` : k === '-' ? `<del>${inline(t)}</del>` : inline(t))).join('')
  return `<div class="row ${cls}"><span class="gut">${mark}</span><span class="txt">${body}</span></div>`
}

const nav = []
const sections = []
let total = 0
for (const [path, label] of files) {
  const [added = 0, removed = 0] = git('diff', '--numstat', '--', path).trim().split(/\s+/).map(Number).filter((n) => !Number.isNaN(n))
  const hunks = hunksFor(path)
  total += hunks.length
  const id = path.split('/').at(-1).replace(/\./g, '-')
  nav.push(`<a href="#${id}"><span>${label}</span><span class="n"><em class="p">+${added}</em> <em class="m">−${removed}</em> · 변경 ${hunks.length}곳</span></a>`)
  const blocks = hunks.map(
    (h) => `<div class="hunk"><div class="where">${esc(h.head) || '(문서 머리)'}</div>${h.rows.filter((r) => r.length).map(renderRow).join('')}</div>`,
  )
  sections.push(`<section id="${id}"><h2>${label} <code>${path}</code></h2>${blocks.join('') || '<p class="none">변경 없음</p>'}</section>`)
}

const page = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>포트폴리오 변경 검토</title>
<style>
:root { --bg:#fafaf8; --fg:#1f2328; --muted:#6b7280; --card:#fff; --line:#e5e7eb;
  --add:#dcfce7; --addfg:#14532d; --addbar:#16a34a; --del:#fee2e2; --delfg:#7f1d1d; --delbar:#dc2626; --mod:#fef9c3; --modbar:#ca8a04; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#0f1115; --fg:#e6e6e6; --muted:#9ca3af; --card:#171a21; --line:#2a2f3a;
  --add:#11331f; --addfg:#bbf7d0; --addbar:#22c55e; --del:#3a1414; --delfg:#fecaca; --delbar:#ef4444; --mod:#332b0b; --modbar:#eab308; } }
* { box-sizing:border-box }
body { margin:0; background:var(--bg); color:var(--fg); font:15px/1.65 -apple-system,"Apple SD Gothic Neo",system-ui,sans-serif; }
main { max-width:960px; margin:0 auto; padding:24px 16px 80px; }
h1 { font-size:22px; margin:0 0 4px } .sub { color:var(--muted); margin:0 0 16px; font-size:14px }
.legend { display:flex; gap:12px; flex-wrap:wrap; font-size:13px; margin-bottom:16px }
.legend span { padding:2px 8px; border-radius:6px }
nav { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:8px; margin-bottom:28px; position:sticky; top:0; background:var(--bg); padding:8px 0; z-index:2 }
nav a { display:flex; flex-direction:column; text-decoration:none; color:var(--fg); background:var(--card); border:1px solid var(--line); border-radius:10px; padding:8px 12px; font-weight:600 }
nav .n { font-weight:400; font-size:12px; color:var(--muted) } em { font-style:normal } .p { color:var(--addbar) } .m { color:var(--delbar) }
section { margin-bottom:40px; scroll-margin-top:90px } h2 { font-size:18px; border-bottom:2px solid var(--line); padding-bottom:6px }
h2 code { font-size:12px; color:var(--muted); font-weight:400 } .none { color:var(--muted) }
.hunk { background:var(--card); border:1px solid var(--line); border-radius:10px; margin:14px 0; overflow:hidden }
.where { font-size:12px; color:var(--muted); padding:6px 12px; border-bottom:1px solid var(--line) }
.row { display:flex; padding:3px 12px 3px 0; border-left:4px solid transparent; overflow-wrap:anywhere }
.row.ctx { color:var(--muted); font-size:13px }
.row.add { background:var(--add); border-left-color:var(--addbar) } .row.add ins { background:none }
.row.del { background:var(--del); border-left-color:var(--delbar) } .row.del del { background:none }
.row.mod { border-left-color:var(--modbar) }
.gut { width:24px; flex:none; text-align:center; color:var(--muted); font-weight:700 }
.txt { white-space:pre-wrap; min-width:0 }
ins { background:var(--add); color:var(--addfg); text-decoration:none; border-radius:3px }
del { background:var(--del); color:var(--delfg); border-radius:3px }
</style></head><body><main>
<h1>포트폴리오 변경 검토</h1>
<p class="sub">커밋 전 작업 트리 기준 · 단어 단위 비교 · 회색 줄은 주변 문맥</p>
<div class="legend"><span style="background:var(--add);color:var(--addfg)">초록 = 추가</span><span style="background:var(--del);color:var(--delfg)"><del style="background:none">빨강 취소선</del> = 삭제</span><span style="border-left:4px solid var(--modbar)">노란 테두리 = 줄 안에서 일부 수정</span></div>
<nav>${nav.join('')}</nav>
${sections.join('\n')}
</main></body></html>`

writeFileSync(out, page)
console.log(`wrote ${out} (${total} changed regions)`)
