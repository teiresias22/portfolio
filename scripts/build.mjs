// content/*.md → dist/ (GitHub Pages). English at /, Korean at /ko/.
import { mkdirSync, writeFileSync, copyFileSync, rmSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { marked } from 'marked'
import { load } from './content.mjs'

const SITE = 'https://joon.is-a.dev'
const PAGES = [
  { name: 'resume', path: '', toc: 2 },
  { name: 'career', path: 'career/', toc: 3 },
]
const UI = {
  en: { toc: 'Contents', sub: 'subsections', skip: 'Skip to content', name: 'Joonhwan Jeon', role: 'Cross-platform developer · Flutter · Swift · React · Laravel', resume: 'Resume', career: 'Career', apps: 'Apps', otherLang: 'ko', contact: 'Get in touch', contactSub: 'For questions or opportunities, email is the fastest way to reach me.', updated: 'Updated', top: 'Back to top', newTab: '(opens in a new tab)', locale: 'en_US', jobTitle: 'Cross-platform developer' },
  ko: { toc: '목차', sub: '하위 항목', skip: '본문 바로가기', name: '전준환', role: '크로스플랫폼 개발자 · Flutter · Swift · React · Laravel', resume: '이력서', career: '경력기술서', apps: '앱', otherLang: 'en', contact: '연락하기', contactSub: '문의나 제안은 이메일로 주시면 가장 빠르게 답변드립니다.', updated: '최종 업데이트', top: '맨 위로', newTab: '(새 창에서 열림)', locale: 'ko_KR', jobTitle: '크로스플랫폼 개발자' },
}
// Header and footer show these in the same order. Email stays the highlighted button (fastest reply).
// Footer buttons pair each label with a Remix Icon (line) — the same set the app pages' footers use.
const CONTACTS = [
  { label: 'GitHub', href: 'https://github.com/teiresias22', print: 'github.com/teiresias22', icon: 'M5.88401 18.6533C5.58404 18.4526 5.32587 18.1975 5.0239 17.8369C4.91473 17.7065 4.47283 17.1524 4.55811 17.2583C4.09533 16.6833 3.80296 16.417 3.50156 16.3089C2.9817 16.1225 2.7114 15.5499 2.89784 15.0301C3.08428 14.5102 3.65685 14.2399 4.17672 14.4263C4.92936 14.6963 5.43847 15.1611 6.12425 16.0143C6.03025 15.8974 6.46364 16.441 6.55731 16.5529C6.74784 16.7804 6.88732 16.9182 6.99629 16.9911C7.20118 17.1283 7.58451 17.1874 8.14709 17.1311C8.17065 16.7489 8.24136 16.3783 8.34919 16.0358C5.38097 15.3104 3.70116 13.3952 3.70116 9.63971C3.70116 8.40085 4.0704 7.28393 4.75917 6.3478C4.5415 5.45392 4.57433 4.37284 5.06092 3.15636C5.1725 2.87739 5.40361 2.66338 5.69031 2.57352C5.77242 2.54973 5.81791 2.53915 5.89878 2.52673C6.70167 2.40343 7.83573 2.69705 9.31449 3.62336C10.181 3.41879 11.0885 3.315 12.0012 3.315C12.9129 3.315 13.8196 3.4186 14.6854 3.62277C16.1619 2.69 17.2986 2.39649 18.1072 2.52651C18.1919 2.54013 18.2645 2.55783 18.3249 2.57766C18.6059 2.66991 18.8316 2.88179 18.9414 3.15636C19.4279 4.37256 19.4608 5.45344 19.2433 6.3472C19.9342 7.28337 20.3012 8.39208 20.3012 9.63971C20.3012 13.3968 18.627 15.3048 15.6588 16.032C15.7837 16.447 15.8496 16.9105 15.8496 17.4121C15.8496 18.0765 15.8471 18.711 15.8424 19.4225C15.8412 19.6127 15.8397 19.8159 15.8375 20.1281C16.2129 20.2109 16.5229 20.5077 16.6031 20.9089C16.7114 21.4504 16.3602 21.9773 15.8186 22.0856C14.6794 22.3134 13.8353 21.5538 13.8353 20.5611C13.8353 20.4708 13.836 20.3417 13.8375 20.1145C13.8398 19.8015 13.8412 19.599 13.8425 19.4094C13.8471 18.7019 13.8496 18.0716 13.8496 17.4121C13.8496 16.7148 13.6664 16.2602 13.4237 16.051C12.7627 15.4812 13.0977 14.3973 13.965 14.2999C16.9314 13.9666 18.3012 12.8177 18.3012 9.63971C18.3012 8.68508 17.9893 7.89571 17.3881 7.23559C17.1301 6.95233 17.0567 6.54659 17.199 6.19087C17.3647 5.77663 17.4354 5.23384 17.2941 4.57702L17.2847 4.57968C16.7928 4.71886 16.1744 5.0198 15.4261 5.5285C15.182 5.69438 14.8772 5.74401 14.5932 5.66413C13.7729 5.43343 12.8913 5.315 12.0012 5.315C11.111 5.315 10.2294 5.43343 9.40916 5.66413C9.12662 5.74359 8.82344 5.69492 8.57997 5.53101C7.8274 5.02439 7.2056 4.72379 6.71079 4.58376C6.56735 5.23696 6.63814 5.77782 6.80336 6.19087C6.94565 6.54659 6.87219 6.95233 6.61423 7.23559C6.01715 7.8912 5.70116 8.69376 5.70116 9.63971C5.70116 12.8116 7.07225 13.9683 10.023 14.2999C10.8883 14.3971 11.2246 15.4769 10.5675 16.0482C10.3751 16.2156 10.1384 16.7802 10.1384 17.4121V20.5611C10.1384 21.5474 9.30356 22.2869 8.17878 22.09C7.63476 21.9948 7.27093 21.4766 7.36613 20.9326C7.43827 20.5204 7.75331 20.2116 8.13841 20.1276V19.1381C7.22829 19.1994 6.47656 19.0498 5.88401 18.6533Z' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/joonhwan-jeon-9009ba320/', print: 'linkedin.com/in/joonhwan-jeon-9009ba320', icon: 'M4.00098 3H20.001C20.5533 3 21.001 3.44772 21.001 4V20C21.001 20.5523 20.5533 21 20.001 21H4.00098C3.44869 21 3.00098 20.5523 3.00098 20V4C3.00098 3.44772 3.44869 3 4.00098 3ZM5.00098 5V19H19.001V5H5.00098ZM7.50098 9C6.67255 9 6.00098 8.32843 6.00098 7.5C6.00098 6.67157 6.67255 6 7.50098 6C8.3294 6 9.00098 6.67157 9.00098 7.5C9.00098 8.32843 8.3294 9 7.50098 9ZM6.50098 10H8.50098V17.5H6.50098V10ZM12.001 10.4295C12.5854 9.86534 13.2665 9.5 14.001 9.5C16.072 9.5 17.501 11.1789 17.501 13.25V17.5H15.501V13.25C15.501 12.2835 14.7175 11.5 13.751 11.5C12.7845 11.5 12.001 12.2835 12.001 13.25V17.5H10.001V10H12.001V10.4295Z' },
  { label: 'Email', href: 'mailto:teiresias1987@gmail.com', print: 'teiresias1987@gmail.com', primary: true, icon: 'M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z' },
  { label: 'KakaoTalk', href: 'https://open.kakao.com/o/sTkXJp4g', print: 'open.kakao.com/o/sTkXJp4g', icon: 'M5.67859 18.123C3.09315 16.5658 1.50098 14.112 1.50098 11.4052C1.50098 6.70096 6.24882 3 12.0009 3C17.753 3 22.501 6.70097 22.501 11.4052C22.501 16.1094 17.753 19.8104 12.0009 19.8104C11.5591 19.8104 11.1195 19.7883 10.6834 19.7446L6.91829 22.2026C6.3026 22.5286 5.96085 22.6281 5.4334 22.2685C4.8127 21.8453 4.83666 21.3768 5.05149 20.7096L5.67859 18.123ZM3.50098 11.4052C3.50098 13.5368 4.91871 15.5282 7.28204 16.7258L7.98846 17.0838L7.80187 17.8535L7.40093 19.5022L10.2003 17.6711L10.5665 17.7183C11.04 17.7794 11.5188 17.8104 12.0009 17.8104C16.7422 17.8104 20.501 14.8805 20.501 11.4052C20.501 7.92993 16.7422 5 12.0009 5C7.25967 5 3.50098 7.92991 3.50098 11.4052ZM17.908 11.0591L19.4215 13.214C19.5713 13.4273 19.5199 13.7217 19.3066 13.8714C19.2241 13.9293 19.1295 13.9573 19.0357 13.9573C18.8873 13.9573 18.741 13.8873 18.6491 13.7565L17.2213 11.7236L16.7937 12.1373V13.5C16.7937 13.7606 16.5825 13.9719 16.3218 13.9719C16.0613 13.9719 15.8499 13.7606 15.8499 13.5V12.0611C15.8325 11.9879 15.8321 11.9123 15.8499 11.8393V9.28226C15.8499 9.02172 16.0613 8.81038 16.3218 8.81038C16.5825 8.81038 16.7937 9.02172 16.7937 9.28226V10.8239L18.7219 8.95788C18.9094 8.77668 19.2081 8.78172 19.3893 8.96882C19.5705 9.15617 19.5656 9.45485 19.3783 9.63617L17.908 11.0591ZM14.9503 12.9839C15.211 12.9839 15.4222 13.1952 15.4222 13.4557C15.4222 13.7164 15.211 13.9276 14.9503 13.9276H13.0184C12.7579 13.9276 12.5467 13.7164 12.5467 13.4557V9.29702C12.5467 9.03648 12.7579 8.82514 13.0184 8.82514C13.2791 8.82514 13.4904 9.03648 13.4904 9.29702V12.9839H14.9503ZM9.09318 11.8925H10.4265L9.78919 10.1849L9.09318 11.8925ZM11.6159 12.3802L11.9612 13.3054C12.0524 13.5497 11.9284 13.8216 11.6842 13.9126C11.6298 13.9329 11.5741 13.9425 11.5193 13.9425C11.3278 13.9426 11.1479 13.8254 11.077 13.6356L10.7787 12.8364H8.70852L8.37749 13.6486C8.2792 13.89 8.00378 14.006 7.76242 13.9076C7.52107 13.8092 7.40519 13.5337 7.50348 13.2924L9.16453 9.21669C9.28066 8.93672 9.53948 8.76277 9.81761 8.77028C10.1005 8.77815 10.3468 8.9639 10.4452 9.24376L11.4906 12.0445C11.5687 12.1287 11.6175 12.2405 11.6175 12.3645C11.6175 12.3699 11.6161 12.3748 11.6159 12.3802ZM8.29446 9.30194C8.29446 9.56249 8.08312 9.77382 7.82258 9.77382H6.68212V13.5099C6.68212 13.7705 6.47078 13.9817 6.21012 13.9817C5.94957 13.9817 5.73824 13.7705 5.73824 13.5099V9.77382H4.57822C4.31755 9.77382 4.10622 9.56249 4.10622 9.30194C4.10622 9.0414 4.31755 8.83006 4.57822 8.83006H7.82258C8.08312 8.83006 8.29446 9.0414 8.29446 9.30194Z' },
]
// Favicon, home-screen icon and share card come from the hand-drawn portrait (static/).
const ASSETS = ['favicon.ico', 'favicon.svg', 'icon-192.png', 'apple-touch-icon.png', 'og-en.png', 'og-ko.png']
// Tab icons are transparent; the SVG one turns white on dark browser chrome. The apple-touch-icon
// keeps its paper background because iOS fills transparency with black.
const ICONS = `<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#111113" media="(prefers-color-scheme: dark)">`
const NEW_TAB = 'target="_blank" rel="noopener"'
const APPS = 'https://apps.joon.is-a.dev/' // project hub, a separate site
// The hub is another origin, so carry the reader's language over:
// the hub has an /en/ path; each app's i18next detector reads ?lng=.
const appLink = (href, lang) => href === APPS ? (lang === 'en' ? `${APPS}en/` : APPS) : `${href}?lng=${lang}`
const linkAttrs = (href) => (href.startsWith('http') ? ` ${NEW_TAB}` : '')
// Contents entries written as "Name — description" show the name with the description beneath it.
const tocEntry = (text) => {
  const [name, ...rest] = text.split(' — ')
  return rest.length ? `<span class="tn">${name}</span><span class="td">${rest.join(' — ')}</span>` : text
}
// Top-level entries hold their sub-entries in a nested list with a fold button, so a long list
// (career) can be shortened to the companies. The script folds every group but the one being read.
function tocTree(toc, t) {
  const item = (h) => `<a href="#${h.id}">${tocEntry(h.text)}</a>`
  const groups = []
  for (const h of toc) {
    if (h.n === 2 || !groups.length) groups.push({ h, kids: [] })
    else groups.at(-1).kids.push(h)
  }
  return groups.map(({ h, kids }) => {
    if (!kids.length) return `<li class="l${h.n}">${item(h)}</li>`
    const id = `toc-${h.id}`
    return `<li class="l${h.n} group"><div class="row">${item(h)}<button type="button" class="fold" aria-expanded="true" aria-controls="${id}" aria-label="${h.text.split(' — ')[0]} ${t.sub}"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 13.17L16.95 8.22L18.36 9.64L12 16L5.64 9.64L7.05 8.22L12 13.17Z"/></svg></button></div><ol id="${id}">${kids.map((k) => `<li class="l${k.n}">${item(k)}</li>`).join('')}</ol></li>`
  }).join('')
}
const icon = (d) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`
const url = (lang, path) => `${SITE}/${lang === 'ko' ? 'ko/' : ''}${path}`
// Cache-bust the stylesheet: the URL changes whenever its content does.
const CSS = `/style.css?v=${createHash('sha1').update(readFileSync(new URL('../static/style.css', import.meta.url))).digest('hex').slice(0, 8)}`
// Last update = the last commit that touched the page's Markdown (KST), so a style-only deploy
// doesn't move it. Falls back to today when git history isn't there (needs fetch-depth: 0 in CI).
const NOW = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 19) + '+09:00'
function updated(name, lang) {
  try {
    const d = execFileSync('git', ['log', '-1', '--format=%cd', '--date=iso-strict-local', '--', `content/${name}.${lang}.md`], { cwd: new URL('..', import.meta.url), env: { ...process.env, TZ: 'Asia/Seoul' }, encoding: 'utf8' }).trim()
    return d || NOW
  } catch { return NOW }
}
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

const EMOJI = /^(?:\p{Extended_Pictographic}|\uFE0F|\u200D)+\s*/u
const FACTS = 'Problem|Engineering Challenge|Design Decision|Evidence'
const slug = (s) => s.replace(/<[^>]+>/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')

function toHtml(body, tocDepth, t, lang) {
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
    // Each cell carries its column name, so phones can show rows as labelled cards.
    .replace(/<table>[\s\S]*?<\/table>/g, (table) => {
      const labels = [...table.match(/<thead>[\s\S]*?<\/thead>/)[0].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => esc(m[1].replace(/<[^>]+>/g, '').trim()))
      return table.replace(/<tr>[\s\S]*?<\/tr>/g, (row) => { let i = 0; return row.replace(/<td(?=[ >])/g, () => `<td data-label="${labels[i++] ?? ''}"`) })
        // A first cell written "Name — description" (project lists) shows the description beneath the name.
        .replace(/(<tr>\s*<td[^>]*>)((?:(?!<\/td>)[\s\S])*?) — ((?:(?!<\/td>)[\s\S])*?)<\/td>/g, '$1<span class="pn">$2</span><span class="pd">$3</span></td>')
        .replace(/^<table>(?=[\s\S]*class="pn")/, '<table class="projects">')
    })
    .replace(/href="(https:\/\/apps\.joon\.is-a\.dev\/[^"?#]*)"/g, (_, href) => `href="${appLink(href, lang)}"`)
    // Web links open in a new tab, so the resume stays where the reader left it.
    .replace(/<a href="(https?:[^"]+)">([\s\S]*?)<\/a>/g, (_, href, text) => `<a href="${href}" ${NEW_TAB}>${text}<span class="sr"> ${t.newTab}</span></a>`)
    .replace(/<table( class="projects")?>/g, '<div class="table-wrap"><table$1>')
    .replace(/<\/table>/g, '</table></div>')
  return { html, toc }
}

// Contents behaviour: a floating island in the bottom-right corner. Folded it is a "Contents" button;
// opened it is a card with the list.
// - It starts open on every screen. Where it would cover the text (narrower than the margin beside the
//   document fits), it folds once a link is picked, and also on a click outside it; Escape folds it anywhere.
// - Groups (a company and its projects) open one at a time: opening one folds the others. The group
//   being read opens as the reader scrolls into it.
// - --header-h follows the real sticky header, which wraps to more than one row.
// - The section being read is marked and kept visible in the list.
// - The folded button hides over the footer, so it never covers the contact buttons.
const TOC_SCRIPT = `(() => {
  const root = document.documentElement, header = document.querySelector('.top')
  const toc = document.querySelector('.toc'), details = toc.querySelector('details'), list = details.querySelector('ol')
  const links = [...toc.querySelectorAll('a')]
  const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
  const roomy = matchMedia('(min-width: 1280px)')
  const groups = [...toc.querySelectorAll('.group')]
  const fold = (g, open) => { g.querySelector('.fold').setAttribute('aria-expanded', open); g.querySelector('ol').hidden = !open }
  const only = (g) => groups.forEach((x) => fold(x, x === g))
  only(null)
  toc.addEventListener('click', (e) => {
    const b = e.target.closest('.fold')
    if (b) { const g = b.closest('.group'); only(b.getAttribute('aria-expanded') === 'true' ? null : g); spy(); return }
    if (e.target.closest('a') && !roomy.matches) details.open = false
  })
  document.addEventListener('click', (e) => { if (!roomy.matches && details.open && !toc.contains(e.target)) details.open = false })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && details.open) { details.open = false; if (toc.contains(document.activeElement)) details.querySelector('summary').focus() }
  })
  details.addEventListener('toggle', () => { if (details.open) spy() })
  new ResizeObserver(() => root.style.setProperty('--header-h', header.offsetHeight + 'px')).observe(header)
  let current, group, queued, foot
  function spy() {
    queued = false
    const line = Math.max(0, header.getBoundingClientRect().bottom) + 24
    let i = heads.findLastIndex((h) => h.getBoundingClientRect().top <= line)
    if (innerHeight + scrollY >= root.scrollHeight - 2) i = heads.length - 1
    const a = links[i]
    if (a !== current) { current?.removeAttribute('aria-current'); a?.setAttribute('aria-current', 'location'); current = a }
    const g = a?.closest('.group') ?? null
    if (g !== group) {
      group?.classList.remove('active')
      if (g) { g.classList.add('active'); only(g) }
      group = g
    }
    if (a && details.open && a.offsetHeight) {
      const r = a.getBoundingClientRect(), c = list.getBoundingClientRect()
      if (r.top < c.top + 32) list.scrollTop -= c.top + 32 - r.top
      else if (r.bottom > c.bottom - 32) list.scrollTop += r.bottom - c.bottom + 32
    }
    foot ??= document.querySelector('.foot') // parsed after this script
    toc.classList.toggle('away', !details.open && foot?.getBoundingClientRect().top < innerHeight)
  }
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(spy) } }
  addEventListener('scroll', queue, { passive: true })
  addEventListener('resize', queue)
  details.open = true
  spy()
})()`

// Structured data for search engines: each page is a profile of one person, shared across
// languages through a fixed @id. worksFor / alumniOf live here, not in content/ — update on a job change.
const PERSON_ID = `${SITE}/#person`, SITE_ID = `${SITE}/#website`
function jsonLd(lang, path, meta, date) {
  const t = UI[lang]
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage', '@id': `${url(lang, path)}#webpage`, url: url(lang, path),
        name: meta.title, description: meta.description || meta.title, inLanguage: lang, dateModified: date,
        isPartOf: { '@id': SITE_ID }, mainEntity: { '@id': PERSON_ID },
      },
      {
        '@type': 'Person', '@id': PERSON_ID,
        name: t.name, alternateName: UI[t.otherLang].name, jobTitle: t.jobTitle, url: `${SITE}/`,
        image: `${SITE}/og-${lang}.png`, email: 'teiresias1987@gmail.com', sameAs: ['https://github.com/teiresias22', 'https://www.linkedin.com/in/joonhwan-jeon-9009ba320/'],
        worksFor: { '@type': 'Organization', name: 'ICU Company', url: 'https://icucompany.com' },
        alumniOf: { '@type': 'EducationalOrganization', name: 'SeSAC' },
        knowsLanguage: ['ko', 'en'],
        knowsAbout: ['Flutter', 'Dart', 'Swift', 'React', 'TypeScript', 'Laravel', 'PHP', 'Supabase', 'Firebase', 'AWS'],
      },
      { '@type': 'WebSite', '@id': SITE_ID, url: `${SITE}/`, name: UI.en.name, alternateName: UI.ko.name, publisher: { '@id': PERSON_ID } },
    ],
  }).replace(/</g, '\\u003c')
}

