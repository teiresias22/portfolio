// Shared loader for content/*.md: front matter + body.
import { readFileSync } from 'node:fs'

export function load(name, lang) {
  const raw = readFileSync(new URL(`../content/${name}.${lang}.md`, import.meta.url), 'utf8')
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/)
  const meta = {}
  if (m) for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: m ? raw.slice(m[0].length) : raw }
}

// Table rows holding {{PLACEHOLDER}} values are Notion-only (phone, birthdate).
// Their real values live in GitHub secrets, never in this public repo.
export const PLACEHOLDER = /\{\{(\w+)\}\}/g
