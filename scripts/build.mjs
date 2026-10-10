// content/*.md → dist/ (GitHub Pages). English at /, Korean at /ko/.
import { mkdirSync, writeFileSync, copyFileSync, rmSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { marked } from 'marked'
import { load } from './content.mjs'

const SITE = 'https://joon.is-a.dev'
const PAGES = [
  { name: 'resume', path: '' },
  { name: 'career', path: 'career/' },
]
const UI = {
  en: { name: 'Joonhwan Jeon', role: 'Cross-platform developer · Flutter · Swift · React · Laravel', resume: 'Resume', career: 'Career', other: '한국어', otherLang: 'ko' },
  ko: { name: '전준환', role: '크로스플랫폼 개발자 · Flutter · Swift · React · Laravel', resume: '이력서', career: '경력기술서', other: 'English', otherLang: 'en' },
}
const url = (lang, path) => `${SITE}/${lang === 'ko' ? 'ko/' : ''}${path}`
// Cache-bust the stylesheet: the URL changes whenever its content does.
const CSS = `/style.css?v=${createHash('sha1').update(readFileSync(new URL('../static/style.css', import.meta.url))).digest('hex').slice(0, 8)}`
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

function toHtml(body) {
  // Notion-only rows (phone, birthdate) never reach the web.
  body = body.split('\n').filter((l) => !(l.startsWith('|') && /\{\{\w+\}\}/.test(l))).join('\n')
  // Shift headings so the top level in each document becomes <h2> (the page header owns <h1>).
  const depths = [...body.matchAll(/^(#{1,6}) /gm)].map((m) => m[1].length)
  const shift = 2 - Math.min(...depths)
  body = body.replace(/^(#{1,6}) /gm, (_, h) => '#'.repeat(Math.min(6, h.length + shift)) + ' ')
  return marked.parse(body)
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>')
}

function page(lang, { name, path }) {
  const { meta, body } = load(name, lang)
  const t = UI[lang]
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
<body>
<header class="top">
  <div class="wrap">
    <div class="who"><h1 class="name"><a href="/${lang === 'ko' ? 'ko/' : ''}">${t.name}</a></h1><span class="role">${t.role}</span></div>
    <nav>${nav}<a class="lang" href="${url(t.otherLang, path).replace(SITE, '')}" hreflang="${t.otherLang}" lang="${t.otherLang}">${t.other}</a></nav>
  </div>
</header>
<main class="wrap doc">
${toHtml(body)}
</main>
<footer class="wrap"><a href="https://github.com/teiresias22">GitHub</a> · <a href="mailto:teiresias1987@gmail.com">teiresias1987@gmail.com</a></footer>
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