function page(lang, { name, path }) {
  const { meta, body } = load(name, lang)
  const t = UI[lang]
  const modified = updated(name, lang), date = modified.slice(0, 10)
  const { html, toc } = toHtml(body, PAGES.find((p) => p.name === name).toc, t, lang)
  const tocHtml = `<nav class="toc" id="toc" aria-label="${t.toc}"><details><summary><svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 4H21V6H3V4ZM3 11H15V13H3V11ZM3 18H21V20H3V18Z"/></svg><span>${t.toc}</span></summary><ol>${tocTree(toc, t)}</ol></details></nav>`
  const nav = PAGES.map((p) => {
    const href = `/${lang === 'ko' ? 'ko/' : ''}${p.path}`
    return `<a href="${href}"${p.name === name ? ' aria-current="page"' : ''}>${t[p.name]}</a>`
  }).join('')
  const langs = [['en', 'English'], ['ko', '한국어']].map(([l, label]) =>
    `<a href="${url(l, path).replace(SITE, '')}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="page"' : ''}>${label}</a>`).join('')
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
${ICONS}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${t.name}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description || meta.title)}">
<meta property="og:url" content="${url(lang, path)}">
<meta property="og:locale" content="${t.locale}">
<meta property="og:image" content="${SITE}/og-${lang}.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${t.name} — ${t.role}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${jsonLd(lang, path, meta, modified)}</script>
</head>
<body id="top">
<a class="skip" href="#main">${t.skip}</a>
<header class="top">
  <div class="wrap">
    <div class="who"><h1 class="name"><a href="/${lang === 'ko' ? 'ko/' : ''}">${t.name}</a></h1><span class="role">${t.role}</span><span class="links">${CONTACTS.map((c) => `<a href="${c.href}"${linkAttrs(c.href)} data-print="${c.print}">${c.label}</a>`).join('')}</span></div>
    <nav aria-label="Pages"><span class="seg">${nav}</span><a class="apps" href="${appLink(APPS, lang)}" ${NEW_TAB}>${t.apps}</a><span class="seg" role="group" aria-label="Language">${langs}</span></nav>
  </div>
