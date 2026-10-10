---
title: Joonhwan Jeon — Career
description: Project-by-project career details of Joonhwan Jeon — problem, engineering challenge, design decision and evidence.
---

> 📌 Work experience, project by project: company work → team / side projects → personal projects.

---

# 🏢 ICU Company

**Flutter · React · Laravel · AWS · Firebase** | 2024.08 – present

> I am the **one person responsible for the app, partner/admin console, user web and backend API** of **KoreHalal**, a service for Muslim travelers. The team started as frontend 1 · backend 1 · designer 1 and was reorganized into **developer 1 · designer 1**; I took over the backend then and now **own the whole stack**. A feature ships through the server schema and API and all three client UIs in one cycle — after an incident where a change landed on one side only and devices behaved differently, I **wrote "app, web and console must always behave the same" into the repo rules**. Since the second half of 2026 I also build **internal sales and operations tools** such as overseas travel-agency discovery and travel quotes.

---

## KoreHalal Trip — app · partner/admin console · user web · backend

| Surface | Period | Role | Main tech |
| --- | --- | --- | --- |
| App (iOS · Android) | 2024.08 – present | Sole frontend (rebuilt 2025.01) | Flutter · Dart · Riverpod · Freezed · Firebase · PayPal · PostHog · Microsoft Clarity |
| Partner/admin console (Flutter Web) | 2025.11 – present | Sole frontend | Flutter Web · Dart · GoRouter · Table Calendar · fl_chart |
| User web (React) | 2026.02 – present | Sole frontend | React 19 · TypeScript · Zustand · PayPal SDK · i18next · Tailwind CSS 4 · Node.js 22 (Cloud Functions) |
| Backend (AWS serverless) | 2026.05 – present | Took over, sole operator | PHP 8.3 · Laravel 10 · Laravel Vapor · AWS Lambda · API Gateway · Aurora/RDS (MySQL) · DynamoDB · SQS · S3 · CloudFront · Firebase RTDB · FCM |

> **About 3,500 active installs** (peak about 8,000 on Google Play), mainly in **Singapore, Malaysia, Indonesia and Korea** — Arabic RTL and five languages are requirements that come from this market.

> Work that spans several surfaces is written **once per feature**. The tags next to each title show the surfaces it covers — `app` Flutter (iOS · Android) · `console` partner/admin web (Flutter Web) · `web` user web (React) · `server` Laravel backend

### Taking over the legacy app → full rebuild `app`

- **Problem** — The inherited app was a commercial template with MobX and a flat structure, so state management got more tangled with every feature
- **Engineering Challenge** — Production issues such as PayPal payment errors and social-login review requirements had to be handled first, on the inherited structure (shipped v1.0.0 – v1.0.6)
- **Design Decision** — Judged that reorganizing folders would not get past the limits and led a full rebuild in 2025.01 — 13 feature areas, each split into layers — data access → business rules → screens (layered architecture, Riverpod · Freezed)
- **Evidence** — New domains such as delivery, 1:1 chat, the barcode scanner and the airport board were added the same way on the rebuilt structure; about 3,500 active installs across 5 languages plus Arabic RTL

### Backend takeover · fixing security defects `server`

- **Problem** — I took over the main API server (Laravel Vapor · AWS Lambda) as its only operator, and it had accumulated authorization, payment and concurrency defects
- **Engineering Challenge** — 6 routes that let users read other people's bookings (IDOR), profile edits that could grant admin rights, PayPal charges not being recorded and zero-amount payments being created, orders created twice by a double click, and a community API that let anyone overwrite someone else's comment — author included
- **Design Decision** — "Does this user own this data?" is checked against what they actually belong to rather than their role, and the target of an edit comes only from the URL, never the request body. A shared safeguard (idempotency middleware) makes a repeated request run only once, reused across APIs. Login-refresh tokens are replaced on every use; if an already-replaced token shows up again after a 60-second grace period, it is treated as stolen and all of that user's tokens are revoked. Password hashing moved to argon2id, with existing users upgraded automatically at their next login
- **Evidence** — 9 community security issues and 6 IDOR routes fixed; PHPUnit (659 files) restored as a parallel pre-push gate; fixing 14 tests that actually checked nothing exposed bugs they had been hiding

