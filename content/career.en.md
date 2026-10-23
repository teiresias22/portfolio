---
title: Joonhwan Jeon — Career
description: Project-by-project career details of Joonhwan Jeon — problem, engineering challenge, design decision and evidence.
---

> 📌 Work experience, project by project: company work → team / side projects → personal projects.

---

# 🏢 ICU Company

**Flutter · React · Laravel · AWS · Firebase** | 2024.08 – present

> I am the **one person responsible for the app, partner/admin console, user web and backend API** of **KoreHalal**, a service for Muslim travelers. The team started as frontend 1 · backend 1 · designer 1 and was reorganized into **developer 1 · designer 1**; I took over the backend then and now **own the whole stack**. A feature ships through the server schema and API and all three client UIs in one cycle — after an incident where a change landed on one side only and devices behaved differently, I **wrote "client parity" into the repo conventions**. Since the second half of 2026 I also build **internal sales and operations tools** such as overseas travel-agency discovery, travel quotes and a unified inquiry inbox, and I am a **co-inventor on two patent applications** that came out of the service: halal verdicts and culture-aware search.

---

## KoreHalal Trip — app · partner/admin console · user web · backend

| Surface | Period | Role | Main tech |
| --- | --- | --- | --- |
| App (iOS · Android) · [App Store](https://apps.apple.com/app/id6736513932) · [Google Play](https://play.google.com/store/apps/details?id=com.korehalal.app) | 2024.08 – present | Sole frontend (rebuilt 2025.01) | Flutter · Dart · Riverpod · Freezed · Firebase · PayPal · PostHog · Microsoft Clarity |
| Partner/admin console (Flutter Web) | 2025.11 – present | Sole frontend | Flutter Web · Dart · GoRouter · Table Calendar · fl_chart |
| User web (React) | 2026.02 – present | Sole frontend | React 19 · TypeScript · Zustand · PayPal SDK · i18next · Tailwind CSS 4 · Node.js 22 (Cloud Functions) |
| Backend (AWS serverless) | 2026.05 – present | Took over, sole operator | PHP 8.3 · Laravel 10 · Laravel Vapor · AWS Lambda · API Gateway · Aurora/RDS (MySQL) · DynamoDB · SQS · S3 · CloudFront · Firebase RTDB · FCM |

> **About 3,500 active installs** (peak about 8,000 on Google Play), mainly in **Singapore, Malaysia, Indonesia and Korea** — Arabic RTL and five languages are requirements that come from this market.

> Work that spans several surfaces is written **once per feature**. The tags next to each title show the surfaces it covers — `app` Flutter (iOS · Android) · `console` partner/admin web (Flutter Web) · `web` user web (React) · `server` Laravel backend

### Taking over the legacy app → full rebuild `app`

- **Problem** — The inherited app was a **commercial template** with **MobX and a flat structure**,\
  so state management got more tangled with every feature
- **Engineering Challenge** — Production issues such as **PayPal payment errors** and **social-login review requirements** had to be handled first,\
  on the inherited structure (shipped v1.0.0 – v1.0.6)
- **Design Decision** — Judged that reorganizing folders would not get past the limits and led a **full rebuild** in 2025.01\
  — a **13-domain layered architecture** (Data Source → Repository → UseCase → ViewModel → View) with Riverpod · Freezed
- **Evidence** — New domains such as delivery, 1:1 chat, the barcode scanner and the airport board were **added the same way** on the rebuilt structure;\
  about **3,500 active installs** across **5 languages plus Arabic RTL**

### Backend takeover · fixing security defects `server`

- **Problem** — I took over the main API server (Laravel Vapor · AWS Lambda) as its **only operator**,\
  and it had accumulated **authorization, payment and concurrency defects**
- **Engineering Challenge** — Cross-account booking reads (**IDOR in 6 routes**), **self-escalation** through profile updates,\
  unrecorded PayPal charges and zero-amount payments, double submits,\
  and a community API that let anyone overwrite someone else's comment — author included
- **Design Decision** — Ownership guards switched from role-based to **scope-based** and pinned to "the route decides the target";\
  double submits handled by reusable idempotency middleware.\
  Refresh tokens rotate with **reuse detection** (a retry within a 10-minute grace gets the same response; reuse outside it is treated as theft and revokes them all);\
  passwords moved to **argon2id**, with legacy bcrypt hashes verified and then upgraded
- **Evidence** — **9 community security issues** and **6 IDOR routes** fixed;\
  PHPUnit (681 files) restored as a parallel pre-push gate;\
  fixing 14 assertions that checked nothing **exposed real defects** they had been hiding

### Removing per-request computation from list responses `server`

- **Problem** — Dashboard and search lists recomputed every product's price and coupon eligibility **in PHP on every response**
- **Engineering Challenge** — Cost grew as **products × coupons × eligible targets**, so lists got heavier as coupons piled up\
  — and **Lambda execution time is billed**
- **Design Decision** — Moved discount-period and weekday checks into **SQL conditions**,\
  and computed "the set of product UUIDs a coupon applies to" in **one indexed query** for O(1) lookups.\
  Like, comment and review stats were **denormalized** with nightly batches plus event sync
- **Evidence** — `withCount` aggregation that ran on every response was **removed**, including from other call sites;\
  less computation is directly **lower Lambda cost**

### Image upload — switching to direct S3 upload `server` `app` `console` `web`

- **Problem** — Photos passed through a **proxy image server** as multipart uploads,\
  so high-resolution and multi-image uploads **often failed**
- **Engineering Challenge** — The **ALB 10 MB payload limit**, and **three clients** (app, console, web) all on the old path
- **Design Decision** — The server only issues **presigned PUT URLs** and the bytes go from the client **straight to S3** (the limit disappears);\
  temp (24 h) → permanent storage is a **server-side S3 move**
- **Evidence** — After all three clients switched, the **legacy route was removed** only once **CloudWatch showed zero traffic**

### Making the server authoritative for prices, order gates and payments (delivery · booking) `server` `app` `web`

- **Problem** — Fees are **per item** and currency conversion **rounds per display unit**,\
  so a client imitating the rules ends up at minimum-order and free-delivery boundaries\
  with **"the screen says you can order, the server says no"**
- **Engineering Challenge** — **Two clients** (app, web), display in the user's currency but **payment in USD**,\
  and quote responses **arriving out of order** while the user types
- **Design Decision** — A **pre-payment quote API** (`POST /delivery/quote`) returns both the amounts and the gate decisions, and clients only render them.\
  Coordinates are optional so prices show before an address is entered, and an **ordering guard** stops a late, stale quote from overwriting a newer one.\
  Applied to delivery first, then extended to bookings.\
  Payment completion no longer trusts what the client sends either: a prepare/confirm flow has the **server look up the PayPal transaction itself** and check completion, USD and amount (2026.10)
- **Evidence** — Currency rounding errors at price-tier boundaries, mixed currencies on discount badges and mismatched amounts after switching currency were cleaned up;\
  bookings and delivery now **share one structure**.\
  The payment switch **removed the PayPal secret** from the app and web, and also closed reuse of one transaction ID, paid bookings completing as zero-amount, and an app approval return URL that sent users to a third-party domain.\
  Later I found the `web/*` responses behind the guest booking form were **handing out the live PayPal client_secret** and removed it from them

### Customer ↔ business 1:1 chat `server` `app` `console` `web`

- **Problem** — Customers with a booking or order and the business need to **talk from the app, the web or the partner console**
- **Engineering Challenge** — **Real-time delivery and guaranteed delivery** at once,\
  **one room per pair** rather than per booking,\
  and Firebase security rules **without new auth infrastructure**
- **Design Decision** — **Conversation key = (customer, business)**; bookings and orders are only the reason a chat is allowed.\
  **MySQL is the source of truth** and Firebase RTDB a real-time copy written only by the server (a failed mirror never breaks sending);\
  guaranteed delivery comes from **incremental polling** (`after_id`).\
  The server mints Firebase custom tokens
- **Evidence** — App, console and web **behave to one spec**,\
  with presence, typing, attachments, per-person read state, report/block and resend on failure

### Growing chat into support tooling and staff chat (2026.10) `server` `console` `app` `web`

- **Problem** — Using customer chat as a support channel lacked assignees, closing an inquiry and internal notes,\
  and staff conversations and event coordination **leaked into outside messengers** with no record
- **Engineering Challenge** — The same conversation tables now hold **messages customers must never see** (internal notes) and staff-only rooms;\
  edits and deletes must reach both the real-time copy and incremental polling;\
  and someone who loses staff status **must not stay in a room**
- **Design Decision** — Messages carry a `type` (normal · SYSTEM) and `visibility` (public · internal), and the **customer view only gets public ones** — notes are also left out of the RTDB mirror, Slack and previews.\
  Staff DMs are authorized by membership alone (no ADMIN bypass) and only members are mirrored to RTDB;\
  a confirmed quote **creates an event operations room automatically** (archived on cancel, auto-archived 7 days after the event).\
  Authors can edit or delete within 5 minutes, customers see only a "deleted" line, and changes travel through `changed_since`.\
  Every booking status change posts a SYSTEM notice in the business's name
- **Evidence** — Shipped in five stages (7a – 7e) across server, console, app and web:\
  auto-assignment and unanswered-first sorting, group rooms, mentions, pins and templates, translate-before-send (200 a day), ngram message search limited to conversations you can see, and a Slack bridge for group rooms.\
  Staff notifications go only to the console drawer with no app push; customers can mute a conversation for an hour or a day

### Rebuilding staff permissions (2026.10) `server` `console` `app`

- **Problem** — Permissions were just ADMIN in `roles[]` plus two levels (head · team lead),\
  so menus **couldn't be split by department** such as finance, sales and support
- **Engineering Challenge** — Live accounts and **older app versions had to keep working**,\
  and **edge-case data** during the move — admins with no organization mapping, accounts with a NULL email — could easily gain or lose access by mistake
- **Design Decision** — One department (`StaffRole`) → ability table, enforced **by the server** with `can:<ability>` on every route group.\
  Team membership moved to a `team_members` table through a four-step migration (M1 – M4) with backfill and **dual writes** to the old mapping,\
  and `/profile` keeps sending the old `roles[]` alongside the new `abilities` and `teams`.\
  Team routes check **403 before 404** so they never reveal whether someone else's team exists, and membership and role changes go to an audit log (before/after)
- **Evidence** — Pinned by a permission-matrix test; found and fixed accounts that slipped out of a demotion query through `NOT IN`'s NULL handling, and ADMIN holders outside the seed.\
  Console and app menus are gated by ability only (the dev-build bypass is gone), with team switching and owner-only team deletion

### Travel product cost sheets · price propagation (2026.10) `server` `console` `app`

- **Problem** — When hotel, meal or vehicle rates changed, the **products priced from them had to be fixed by hand**,\
  and turning an itinerary built as a quote into a product meant typing it all again
- **Engineering Challenge** — A rate row must **stay the same row** when its name (vehicle type, option) is edited, or links break;\
  rates have validity periods; and products whose margin a person set **must not be overwritten automatically**
- **Design Decision** — Rate rows get a uuid and are managed with natural-key upserts, soft deletes for missing rows and a change history; six rate tables gained **validity periods** (picked by today or the quote's start date).\
  Products link to rates through a **cost sheet**, and linked prices are locked (`PRICE_LINKED`).\
  Rate changes propagate per product policy — AUTO applies at once, REVIEW waits for approval, MANUAL only **flags margin erosion**.\
  A quote can be registered directly as an internal product with its cost sheet, prices and prefill, and a designer brief exports to Markdown, PDF or Notion
- **Evidence** — Shipped in seven server PRs, together with a supplier list (categories, rate-sheet files, expiry) and supplier assignment on arrangement rows;\
  an **impact preview** before saving, a pending-changes tab, price-history rollback and CSV import/export.\
  Rules such as "an n-person group price is the per-person price × n" and "party-size tiers must leave no gaps" are checked when a sheet is applied

### Halal map · place directory pipeline `server` `web` `app` `console`

- **Problem** — The halal place map ran on a **Google My Maps embed**;\
  it had to run on **our own data** and pick up new and closed places automatically
- **Engineering Challenge** — **Matching across external sources** (Naver, Kakao, Google Place, TourAPI, LOCALDATA) and their quotas\
  — one exception on the last keyword after hitting a quota **threw away every candidate collected**,\
  and a cap of 120 **dropped 58 of 178 eligible brands** in the same place every run
- **Design Decision** — Designed the **lifecycle** KML import → Naver matching → Kakao discovery (biweekly) → Google · TourAPI enrichment → LOCALDATA closure detection (grace → hidden → recheck).\
  Failures are **isolated per keyword** and truncated runs are posted to Slack as **"stopped"**\
  — reading as "covered everything" is more dangerous than the cap itself
- **Evidence** — App and web maps now use our own **public Place DB API** (KML fallback),\
  and "nearby products" clicks on a place page measure **map → booking conversion**

### Location Information Act, Article 16 compliance `server` `console`

- **Problem** — The personal-location-data handling ledger and admin access logs must be kept for **at least the legal six months**
- **Engineering Challenge** — **Early-return branches** in the four routes that receive coordinates made it easy to **miss a log entry**,\
  and logs must never be cut short by mistake
- **Design Decision** — **Append-only** by design, with no update or delete path and no automatic purge job.\
  Logging lives in **route middleware** and only records when coordinates are actually present;\
  identities are stored only as a member uuid or **a hash of a guest's IP + UA**
- **Evidence** — A **read-only command** for audit evidence (`evidence:password-hashing`)\
  and a **console screen** for viewing location-data access logs

### Overseas travel-agency discovery pipeline (2026.09) `server` `console`

- **Problem** — Find **overseas travel agencies** to sell KoreHalal products **without manual B2B prospecting**
- **Engineering Challenge** — **22 sources in 20 countries** in every format, deciding per site "does it sell Korea products?",\
  and **production Lambda limits** (SQS visibility timeout, monthly budget)
- **Design Decision** — Countries with official lists are read from their registries, associations and trade-fair lists, **one reader per source**;\
  countries without one are found through search and Google Places (scraping web pages was ruled out — it breaks terms of service and risks getting the server's IP blocked).\
  AI only gives an opinion; **rules make the final call** — obvious cases are filtered out by rules first to cut AI calls,\
  and if the sentence the AI cites as evidence isn't actually on the site, the answer is treated as made up and downgraded.\
  To fit the server's time limit, work is cut into **45-second pieces** that schedule the next piece themselves, and split by company number so several chains run in parallel
- **Evidence** — A production load bottleneck (**1/10 of local speed**) fixed with chunked queries and pinned by a test;\
  found that **72% of 2,740 queued pages** never needed the model and consolidated the prefilter in one place;\
  running in production from collection → judging → contacts → outreach kanban.\
  Then moved the step that finds each agency's contacts on LinkedIn (with role and match score) onto the server with Message Batches — it reproduced 6 of the 8 people the earlier Mac routine found at **about $0.08 per agency**, and dropping the "search at least twice" instruction fell to 3, showing most of the quality comes from the prompt's search instruction

### Unified inquiry inbox (2026.10) `server` `console` `web`

- **Problem** — Custom-trip and partner inquiry forms (Firebase Functions) and email inquiries lived in **separate places**,\
  so **nothing traced an inquiry** through to a quote
- **Engineering Challenge** — The mailbox holds more service notifications, trade-fair list spam and our own receipt emails than real inquiries,\
  and a reply **must not split off** into a new inquiry
- **Design Decision** — Forms post straight to the backend; mail is pulled over **POP3 every minute** (UIDL cursor, Message-ID dedup, nothing deleted)\
  and replies join the same inquiry thread via In-Reply-To/References.\
  AI **only advises** on type, party size, company, country and summary through structured output, and never overwrites a type a person set.\
  Spam rules were set from a **dry run** (`--sample=N`) showing real counts per reason, not by guesswork
- **Evidence** — A dry run on the **latest 300 emails** found, among 127 that passed, about 55 service notifications, about 40 list spam and 5 of our own receipts,\
  which went into the **filter rules**;\
  the console links type filters, the original thread, AI summary, sender/domain blocking (public mail domains can't be blocked whole) and **conversion to a quote**.\
  Then added a **WhatsApp Cloud API webhook** (signature check, one thread per number, number blocking) and console replies within the 24-hour window (recording which staff member sent them);\
  quoted replies join the quoted message's inquiry, and another quote from the same number can be **split into a new inquiry from a chosen message**;\
  the ICU website's contact and FIT forms moved into the inbox and the old Firebase Functions inquiry path was deleted. Per-person read state, a received-account filter and the cs@ mailbox were added

### Patent applications (2026.10)

- Two problems from the service were filed in the company's name (ICU Company) with me as a **co-inventor** (filed 2026.10.08, examination requested)
  - **Method for determining the halal status of a product based on the user's halal tolerance** (KR 10-2026-0193309)\
    — checks a barcode-identified product's ingredients against risk levels in an ingredient database and decides the verdict by **each user's own tolerance**
  - **Method for personalized natural-language search using a cultural-zone filter** (KR 10-2026-0193310)\
    — determines the user's cultural zone, finds candidates with that zone's filter and expanded search terms, and sets the **display order** for that zone

### Other work

- `console` three-role permissions for Provider · Place Provider · Admin (set-based `roles[]` checks, rebuilt as a department → ability table in 2026.10), `web` one-way MVVM layering (pages → viewmodels → repositories → api → stores)
- Coupons, group departures, date-range exceptions (holiday closures, special prices) and add-on options; real-time airport board, prayer times and Qibla correction; on-demand translation, contribution badges and a recommendation engine (Final Score)
- Halal barcode scanner — on-device OCR (Vision / ML Kit) + a local HACCP mirror and a three-level verdict engine (a related verdict method is under patent application)
- 5 languages plus Arabic RTL, 293 hard-coded strings localized, 100 icon-only controls made accessible, SEO · GEO (JSON-LD · `llms.txt`)
- Analytics dashboard (8 calls → 1 aggregate endpoint, GA4 · Clarity compared side by side), PostHog · Clarity · GA4 payment-funnel tracking
- Travel quote builder (price snapshots · PDF · arrangement checks and deposit, interim and balance payment records), segmented push campaigns (900-second CLI dispatch), blog draft pipeline (only a human publishes)
- App stability (Korean IME duplicate-character bug → `reactive_forms` rewrite, Crashlytics non-fatal demotion, login tokens moved to device-only secure storage, a fatal crash from closing the PayPal sheet twice), Flutter 3.47 · Kotlin 2.3 · R8, deploy guards and multi-channel Slack alerts,\
  and **upload scripts** for TestFlight (App Store Connect API key) and Google Play (fastlane supply)
- Over-engineering cleanup (2026.10) — 56 confirmed items across app, console and web (13 copied confirm dialogs, 15 input decorations and 23 loading/error skeletons moved to shared helpers; unreachable files, unused dependencies and unreferenced assets deleted); on the server, 12 controllers with no routes removed, product-list N+1 fixed and the booking sweep moved to `chunkById`

---

## ICU Company website — marketing · lead-generation site

| Item | Details |
| --- | --- |
| Period | 2025.09 – present |
| Role | Sole frontend developer |
| Platform | Web · [Website](https://icucompany.com) |
| Main tech | React 19 · TypeScript · Vite · Firebase Hosting · Node.js 20 (Cloud Functions) · Vitest |

> Marketing / lead-generation website for ICU Company, an inbound travel agency specialized in halal travel — inquiry form, 4 SEO landing pages, multilingual hreflang

- **Problem** — Collect **inquiries (leads)** for a halal inbound travel agency and show up in **search and AI answers**
- **Engineering Challenge** — A React SPA **looks empty to crawlers** that don't run JavaScript (GPTBot, PerplexityBot and others),\
  and several KoreHalal sites in the same account made **deploying to the wrong one** a real risk
- **Design Decision** — Runtime (react-helmet-async) + **build-time prerendering** generate per-route HTML, meta, JSON-LD and sitemap.\
  Inquiry form → Firestore → Cloud Function → **real-time Slack alert**;\
  a **predeploy hook** checks the target project against a whitelist
- **Evidence** — **Lighthouse SEO 100** and **CLS 0.001**, Vitest + GitHub Actions CI.\
  In 2026.10 the structured data became one `@graph` with Service/ContactPage per service, internal links became crawlable, and the site was repositioned as **a Korea-specialist travel agency and tour operator**;\
  inquiry forms now leave the inquiry in the **KoreHalal unified inbox** before handing off to email or WhatsApp

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

- **Problem** — The AI trademark search app existed **only on iOS** and had to **reach Android**
- **Engineering Challenge** — Moving an app built in Swift · SwiftUI to cross-platform **without losing its UI spec**,\
  and keeping **large image searches** and loading fast
- **Design Decision** — Led the **Flutter migration** with MVVM + Provider · go_router,\
  defining **design tokens and shared components first** so the Swift version's UI spec carried over unchanged
- **Evidence** — Image search **50% faster**; part of the product shown at **CES 2023**

---

## MarkTong — patent-attorney matching iOS app

| Item | Details |
| --- | --- |
| Period | 2022.11 – 2023.03 |
| Role | Lead iOS developer |
| Platform | iOS (Swift · UIKit, released on the App Store as v2.0.1) |
| Main tech | Swift · UIKit · Firebase (Auth · Realtime Database · Storage · FCM · Analytics · Dynamic Links) · Alamofire · MessageKit · Iamport · Kakao Local API · MapKit |

> A matching platform connecting patent, trademark and design applicants with patent attorneys — designed and maintained a UIKit codebase of 211 Swift files and **about 27k lines** on my own

- **Problem** — An **iOS app** for a platform matching patent, trademark and design applicants with **patent attorneys**
- **Engineering Challenge** — **Two roles**, applicant and attorney, with different sign-up, profiles and screens;\
  **real-time 1:1 chat** with per-room unread badges
- **Design Decision** — Sign-up flows and my-pages **split by role**;\
  MessageKit chat UI synced through **Firebase RTDB**, with per-room unread counts computed by comparing `last_read_index` to drive FCM badges.\
  Iamport identity verification, nearby-attorney search with Kakao Local + MapKit, and **AI attorney recommendations** from an in-house server
- **Evidence** — **211 Swift files (about 27k lines)** designed and maintained alone, released on the App Store as v2.0.1,\
  sign-up → interest → consultation **funnel tracked** with Firebase Analytics

---

# 🤝 Team / side projects

> I kept a team together with people I met on a side project (Housetainer · Interstyle, 2024.01 – 2024.05): we built **Travel Buddy** at a hackathon and are now building **moit**. Because we keep working with the same people, we skip re-negotiating roles and go straight to building. My company work is a one-person frontend and my personal projects are solo, so **moit is the only project where I share a codebase with another frontend developer**.

---

## Travel Buddy — hackathon AI travel-companion · itinerary app

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

## moit — neighborhood class · meetup community app

| Item | Details |
| --- | --- |
| Period | 2024.10 – present (beta in continued development after a 3-month MVP) |
| Role | App co-developed by two · web solo |
| Platform | iOS · Android · Web (Next.js · Flutter Web) · [App Store](https://apps.apple.com/app/id6754381639) · [Google Play](https://play.google.com/store/apps/details?id=com.crackers.moit) |
| Main tech | Flutter 3.44 · Riverpod codegen · go_router · Freezed · Supabase · Flutter Web · Next.js 16 · React 19 |

> A community app for finding and joining local classes and small-group meetups — pivoted to a class / meetup marketplace in 2026.

- **Problem** — A marketplace for finding and joining **local classes and small groups**.\
  The app shares one codebase with another frontend developer, and **I build the web (Next.js) alone**
- **Engineering Challenge** — Keeping **web and app screens and behavior the same** while the app kept changing.\
  Even with matching design tokens, screen-level differences kept growing;\
  framing Flutter web inside the site isolated sessions through Safari's **cross-origin storage partitioning**, and OAuth doesn't work inside an iframe
- **Design Decision** — The **app is the design source of truth**: `sync-design` regenerates web CSS tokens from the Dart theme and icons and fails CI when they drift.\
  To avoid building every screen twice, the Flutter web build is framed inside Next.js pages but **served from the same origin**, with OAuth delegated to a popup on the parent page.\
  The switch is one environment variable (`NEXT_PUBLIC_APP_FRAME`), so **rolling back needs no code deploy**.\
  For two-person work, the in-feature `data / domain / presentation` structure is fixed in docs
- **Evidence** — Removing `dart:io` and unused fonts cut the web first load **from 28.9 MB to 15.7 MB** and the app **by 13 MB**;\
  an A/B bug that alternated variants for the same account was fixed with **fixed assignment**, stopping experiment-data pollution

---

# 🌟 Personal projects (solo)

> Planning, design, development and release all done alone. **7 apps are live on the App Store and Google Play** (Discard and Almost are out on iOS, with Android in review). I care less about the number of apps than about **keeping many apps maintainable by one person** — landing pages and terms are generated and deployed from the `joon-dev` monorepo, one tag push ships iOS and Android together, and store screenshots, App Store header images, Play graphics and preview videos are generated by script in four languages (ko · en · es · ja) from per-language demo data. The marketing automation that promotes the apps is listed separately at the end.

---

## Color of Days — a mood journal, one color a day

| Item | Details |
| --- | --- |
| Period | 2024.03 – present |
| Platform | iOS · Android (live) · [App Store](https://apps.apple.com/app/id6443436725) · [Google Play](https://play.google.com/store/apps/details?id=com.colorofdays.color_of_days) · [Website](https://apps.joon.is-a.dev/colorofdays/) |
| Main tech | Flutter · Riverpod · Freezed · Supabase (Edge Functions · pg_cron) · Firebase · Claude API · home_widget · fl_chart · local_auth · HealthKit · Health Connect · watchOS · Wear OS · App Intents |

> A mood diary that records each day as one of seven colors — yearly calendar, stats, recaps, home/lock-screen widgets, health data and watch logging; my longest-running personal app

- **Problem** — A mood record that **only takes picking a color**, even on days you don't feel like writing\
  — and the entries should come back as **a year of patterns**
- **Engineering Challenge** — Getting **meaningful insight** from entries that are just a color and a short note (when insights relied on tags, a user with 800 days of entries still saw "need more data");\
  a streak computed separately on client and server that could disagree;\
  an AI recap that **must not send anyone's diary text**;\
  and showing health data such as sleep, steps and heart rate next to the mood **without it ever leaving the device**
- **Design Decision** — Insights, weekly/monthly recaps and tag suggestions are **on-device pure functions** pinned by unit tests; insights read color, weekday and tags, so they work without tags.\
  One streak function is the single source, and the evening "your streak is about to break" push (Edge Function + pg_cron) is tested to follow the same rule.\
  The AI recap sends only color ranks (0–6) and built-in tag counts, **never diary text or custom tags**, falls back to static copy on failure, and sits behind a Remote Config kill switch.\
  Health data comes through my own MethodChannel from the HealthKit / Health Connect aggregate APIs as daily values only (the platform removes duplicates such as iPhone + Watch), and **raw values never go to the server**, analytics SDKs or logs;\
  a link to mood is shown as one line under "Patterns" only when a Spearman correlation clears the bar (14+ paired days, |ρ| ≥ max(0.3, 2/√n)) — the user always picks the color (no automatic judgment, no medical wording). Watches can't share the Supabase session, so they call the record RPC directly with a device token issued by the phone (only its hash is stored), and entries save even when the phone app is closed
- **Evidence** — **59% of sign-ups** write entries (31 per writer on average, up to 855);\
  interactive home-screen and iOS lock-screen widgets let users pick a color without opening the app;\
  2.3.0 (October 2026) shipped **health data** (on Android, Health Connect access kept to steps and sleep) and Apple Watch / Galaxy Watch logging;\
  2.4.0 added recording straight from the widget or Siri without opening the app (reusing the watch's device-token RPC), a redesigned yearly layer view and a year-end "**Year in Color**" share card, and fixed a same-day concurrent-save race with an upsert.\
  A second Play rejection over health data was answered by dropping the Health Connect history permission to the minimum scope, and the AI recap moved from Gemini's free tier to the **Claude API** (October 2026).\
  2.4.1 suggests a daily reminder after the first entry and moved account deletion to an Edge Function that **revokes the Apple token and deletes photos and the account in one go**

---

## Time with Me — shared calendar · memory journal app

| Item | Details |
| --- | --- |
| Period | 2024.06 – present |
| Platform | iOS · Android (Flutter, live) · [App Store](https://apps.apple.com/app/id6705135769) · [Google Play](https://play.google.com/store/apps/details?id=com.joonhwan.timewithme.time_with_me) · [Website](https://apps.joon.is-a.dev/time-with-me/) |
| Main tech | Flutter · Riverpod · go_router · Supabase (Realtime · Edge Functions) · Gemini · Google Maps · home_widget · Firebase |

> A shared calendar where friends, families and couples record memories together

- **Problem** — People want **one shared calendar**, but copying booking details in **by hand is tedious**
- **Engineering Challenge** — Turning **free-form booking messages into reliable events**,\
  and anniversaries (yearly, multi-day, across New Year) that showed up on **different dates on different screens**
- **Design Decision** — The user shares the message to the app;\
  an Edge Function parses it with **Gemini structured output** and pre-fills only when the reservation flag, confidence ≥ 0.5 and the time parse all pass.\
  Background SMS detection was **ruled out** for platform policy and privacy.\
  Recurring events are **stored as one row** and computed at display time, with one `occursOn` function replacing four duplicated checks
- **Evidence** — Live on the App Store and Google Play; invite links sent before a domain migration **still open the app**.\
  Event search, a space-wide photo album, event photos, date polls and comment @mentions with push rolled out through **Remote Config**, and invite previews with an Android install-referrer handoff carry an invite across the install.\
  1.3.0 (October 2026) lets users link and unlink Google and Apple accounts on an existing account, revokes the Apple token on deletion (Edge Function),\
  and raised small text such as anniversary counters and tags to **4.5:1 contrast**

---

## Yeowun — location-based notes left at places

| Item | Details |
| --- | --- |
| Period | 2026.01 – present |
| Platform | iOS · Android (live) · [App Store](https://apps.apple.com/app/id6759911276) · [Google Play](https://play.google.com/store/apps/details?id=com.traceline.joon.trace_line) · [Website](https://apps.joon.is-a.dev/yeowun/) |
| Main tech | Flutter · Supabase · PostGIS · native_geofence · Google Gemini AI · Firebase · PostHog |

> A location-based journal: photos and notes left at a place open for other users when they get nearby

- **Problem** — Let travelers leave records at **real places** that **only people who come nearby can open**
- **Engineering Challenge** — iOS can monitor **only 20 regions** in the background, while **any number of notes** can be around the user
- **Design Decision** — Monitor the **18 nearest notes** plus one **3 km "re-centering" geofence**; leaving it refreshes the set.\
  Chosen over continuous background GPS, which drains battery and is hard to justify in review.\
  Journeys are rebuilt from **photo EXIF GPS** with proximity clustering and PostGIS instead of manual entry
- **Evidence** — Live on the App Store and Google Play; recap highlights are written by **Gemini**,\
  and city badge images fall back from Gemini image models to **FLUX.1** (with Cloudflare added as a provider), filling in badges that had no image.\
  Korean, English, Spanish and Japanese (pushes and AI highlights included), map list mode, place search and marker clustering, and **three recap share cards**.\
  1.0.8 (October 2026) fixed a race that undercounted cities when badges were earned at once, and country names landing as cities and creating country badges

---

## Gilmok — offline-first map app

| Item | Details |
| --- | --- |
| Period | 2026.03 – present |
| Platform | iOS · Android · Web (Flutter, live) · [App Store](https://apps.apple.com/app/id6761645899) · [Google Play](https://play.google.com/store/apps/details?id=com.wayArchive.joonhwan.way_archive) · [Web](https://apps.joon.is-a.dev/gilmok/) |
| Main tech | Flutter · Dart · Riverpod · go_router · Drift (SQLite) · Supabase · flutter_map · vector_map_tiles (OpenFreeMap) · Firebase |

> An offline-first map app that brings in places saved in Google My Maps or Naver Map and works without a network

- **Problem** — Places saved in My Maps are **useless abroad**, exactly where there's **no data connection**
- **Engineering Challenge** — Importing **whole maps from one URL** and re-syncing them,\
  and drawing **thousands of markers** smoothly on a phone over offline tiles
- **Design Decision** — **Drift (SQLite) is the source of truth** and Supabase only an optional sync layer,\
  so **every feature works without a network** (a cloud-first design would fail where it's needed most).\
  **Supercluster clustering** instead of drawing every marker, and flutter_map driven directly, without wrappers, to control tile caching
- **Evidence** — Live on the App Store and Google Play; users' maps hold up to **2,798 markers** on a single map (8,002 in total)\
  and render **without slowdown**.\
  Four languages, search across all maps, KML · GeoJSON · CSV export with backup and merge-restore, GPX · KML · KMZ import, marker photos, smart collections and trip mode, iOS and Android home widgets, and read-only map share links (**348 tests**).\
  1.0.7 and 1.0.8 (October 2026) fixed offline font-download and splash crashes, and a same-day hotfix for the Android start-up crash the AGP 9 move introduced (R8 strict mode × WorkManager)

---

## Pick and Go — random trip courses you can actually reach

| Item | Details |
| --- | --- |
| Period | 2026.06 – present |
| Platform | iOS · Android (Flutter, live) · [App Store](https://apps.apple.com/app/id6770894684) · [Google Play](https://play.google.com/store/apps/details?id=com.pickngo.joondev.pick_and_go) · [Website](https://apps.joon.is-a.dev/pick-and-go/) |
| Main tech | Flutter · Dart · Riverpod · go_router · Neon (Data API · RLS · Functions) · Firebase (Auth · Remote Config · Crashlytics) · AdMob |

> Draws random trip courses you can actually reach, given your location, transport and time — like a game

- **Problem** — Random trip ideas are fun until they land somewhere **you can't reach** with the time and transport you have
- **Engineering Challenge** — The same transfer station is **named differently on different subway lines**,\
  which breaks direct and one-transfer **route finding**
- **Design Decision** — **Filter first, then draw**: candidates are limited to per-transport distance ranges before the random pick,\
  so **every result is reachable** (drawing first and re-rolling wastes draws and can loop).\
  Station names are **normalized** before routes are computed
- **Evidence** — Live on the App Store and Google Play, with roulette / ladder / card-draw UI and a couple mode for taking turns.\
  1.1.0 (October 2026) added return-trip, closing-time and last-train guards, and replaced the app's direct DB connection with **Firebase anonymous tokens + Neon Data API** and RLS;\
  then a timetable-aware constraint engine for courses (a top 3 with trade-offs, live · timetable · estimated labels) and course progress as an Android notification and an iOS Live Activity (**309 tests**).\
  Last trains go through a Neon Function transit relay (Firebase token check, caching, retries, quota protection) so public API keys never ship in the app,\
  and are shown only when the ride home is verified by chaining two stations' timetables — **never marked safe when unverified** (Daegu first, rolled out via Remote Config).\
  1.2.1 (October 2026) snapshots the course timetable at check-in and searches undecided stops in a map app;\
  coordinates, search terms and raw responses were removed from logs, and account deletion revokes the Apple token

---

## Discard — a museum of the things I let go

| Item | Details |
| --- | --- |
| Period | 2026.10 – present |
| Platform | iOS (live) · Android (in review) · Flutter · [App Store](https://apps.apple.com/app/id6819698341) · [Website](https://apps.joon.is-a.dev/discard/) |
| Main tech | Flutter · Riverpod · go_router · Drift (SQLite) · Neon (Data API · Storage · Functions) · Firebase (Auth · App Check · Analytics · Crashlytics · Remote Config) · Apple Vision / ML Kit · home_widget |

> Records what you throw away like numbered museum exhibits and shows your buying and owning patterns

- **Problem** — What you **throw away** says as much about your habits as what you buy, but there's **no way to see that pattern**
- **Engineering Challenge** — **Local-first sync across devices**: device clocks only store seconds and can't order edits within the same second,\
  two devices can create the **same exhibit number**,\
  and a sync's own writes could **trigger the next sync forever**
- **Design Decision** — Drift is the source of truth; Neon Data API (Firebase JWT + RLS) syncs incrementally on a **server-clock cursor** instead of device time,\
  and duplicate numbers are resolved by **a rule every device computes identically**.\
  Photos never get direct storage access — a Neon Function issues **signed URLs** after size/count limits and App Check.\
  Subject cutouts run on-device (Vision / ML Kit), so photos aren't sent anywhere to be processed
- **Evidence** — **132 unit and migration tests** covering sync, domain rules and schema upgrades.\
  1.1.0 added a "storage room" for things you still own, usage logging, **cost per day** and rebuy detection, gift and repair events, and four languages with currency from the device region.\
  1.1.1 asks once more the next day if the 30-day reflection reminder was missed

---

## Almost — a graveyard for things you almost did

| Item | Details |
| --- | --- |
| Period | 2026.10 – present |
| Platform | iOS (live) · Android (in review) · Flutter · [App Store](https://apps.apple.com/app/id6820918569) · [Website](https://apps.joon.is-a.dev/almost/) |
| Main tech | Flutter · Riverpod · go_router · CustomPainter · Neon (Postgres · Data API) · Firebase (Auth · Analytics · Crashlytics · Remote Config) · flutter_local_notifications |

> Write down what you want to do and it checks in when it's time; finished goals become flowers in a garden, abandoned ones a gravestone in a cemetery

- **Problem** — Things you meant to do **fade away quietly**.\
  Check in when it's time, and keep finished goals as **flowers** and abandoned ones as **gravestones** to look back on
- **Engineering Challenge** — There is **no app server**: the client talks to Postgres through Neon Data API,\
  so the **database must enforce** ownership, limits and paid items.\
  On a cold-started database a freshly issued token could leave the user id empty, and **RLS silently returned no rows**
- **Design Decision** — **Rules live in Postgres** (RLS, triggers, CHECK constraints, SECURITY DEFINER RPCs for public cemeteries) instead of a backend I'd have to run.\
  RLS **raises an error instead of returning nothing**, and the client retries.\
  Check-in reminders are rescheduled to the **nearest 50** to stay under iOS's 64 pending-notification limit
- **Evidence** — A **16-step server E2E script** exercises RLS, triggers and RPCs with several anonymous users;\
  **111 Flutter tests**, including one that checks the in-app catalog against the server seed.\
  Goal event history and a "patterns of giving up" screen, motive × outcome analysis, median time-to-start (**Kaplan–Meier**), and a shareable year-recap card.\
  1.0.2 added example chips for writing a first goal right away and a reminder that asks again the next day when a check-in is missed

---

## Nureongso — elected officials' pledges and public record

| Item | Details |
| --- | --- |
| Period | 2026.09 – present |
| Platform | Web (live) · [Website](https://nureongso.joon.is-a.dev) · [GitHub](https://github.com/teiresias22/nureongso) |
| Main tech | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (PostgreSQL) · Python (httpx · psycopg · pdfplumber) · Gemini · Claude · Codex · GitHub Actions · Vercel |

> Shows, side by side and from public records, what elected officials promised, how much they kept, and what they did in office — it carries only records published by official agencies, never opinions

- **Problem** — Campaign booklets alone don't tell voters **what an incumbent did last term**,\
  and pledges and records are **scattered across six agencies** as APIs, spreadsheets and PDFs
- **Engineering Challenge** — Getting **complete, correct data**: an API that, called without a key, ignores paging and keeps returning **the same 5 rows** with a normal total count;\
  attendance and side-job data that **identify members only by name**, mixed with hanja, spacing and bracket variants
- **Design Decision** — The **LLM only judges** "is this record the same thing as this pledge?";\
  whether a pledge is fulfilled is decided by a **published SQL rule table**\
  — reruns give the same answer and anyone can audit it.\
  Pledges with nothing measurable are left as **"cannot judge"** instead of being forced into a verdict (only about 10% of lawmakers' pledges are legislative)
- **Evidence** — **21,336 pledges** extracted from 1,683 election bulletins;\
  records for **3,239 lawmakers** and 259 governors, mayors and superintendents refreshed by scheduled GitHub Actions;\
  **source code and judging rules are public**.\
  Also a co-sponsorship network graph; attendance, assets, outside jobs, overseas trips and research groups; and pledge comparison between candidates in the same district.\
  The October 2026 judging overhaul started with **the measuring tools** (R0 — zero verdict changes): a gold sample (v1) with fact labels for precision, and contract tests pinning the expected verdict for each branch,\
  then rule versions R1 and R2, each change published with its effective date — matching only current-term pledges, excluding withdrawn bills, counting a by-election term from its election day.\
  LLM review has Claude and Codex check independently and **applies only what they agree on**, sending disagreements to a human list; when Gemini's daily quota runs out, Claude carries on.\
  Human review marks are never overwritten by re-matching or re-parsing, and crawler prefetches that burned through function CPU were handled with CDN caching and blocking training crawlers

---

## joon-dev web — personal project hub

| Item | Details |
| --- | --- |
| Period | 2026.07 – present |
| Platform | Web · [Website](https://apps.joon.is-a.dev/) |
| Main tech | pnpm monorepo · Vite + React · Next.js 16 · TypeScript · Firebase Hosting · GitHub Actions |

> A pnpm monorepo that merged every app's separate landing and terms sites into one Firebase Hosting site — 9 apps and 1 external project, Korean and English pages, and a showreel video per app

- **Problem** — Each app had its own hosting site, landing page and terms,\
  and adding an app meant **editing several config files by hand**
- **Engineering Challenge** — Serving Vite and Next.js apps **under subpaths of one Firebase Hosting site**\
  — rewrites, cache headers, and a **blank page** when an app was opened without a trailing slash
- **Design Decision** — One `apps.config.json` generates the sitemap, Remote Config and Hosting rewrites/headers/redirects, so **none of them are edited by hand**.\
  Trailing-slash redirects **use regex** because Hosting's glob matching ignores the slash and would loop
- **Evidence** — Every push to master builds, deploys and runs a **smoke check** that requests every subpath for HTTP 200 and a page title;\
  every PR gets a **Firebase preview channel**.\
  App pages fill in store versions and release notes from the App Store lookup, and Gilmok's read-only map share viewer (/s/:token) is served here too.\
  October 2026 added an operator-only app metrics dashboard (`/admin/` — 7-day installs, uninstalls, ratings and new reviews, GA4 visits for the web service),\
  a `sync:release` script (pure functions + tests) that writes the latest store version and notes onto app pages, and fixes for SEO audit items from High to Low (static HTML for subpaths, soft 404s, hreflang, LCP)

---

## Pulse — rewinding what happened on Earth on a 3D globe

| Item | Details |
| --- | --- |
| Period | 2026.10 – present |
| Platform | Web (live) · [Website](https://teiresias22.github.io/pulse/) · [GitHub](https://github.com/teiresias22/pulse) |
| Main tech | React 19 · TypeScript · Vite · globe.gl (WebGL) · satellite.js · USGS earthquake feed · Launch Library 2 · GitHub Pages |

> A web page that rewinds the last seven days of earthquakes, rocket launches and the ISS orbit on a 3D globe with a time scrubber

- **Problem** — Earthquakes, launches and the ISS position each live in a separate source and **can't be seen on one timeline**
- **Engineering Challenge** — Folding three differently shaped sources into one event model,\
  and handling time state so scrubbing or changing speed during playback **doesn't snap back**
- **Design Decision** — One adapter per source converts to a shared `PulseEvent`, and the ISS orbit is **computed in the browser from TLEs** with no server.\
  "Which events are visible at time t" and the URL hash are **pure functions**, so a shared link opens the same scene
- **Evidence** — Time scrubber, playback, keyboard controls, layer toggles and detail cards, with overlapping launches merged;\
  a list of recent events when WebGL isn't available, source links limited to http(s), and a GitHub Pages deploy on every master push

---

## Multi-app marketing automation — separate system for promoting my own apps

| Item | Details |
| --- | --- |
| Period | 2026.04 – present (since automated publishing) |
| Platform | Threads · Instagram (eight of my projects — 7 apps and 1 web service — on one account) |
| Main tech | Claude Agent SDK · Supabase (pg_cron · pg_net) · Threads / Instagram Graph API · UTM redirector · GitHub Actions + ffmpeg (short videos · Reels) · Gemini (backup writer) |

> A multi-agent posting and tracking system for promoting apps I built alone, without a marketing team

- **Problem** — **Eight solo-built apps** and services need steady promotion,\
  and I need to know which posts **actually lead to installs**
- **Engineering Challenge** — **Attribution.** The post → click → install funnel looked healthy, but **most clicks were crawlers**;\
  user-agent rules broke whenever crawlers changed versions,\
  and widening them would drop real Android users on Chrome's **reduced user agent**
- **Design Decision** — Four agents (CMO · ContentWriter · PerformanceAnalyst · SocialMediaManager) split planning, writing and analysis,\
  and publishing runs server-side on **Supabase pg_cron + pg_net** instead of GitHub Actions (slots routed per app — four Threads posts a day plus regional Instagram cards, carousels and Reels; three Korea-only projects take turns in a Korean slot).\
  Bots are flagged by **timing and IP reputation** (arrival within 60 s of posting, the same user agent reappearing within 120 s, IPs already seen as bots),\
  counting switched from a blacklist to a **whitelist of real platforms** (crawlers keep changing user agents, so a blacklist always lags),\
  and past data was corrected
- **Evidence** — Publishing automatically since April 2026, extended to **eight projects** in October 2026,\
  with a **9:16 short video** rendered automatically for every app each day.\
  Self-clicks and test installs are classified separately (debug builds and bursts of 3+ installs within 30 minutes are flagged automatically), and weights inflated by bot clicks were corrected retroactively.\
  Bot counts are reported separately rather than hidden — if they drop to zero, the **tracking itself has stopped**.\
  October 2026 added an app metrics collector (`app_metrics_daily` — GA4, PostHog, app databases, App Store and Google Play)\
  so the weekly Slack digest carries each app's 7-day average DAU, WAU, installs, sign-ups and key actions against last week, plus **collection-failure warnings**