</header>
<div class="layout">
${tocHtml}
<main id="main" class="doc">
${html}
</main>
</div>
<script>${TOC_SCRIPT}</script>
<footer class="foot">
  <div class="wrap">
    <section class="foot-cta" aria-labelledby="contact">
      <h2 id="contact">${t.contact}</h2>
      <p>${t.contactSub}</p>
      <div class="foot-links">
        ${CONTACTS.map((c) => `<a class="btn${c.primary ? ' primary' : ''}" href="${c.href}"${linkAttrs(c.href)}>${icon(c.icon)}${c.label}</a>`).join('\n        ')}
      </div>
    </section>
    <div class="foot-bottom">
      <span>© ${date.slice(0, 4)} ${t.name} · ${t.updated} <time datetime="${date}">${date}</time></span>
      <a href="#top">${t.top} ↑</a>
    </div>
  </div>
</footer>
</body>
</html>
`
}

// Not-found page, served by GitHub Pages for any missing path — so every URL in it is absolute.
function notFound() {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 · ${UI.en.name}</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="${CSS}">
${ICONS}
</head>
<body>
<header class="top">
  <div class="wrap"><div class="who"><p class="name"><a href="/">${UI.en.name}</a></p></div></div>
</header>
<main class="doc notfound">
  <p class="code">404</p>
  <h1>페이지를 찾을 수 없습니다</h1>
  <p lang="en">This page doesn't exist — it may have moved.</p>
  <div class="foot-links">
    <a class="btn primary" href="/ko/">${UI.ko.resume}</a>
    <a class="btn" href="/" lang="en">${UI.en.resume}</a>
  </div>
</main>
</body>
</html>
`
}