### Removing per-request computation from list responses `server`

- **Problem** — Dashboard and search lists recomputed every product's price and coupon eligibility in PHP on every response
- **Engineering Challenge** — Cost grew as products × coupons × eligible targets, so lists got heavier as coupons piled up — and Lambda execution time is billed
- **Design Decision** — Discount-period and weekday checks moved from PHP loops into the database query, and for coupons "which products can use this coupon" is computed once in a single query, so each product is a quick lookup. Like, comment and review counts are no longer counted on every request — they are tallied nightly and updated only when they change
- **Evidence** — Counting queries (`withCount`) that ran on every response were removed from other APIs too; Lambda bills by execution time, so less computation is directly lower server cost

### Image upload — switching to direct S3 upload `server` `app` `console` `web`

- **Problem** — Photos passed through a proxy image server as multipart uploads, so high-resolution and multi-image uploads often failed
- **Engineering Challenge** — The ALB 10 MB payload limit, and three clients (app, console, web) all on the old path
- **Design Decision** — The server only issues a one-time upload address (presigned URL) saying "you may put this file here", and photos go from the app straight to S3 (they never pass through the server, so the 10 MB limit disappears). Files land in a temporary folder (deleted after 24 h) and are moved to permanent storage inside S3 once saved
- **Evidence** — After all three clients switched, the legacy route was removed only once CloudWatch showed zero traffic

### Making the server authoritative for prices and order gates (delivery · booking) `server` `app` `web`

- **Problem** — Fees are per item and currency conversion rounds per display unit, so a client imitating the rules ends up at minimum-order and free-delivery boundaries with "the screen says you can order, the server says no"
- **Engineering Challenge** — Two clients (app, web), display in the user's currency but payment in USD, and quote responses arriving out of order while the user types
- **Design Decision** — A pre-payment quote API (`POST /delivery/quote`) calculates both the amounts and "can this be ordered", and the app and web just display them. Prices show even before an address is entered, and a late, out-of-order response can never overwrite a newer quote. Applied to delivery first, then extended to bookings
- **Evidence** — Currency rounding errors at price-tier boundaries, mixed currencies on discount badges and mismatched amounts after switching currency were cleaned up; bookings and delivery now share one structure

### Customer ↔ business 1:1 chat `server` `app` `console` `web`

- **Problem** — Customers with a booking or order and the business need to talk from the app, the web or the partner console
- **Engineering Challenge** — Messages had to appear instantly (real-time) and never go missing (guaranteed delivery), a new room must not appear for every booking, and Firebase security rules had to work without adding a separate auth server
- **Design Decision** — One room per customer + business pair; bookings and orders only decide whether a chat may be opened. Messages are stored in MySQL, and the server writes a display copy into Firebase RTDB (a failed copy never fails the send). Anything real-time delivery misses is picked up by periodic fetches of "messages after the last one I have". The existing server issues the Firebase login tokens itself
- **Evidence** — App, console and web behave to one spec, with presence, typing, attachments, per-person read state, report/block and resend on failure

### Halal map · place directory pipeline `server` `web` `app` `console`

- **Problem** — The halal place map ran on a Google My Maps embed; it had to run on our own data and pick up new and closed places automatically
- **Engineering Challenge** — Matching data across external sources (Naver, Kakao, Google Place, TourAPI, LOCALDATA) and their call limits — a single quota error threw away every candidate collected so far, and a processing cap of 120 quietly dropped 58 of 178 target brands every run
- **Design Decision** — Designed the collection flow KML import → Naver matching → Kakao discovery (biweekly) → Google · TourAPI enrichment → LOCALDATA closure detection (grace → hidden → recheck). An error on one keyword no longer loses the rest, and runs cut short are posted to Slack as "stopped" — being mistaken for "checked everything" is more dangerous than the cap itself
- **Evidence** — App and web maps now use our own public Place DB API (KML fallback), and "nearby products" clicks on a place page measure map → booking conversion

