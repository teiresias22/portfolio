# joon.is-a.dev

Resume and career pages for Joonhwan Jeon. **`content/` is the single source** for both this site and the Notion pages.

| File | Web | Notion |
| --- | --- | --- |
| `content/resume.en.md` | `/` (default) | — |
| `content/resume.ko.md` | `/ko/` | 전준환 \| 이력서 |
| `content/career.en.md` | `/career/` | — |
| `content/career.ko.md` | `/ko/career/` | 전준환 \| 경력기술서 |

Edit the Markdown and push to `main`. GitHub Actions builds the site to GitHub Pages and, when a `*.ko.md` file changed, rewrites the matching Notion page. **Don't edit the Notion pages directly** — the next sync overwrites them. Keep the English and Korean files in step when you change content.

Rows with `{{PLACEHOLDER}}` values (phone, birthdate) are Notion-only: the web build drops them, and the real values come from repository secrets so they never live in this public repo.

## Secrets

- `NOTION_TOKEN` — internal integration token; share both Notion pages with the integration. Without it the sync step is skipped.
- `RESUME_PHONE`, `RESUME_BIRTHDATE` — values for `{{PHONE}}` and `{{BIRTHDATE}}`.

## Local

```bash
npm ci
npm run build              # → dist/
node scripts/sync-notion.mjs --dry   # show the Notion blocks without writing
```