// Sitemap: each page with its language alternates and last content update.
function sitemap() {
  const alt = (path) => ['en', 'ko'].map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${url(l, path)}"/>`).join('')
  const urls = PAGES.flatMap((p) => ['en', 'ko'].map((l) => `<url><loc>${url(l, p.path)}</loc><lastmod>${updated(p.name, l).slice(0, 10)}</lastmod>${alt(p.path)}</url>`))
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
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
writeFileSync(new URL('404.html', out), notFound())
writeFileSync(new URL('sitemap.xml', out), sitemap())
writeFileSync(new URL('robots.txt', out), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
// Pointer for AI crawlers that read llms.txt (Google Search ignores it).
writeFileSync(new URL('llms.txt', out), `# ${UI.en.name}\n\n> ${UI.en.role}\n\n${['en', 'ko'].flatMap((l) => PAGES.map((p) => `- [${UI[l].name} — ${UI[l][p.name]}](${url(l, p.path)})`)).join('\n')}\n`)
for (const f of ['style.css', ...ASSETS]) copyFileSync(new URL(`../static/${f}`, import.meta.url), new URL(f, out))
// App support form, opened by the apps' settings menus. GitHub Pages serves contact.html at /contact.
writeFileSync(new URL('contact.html', out), readFileSync(new URL('../static/contact.html', import.meta.url), 'utf8').replace('/style.css', CSS).replace('<!-- icons -->', ICONS))
copyFileSync(new URL('../CNAME', import.meta.url), new URL('CNAME', out))
console.log('built dist/')