### Location Information Act, Article 16 compliance `server` `console`

- **Problem** — The personal-location-data handling ledger and admin access logs must be kept for at least the legal six months
- **Engineering Challenge** — The four APIs that receive locations have many branches that finish early, so log entries were easy to miss — and logs must never be deleted too early by mistake
- **Design Decision** — Logs can only be added (append-only): there is no edit or delete feature and no automatic cleanup job. Logging happens at the request entry point (route middleware) rather than in each API, so no branch can skip it, and only when coordinates are actually present; identities are stored only as a member uuid or a hash of a guest's IP + UA
- **Evidence** — A read-only command for audit evidence (`evidence:password-hashing`) and a console screen for viewing location-data access logs

### Overseas travel-agency discovery pipeline (2026.09) `server` `console`

- **Problem** — Find overseas travel agencies to sell KoreHalal products without manual B2B prospecting
- **Engineering Challenge** — 22 sources in 20 countries in every format, deciding per site "does it sell Korea products?", and production Lambda limits (SQS visibility timeout, monthly budget)
- **Design Decision** — Countries with official lists are read from their registries, associations and trade-fair lists, one reader per source; countries without one are found through search and Google Places (scraping web pages was ruled out — it breaks terms of service and risks getting the server's IP blocked). AI only gives an opinion; rules make the final call — obvious cases are filtered out by rules first to cut AI calls, and if the sentence the AI cites as evidence isn't actually on the site, the answer is treated as made up and downgraded. To fit the server's time limit, work is cut into 45-second pieces that schedule the next piece themselves, and split by company number so several chains run in parallel
- **Evidence** — Loading on the production server was 10× slower than locally because every row made its own database round trips; fixed by querying 200 rows at a time and pinned by a test. Found that 72% of 2,740 queued pages never needed the AI and moved the filtering rules into one place; running in production from collection → judging → contacts → outreach kanban

### Other work

- `console` permissions for three roles — travel partner, delivery partner and admin (one account can hold several), `web` a layered structure where screens → screen logic → data → API depend in one direction only (MVVM)
- Coupons, group departures, date-range exceptions (holiday closures, special prices) and add-on options; real-time airport board, prayer times and Qibla correction; on-demand translation, contribution badges and a recommendation engine (Final Score)
- Halal barcode scanner — on-device OCR (Vision / ML Kit) + a local HACCP mirror and a three-level verdict engine
- 5 languages plus Arabic RTL, 293 hard-coded strings localized, 100 icon-only controls made accessible, SEO · GEO (JSON-LD · `llms.txt`)
- Analytics dashboard (8 calls → 1 aggregate endpoint, GA4 · Clarity compared side by side), PostHog · Clarity · GA4 payment-funnel tracking
- Travel quote builder (price snapshots · PDF), segmented push campaigns (900-second CLI dispatch), blog draft pipeline (only a human publishes)
- App stability (fixed duplicated characters when typing Korean by replacing the form library; recoverable errors separated from crash stats so only real failures show), Flutter 3.47 · Kotlin 2.3 · R8, deploy guards and multi-channel Slack alerts

---

## ICU Company website (marketing / lead generation)

| Item | Details |
| --- | --- |
| Period | 2025.09 – present |
| Role | Sole frontend developer |
| Platform | Web ([icucompany.com](https://icucompany.com)) |
| Main tech | React 19 · TypeScript · Vite · Firebase Hosting · Node.js 20 (Cloud Functions) · Vitest |

> Marketing / lead-generation website for ICU Company, an inbound travel agency specialized in halal travel — inquiry form, 4 SEO landing pages, multilingual hreflang

- **Problem** — Collect inquiries (leads) for a halal inbound travel agency and show up in search and AI answers
- **Engineering Challenge** — A React SPA looks empty to crawlers that don't run JavaScript (GPTBot, PerplexityBot and others), and several KoreHalal sites in the same account made deploying to the wrong one a real risk
- **Design Decision** — Every page is generated as finished HTML at build time (prerendering), so crawlers that don't run JavaScript still read titles, descriptions and structured data, while react-helmet-async keeps them in sync in the browser. Inquiry form → Firestore → Cloud Function → real-time Slack alert; before each deploy, the target project is checked against an allow list
- **Evidence** — Lighthouse SEO 100 and CLS 0.001, Vitest + GitHub Actions CI

---

# 🏢 MarkCloud

**Swift · Flutter · Firebase** | 2022.11 – 2024.01

> A startup applying AI to intellectual property such as trademarks and patents — I built the mobile apps for **AI trademark search (MarkView)** and the **patent-attorney matching platform (MarkTong)**, and **led MarkView's move to Flutter**.

---

## MarkView — AI image & text trademark search

| Item | Details |
| --- | --- |
| Period | 2023.03 – 2024.01 |
| Role | Sole frontend developer |
| Platform | iOS → iOS + Android (after the Flutter migration) |
| Main tech | Swift · SwiftUI (first) → Flutter · Dart · Provider · go_router (second) · Firebase |

> An AI image and text trademark search app — started in Swift, then led the move to Flutter

- **Problem** — The AI trademark search app existed only on iOS and had to reach Android
- **Engineering Challenge** — Moving an app built in Swift · SwiftUI to cross-platform without losing its UI spec, and keeping large image searches and loading fast
- **Design Decision** — Led the Flutter migration with MVVM + Provider · go_router, defining design tokens and shared components first so the Swift version's UI spec carried over unchanged
- **Evidence** — Image search 50% faster; part of the product shown at CES 2023

---

## MarkTong — patent-attorney matching iOS app

| Item | Details |
| --- | --- |
| Period | 2022.11 – 2023.03 |
| Role | Lead iOS developer |
| Platform | iOS (Swift · UIKit, released on the App Store as v2.0.1) |
| Main tech | Swift · UIKit · Firebase (Auth · Realtime Database · Storage · FCM · Analytics · Dynamic Links) · Alamofire · MessageKit · Iamport · Kakao Local API · MapKit |

> A matching platform connecting patent, trademark and design applicants with patent attorneys — designed and maintained a UIKit codebase of 211 Swift files and **about 27k lines** on my own

- **Problem** — An iOS app for a platform matching patent, trademark and design applicants with patent attorneys
- **Engineering Challenge** — Two roles, applicant and attorney, with different sign-up, profiles and screens; real-time 1:1 chat with per-room unread badges
- **Design Decision** — Sign-up flows and my-pages split by role; MessageKit chat UI synced through Firebase RTDB, counting unread messages per room by comparing against the last-read position (`last_read_index`) and showing them as an app-icon badge. Iamport identity verification, nearby-attorney search with Kakao Local + MapKit, and AI attorney recommendations from an in-house server
- **Evidence** — 211 Swift files (about 27k lines) designed and maintained alone, released on the App Store as v2.0.1, sign-up → interest → consultation funnel tracked with Firebase Analytics

---

# 🤝 Team / side projects

> I kept a team together with people I met on a side project (Housetainer · Interstyle, 2024.01 – 2024.05): we built **Travel Buddy** at a hackathon and are now building **moit**. Because we keep working with the same people, we skip re-negotiating roles and go straight to building. My company work is a one-person frontend and my personal projects are solo, so **moit is the only project where I share a codebase with another frontend developer**.

---

## Travel Buddy (hackathon)

| Item | Details |
| --- | --- |
| Period | 2024.08 (about 10 days) |
| Role | Sole frontend developer |
| Platform | iOS · Android (Flutter) |
| Main tech | Flutter · Riverpod codegen · Freezed · Supabase (Edge Functions · vector embeddings) · Google Maps |

> An app for finding travel companions with an AI that plans the trip with you — social login through the AI planner and map routes built **within the 10-day hackathon**

### Highlights

- Supabase **Edge Functions** (`get-embedding` · `summarize`) summarize itineraries and store them as **vector embeddings** — embeddings on both users and posts form the basis for taste matching, plus a conversational AI planner (Buddie)
- Companion posts and profiles, Google · Apple sign-in, saving and loading **Google Maps** routes
- Even for a short project, a **Riverpod codegen + Freezed** structure kept new screens and models fast to add

---

## moit

| Item | Details |
| --- | --- |
| Period | 2024.10 – present (beta in continued development after a 3-month MVP) |
| Role | App co-developed by two · web solo |
| Platform | iOS · Android · Web (Next.js · Flutter Web) |
| Main tech | Flutter 3.44 · Riverpod codegen · go_router · Freezed · Supabase · Flutter Web · Next.js 16 · React 19 |

> A community app for finding and joining local classes and small-group meetups — pivoted to a class / meetup marketplace in 2026.

- **Problem** — A marketplace for finding and joining local classes and small groups. The app shares one codebase with another frontend developer, and I build the web (Next.js) alone
- **Engineering Challenge** — Keeping web and app screens and behavior the same while the app kept changing. Even with matching design tokens, screen-level differences kept growing; putting Flutter web inside a frame (iframe) made Safari separate storage between domains and drop the login, and social login doesn't work inside a frame
- **Design Decision** — The app is the design source of truth: `sync-design` regenerates web CSS tokens from the Dart theme and icons and fails CI when they drift. To avoid building every screen twice, the Flutter web build is placed in a frame inside Next.js pages but served from the same domain so the login is shared, and social login is handled by a popup on the outer page. The switch is one environment variable (`NEXT_PUBLIC_APP_FRAME`), so rolling back needs no code deploy. For two-person work, the in-feature `data / domain / presentation` structure is fixed in docs
- **Evidence** — Removing `dart:io` and unused fonts cut the web first load from 28.9 MB to 15.7 MB and the app by 13 MB; an A/B bug that alternated variants for the same account was fixed with fixed assignment, stopping experiment-data pollution

---

# 🌟 Personal projects (solo)

> Planning, design, development and release all done alone. **5 apps are live on the App Store and Google Play**, and 2 more are coming soon. I care less about the number of apps than about **keeping many apps maintainable by one person** — landing pages and terms are generated and deployed from the `joon-dev` monorepo, and one tag push ships iOS and Android together. The marketing automation that promotes the apps is listed separately at the end.

---

## Color of Days

| Item | Details |
| --- | --- |
| Period | 2024.03 – present |
| Platform | iOS · Android (live) · site [apps.joon.is-a.dev/colorofdays](https://apps.joon.is-a.dev/colorofdays/) |
| Main tech | Flutter · Riverpod · Freezed · Supabase (Edge Functions · pg_cron) · Firebase · home_widget · fl_chart · local_auth |

> A mood diary that records each day as one of seven colors — yearly calendar, stats, recaps and home/lock-screen widgets; my longest-running personal app

- **Problem** — A mood record that only takes picking a color, even on days you don't feel like writing — and the entries should come back as a year of patterns
- **Engineering Challenge** — Getting meaningful insight from entries that are just a color and a short note (when insights relied on tags, a user with 800 days of entries still saw "need more data"); a streak computed separately on client and server that could disagree; and an AI recap that must not send anyone's diary text
- **Design Decision** — Insights, weekly/monthly recaps and tag suggestions are computed on the device by standalone functions with no server involved, pinned by unit tests; insights read color, weekday and tags, so they work without tags. One streak function is the single source, and the evening "your streak is about to break" push (Edge Function + pg_cron) is tested to follow the same rule. The AI recap sends only color sequences and tag counts, never diary text, falls back to prepared copy on failure, and can be switched off remotely without an app update
- **Evidence** — 59% of sign-ups write entries (31 per writer on average, up to 855); interactive home-screen and iOS lock-screen widgets let users pick a color without opening the app

---

## Time with Me

| Item | Details |
| --- | --- |
| Period | 2024.06 – present |
| Platform | iOS · Android (Flutter, live) · site [apps.joon.is-a.dev/time-with-me](https://apps.joon.is-a.dev/time-with-me/) |
| Main tech | Flutter · Supabase · Google Maps · home_widget · Firebase |

> A shared calendar where friends, families and couples record memories together

- **Problem** — People want one shared calendar, but copying booking details in by hand is tedious
- **Engineering Challenge** — Turning free-form booking messages into reliable events, and anniversaries (yearly, multi-day, across New Year) that showed up on different dates on different screens
- **Design Decision** — The user shares the message to the app; an Edge Function parses it with Gemini structured output and pre-fills only when the reservation flag, confidence ≥ 0.5 and the time parse all pass. Background SMS detection was ruled out for platform policy and privacy. Recurring events are stored as one row and computed at display time, with one `occursOn` function replacing four duplicated checks
- **Evidence** — Live on the App Store and Google Play; invite links sent before a domain migration still open the app

---

## Yeowun

| Item | Details |
| --- | --- |
| Period | 2026.01 – present |
| Platform | iOS · Android (live) · site [apps.joon.is-a.dev/yeowun](https://apps.joon.is-a.dev/yeowun/) |
| Main tech | Flutter · Supabase · PostGIS · Google Gemini AI · Firebase Hosting |

> A location-based journal: photos and notes left at a place open for other users when they get nearby

- **Problem** — Let travelers leave records at real places that only people who come nearby can open
- **Engineering Challenge** — iOS can monitor only 20 regions in the background, while any number of notes can be around the user
- **Design Decision** — Monitor the 18 nearest notes plus one 3 km "re-centering" geofence; leaving it refreshes the set. Chosen over continuous background GPS, which drains battery and is hard to justify in review. Journeys are rebuilt from photo EXIF GPS with proximity clustering and PostGIS instead of manual entry
- **Evidence** — Live on the App Store and Google Play, with Gemini-generated travel badges and recaps

---

## Gilmok

| Item | Details |
| --- | --- |
| Period | 2026.03 – present |
| Platform | iOS · Android · Web (Flutter, live) · web [apps.joon.is-a.dev/gilmok](https://apps.joon.is-a.dev/gilmok/) |
| Main tech | Flutter · Dart · Riverpod · Drift (SQLite) · Supabase · flutter_map · Firebase |

> An offline-first map app that brings in places saved in Google My Maps and works without a network

- **Problem** — Places saved in My Maps are useless abroad, exactly where there's no data connection
- **Engineering Challenge** — Importing whole maps from one URL and re-syncing them, and drawing thousands of markers smoothly on a phone over offline tiles
- **Design Decision** — Drift (SQLite) is the source of truth and Supabase only an optional sync layer, so every feature works without a network (a cloud-first design would fail where it's needed most). Supercluster clustering instead of drawing every marker, and flutter_map driven directly, without wrappers, to control tile caching
- **Evidence** — Live on the App Store and Google Play; users' maps hold up to 2,798 markers on a single map (8,002 in total) and render without slowdown

---

## Pick and Go

| Item | Details |
| --- | --- |
| Period | 2026.06 – present |
| Platform | iOS · Android (Flutter, live) · site [apps.joon.is-a.dev/pick-and-go](https://apps.joon.is-a.dev/pick-and-go/) |
| Main tech | Flutter · Dart · Riverpod · Freezed · go_router · Neon (serverless PostgreSQL) · Firebase |

> Draws random trip courses you can actually reach, given your location, transport and time — like a game

- **Problem** — Random trip ideas are fun until they land somewhere you can't reach with the time and transport you have
- **Engineering Challenge** — The same transfer station is named differently on different subway lines, which breaks direct and one-transfer route finding
- **Design Decision** — Filter first, then draw: candidates are limited to per-transport distance ranges before the random pick, so every result is reachable (drawing first and re-rolling wastes draws and can loop). Station names are normalized before routes are computed
- **Evidence** — Live on the App Store and Google Play, with roulette / ladder / card-draw UI and a couple mode for taking turns

---

## Discard — a museum of the things I let go

| Item | Details |
| --- | --- |
| Period | 2026.10 – present |
| Platform | iOS · Android (Flutter, coming soon) · site [apps.joon.is-a.dev/discard](https://apps.joon.is-a.dev/discard/) |
| Main tech | Flutter · Riverpod · go_router · Drift (SQLite) · Neon (Data API · Storage · Functions) · Firebase (Auth · App Check · Analytics · Crashlytics) · Apple Vision / ML Kit · home_widget |

> Records what you throw away like numbered museum exhibits and shows your buying and owning patterns

- **Problem** — What you throw away says as much about your habits as what you buy, but there's no way to see that pattern
- **Engineering Challenge** — Local-first sync across devices: device clocks only store seconds and can't order edits within the same second, two devices can create the same exhibit number, and a sync's own writes could trigger the next sync forever
- **Design Decision** — Drift is the source of truth; Neon Data API (Firebase login + row-level permissions) syncs only "what changed since last time", measured by the server's clock rather than the device's, and duplicate numbers are resolved by a rule every device computes identically. Photos never get direct storage access — a server function checks size/count limits and that the request comes from the genuine app (App Check) before issuing a one-time upload address. Subject cutouts run on-device (Vision / ML Kit), so photos aren't sent anywhere to be processed
- **Evidence** — 42 unit and migration tests covering sync, domain rules and schema upgrades

---

## Almost — a graveyard for things you almost did

| Item | Details |
| --- | --- |
| Period | 2026.10 – present |
| Platform | iOS · Android (Flutter, coming soon) · site [apps.joon.is-a.dev/almost](https://apps.joon.is-a.dev/almost/) |
| Main tech | Flutter · Riverpod · go_router · CustomPainter · Neon (Postgres · Data API) · Firebase (Auth · Analytics · Crashlytics) · flutter_local_notifications |

> Write down what you want to do and it checks in when it's time; finished goals become flowers in a garden, abandoned ones a gravestone in a cemetery

- **Problem** — Things you meant to do fade away quietly. Check in when it's time, and keep finished goals as flowers and abandoned ones as gravestones to look back on
- **Engineering Challenge** — There is no app server: the client talks to Postgres through Neon Data API, so the database must enforce ownership, limits and paid items. Right after the database woke from sleep, a freshly issued login token could leave the user id unreadable, and the permission rules silently returned no rows instead of an error
- **Design Decision** — Rules live inside Postgres (row-level permissions, triggers, value constraints; other people's public cemeteries are readable only through dedicated functions) instead of a backend I'd have to run. When the user id can't be read, the database now returns an error instead of nothing, and the app retries automatically. Check-in reminders are rescheduled to the nearest 50 to stay under iOS's 64 pending-notification limit
- **Evidence** — A 16-step server E2E script exercises RLS, triggers and RPCs with several anonymous users; 57 Flutter tests, including one that checks the in-app catalog against the server seed

---

## Nureongso — elected officials' pledges and public record

| Item | Details |
| --- | --- |
| Period | 2026.09 – present |
| Platform | Web ([nureongso.joon.is-a.dev](https://nureongso.joon.is-a.dev), live) |
| Main tech | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (PostgreSQL) · Python (httpx · psycopg · pdfplumber) · Gemini · GitHub Actions · Vercel |

> Shows, side by side and from public records, what elected officials promised, how much they kept, and what they did in office — it carries only records published by official agencies, never opinions

- **Problem** — Campaign booklets alone don't tell voters what an incumbent did last term, and pledges and records are scattered across six agencies as APIs, spreadsheets and PDFs
- **Engineering Challenge** — Getting complete, correct data: an API that, called without a key, ignores paging and keeps returning the same 5 rows with a normal total count; attendance and side-job data that identify members only by name, mixed with hanja, spacing and bracket variants
- **Design Decision** — The LLM only judges "is this record the same thing as this pledge?"; whether a pledge is fulfilled is decided by a published SQL rule table — reruns give the same answer and anyone can audit it. Pledges with nothing measurable are left as "cannot judge" instead of being forced into a verdict (only about 10% of lawmakers' pledges are legislative)
- **Evidence** — 21,336 pledges extracted from 1,683 election bulletins; records for 3,239 lawmakers and 259 governors, mayors and superintendents refreshed by scheduled GitHub Actions; source code and judging rules are public

---

## joon-dev web (personal project hub)

| Item | Details |
| --- | --- |
| Period | 2026.07 – present |
| Platform | Web ([apps.joon.is-a.dev](https://apps.joon.is-a.dev/)) |
| Main tech | pnpm monorepo · Vite + React · Next.js 16 · TypeScript · Firebase Hosting · GitHub Actions |

> A pnpm monorepo that merged every app's separate landing and terms sites into one Firebase Hosting site

- **Problem** — Each app had its own hosting site, landing page and terms, and adding an app meant editing several config files by hand
- **Engineering Challenge** — Serving Vite and Next.js apps under subpaths of one Firebase Hosting site — rewrites, cache headers, and a blank page when an app was opened without a trailing slash
- **Design Decision** — One `apps.config.json` generates the sitemap, Remote Config and Hosting rewrites/headers/redirects, so none of them are edited by hand. The trailing-slash fix uses a regular expression, because Firebase's simple patterns (glob) ignore the slash and would redirect forever
- **Evidence** — Every push to master builds, deploys and runs a smoke check that requests every subpath for HTTP 200 and a page title

---

## Multi-app marketing automation (separate system for promoting my own apps)

| Item | Details |
| --- | --- |
| Period | 2026.04 – present (since automated publishing) |
| Platform | Threads · Instagram (four of my apps on one account) |
| Main tech | Claude Agent SDK · Supabase (pg_cron · pg_net) · Threads / Instagram Graph API · UTM redirector |

> A multi-agent posting and tracking system for promoting apps I built alone, without a marketing team

- **Problem** — Four solo-built apps need steady promotion, and I need to know which posts actually lead to installs
- **Engineering Challenge** — Attribution. The post → click → install funnel looked healthy, but most clicks were crawlers; user-agent rules broke whenever crawlers changed versions, and widening them would drop real Android users on Chrome's reduced user agent
- **Design Decision** — Four agents (CMO · ContentWriter · PerformanceAnalyst · SocialMediaManager) split planning, writing and analysis, and publishing is run by scheduled jobs inside the database (Supabase pg_cron + pg_net) instead of GitHub Actions (five slots a day, routed per app). Bots are flagged by visit timing and IP history (arrival within 60 s of posting, the same user agent reappearing within 120 s, IPs already seen as bots), counting switched from a blacklist to a whitelist of real platforms (crawlers keep changing user agents, so a blacklist always lags), and past data was corrected
- **Evidence** — 625 posts auto-published to Threads and Instagram since April 2026. Bot counts are reported separately rather than hidden — if they drop to zero, the tracking itself has stopped
