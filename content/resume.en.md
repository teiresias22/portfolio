---
title: Joonhwan Jeon — Resume
description: Cross-platform developer working across mobile, web and backend — Flutter, Swift, React and Laravel.
---

> 💡 **Flutter · Swift · React · Laravel** — a cross-platform developer working across mobile, web and backend. I take products from planning to release on my own, with the user experience at the center.

---

## 🌱 How I became a developer

> From travel to code — always finding the next road

- Started my career in **purchasing at PECO** and left in 2015 for a **working holiday in Canada**. Traveling before and after it, I spent **31 months across 36 countries (2015–2017)**, and 40+ countries counting later trips.
- Back in Korea I worked in the **travel industry**, until **COVID-19** brought travel to a halt and I looked for a new path.
- I committed to **software development**, which I had long been interested in, completed the **SeSAC iOS developer program**, and started my career as a developer.
- The multicultural sense I gained backpacking through 40+ countries goes straight into building multilingual, global products.

---

## 🏢 Experience

### ICU Company

**Flutter · React · Laravel · AWS · Firebase** | 2024.08 – present

> Sole developer of the app, partner/admin console, user web and backend for **KoreHalal**, a travel service for Muslim travelers (the team went from frontend 1 · backend 1 · designer 1 to developer 1 · designer 1, and I took over the backend) — **about 3,500 active installs** (peak about 8,000 on Google Play), mainly in Singapore, Malaysia, Indonesia and Korea

- **Problem** — When the team shrank to one developer and one designer, I took over the app, partner/admin console, user web and backend alone — the inherited app was a flat, template-based structure and the backend had accumulated authorization, payment and concurrency defects
- **Engineering Challenge** — Keeping four surfaces (app, console, web, server) behaving the same while fixing defects in production — cross-account reads (IDOR in 6 routes), zero-amount payments, double submits — across 5 languages plus Arabic RTL
- **Design Decision** — Rebuilt the app into a 13-domain layered architecture (Riverpod · Freezed) in 2025.01. Prices and order gates are decided by the server through quote APIs, and payments by the server verifying the PayPal transaction itself; added scope-based ownership guards, idempotency middleware and refresh-token rotation with reuse detection; photos go straight to S3 via presigned URLs. Admin permissions were rebuilt as a department → ability table plus team membership, enforced by the server on every route group. Also built internal sales and operations tools (overseas travel-agency discovery, quote builder, cost sheets tied to rate tables with price propagation, a unified inquiry inbox that pulls in email and WhatsApp, staff DMs and per-event operations rooms, 2026.08 – present) and the ICU Company website ([website](https://icucompany.com))
- **Evidence** — About 3,500 active installs (peak about 8,000); the legacy upload route was removed only after CloudWatch showed zero traffic; PHPUnit (681 files) restored as a parallel pre-push gate; 293 hard-coded strings localized and 100 icon-only controls given accessible names; the ICU website scores Lighthouse SEO 100; **two patent applications** filed on halal verdicts and culture-aware search (co-inventor, 2026.10)

---

### MarkCloud

**Swift · Flutter · Firebase** | 2022.11 – 2024.01

> An AI-for-intellectual-property startup — built the mobile apps for AI trademark search (MarkView) and the patent-attorney matching platform (MarkTong)

- **Problem** — MarkView, an AI trademark search app, existed only on iOS and had to reach Android; MarkTong, an attorney-matching app, had to ship on iOS
- **Engineering Challenge** — Moving a Swift app to Flutter without losing its UI spec while keeping large image searches fast; MarkTong's two user roles (applicant / attorney) plus real-time chat with unread badges
- **Design Decision** — Led the Flutter migration with MVVM + Provider · go_router, defining design tokens and shared components first; MarkTong split sign-up and profiles by role and computed badges by comparing `last_read_index` in Firebase RTDB
- **Evidence** — Image search 50% faster and shown at CES 2023; MarkTong (about 27k lines of Swift) released on the App Store (v2.0.1)

---

### PECO

**Purchasing · production management** | 2015 – 2019

- Production management and overseas shipment management

---

## 📜 Patent applications

| Title | Application no. | Filed | Notes |
| --- | --- | --- | --- |
| Method for determining the halal status of a product based on the user's halal tolerance | KR 10-2026-0193309 | 2026.10.08 | Applicant ICU Company · co-inventor · examination requested |
| Method for personalized natural-language search using a cultural-zone filter | KR 10-2026-0193310 | 2026.10.08 | Applicant ICU Company · co-inventor · examination requested |

---

## 🚀 Projects

### Company projects

| Project | Period | Main tech |
| --- | --- | --- |
| KoreHalal App — app for Muslim travelers | 2024.08 – (rebuilt 2025.01) | Flutter · PayPal · PostHog |
| ICU Company website — marketing · lead-generation site | 2025.09 – | React 19 · Vite · Firebase Hosting |
| KoreHalal partner/admin console — web console for operators and partner businesses | 2025.11 – | Flutter Web · GoRouter |
| KoreHalal user web — the web counterpart of the app | 2026.02 – | React 19 · Zustand · PayPal SDK |
| KoreHalal backend — serverless API server | 2026.05 – | Laravel 10 · AWS Lambda · Vapor · MySQL |
| MarkView — AI image & text trademark search | 2023.03 – 2024.01 | Swift → Flutter · Provider · Firebase |
| MarkTong — patent-attorney matching iOS app | 2022.11 – 2023.03 | Swift · UIKit · Firebase · MessageKit · Iamport |

### Team / side projects

| Project | Period | Main tech |
| --- | --- | --- |
| moit — neighborhood class · meetup community app | 2024.10 – | Flutter · Riverpod · go_router · Supabase · Flutter Web · Next.js 16 (app co-developed by two · web solo) |
| Travel Buddy — hackathon AI travel-companion · itinerary app | 2024.08 | Flutter · Riverpod · Supabase Edge Functions · vector embeddings |

### Personal projects (solo)

| Project | Period | Status | Main tech |
| --- | --- | --- | --- |
| [Color of Days](https://apps.joon.is-a.dev/colorofdays/) — a mood journal, one color a day | 2024.03 – | Live | Flutter · Riverpod · Supabase (Edge Functions · pg_cron) · home_widget · on-device insights · HealthKit/Health Connect · watch |
| [Time with Me](https://apps.joon.is-a.dev/time-with-me/) — shared calendar · memory journal app | 2024.06 – | Live | Flutter · Supabase · Google Maps · home_widget |
| [Yeowun](https://apps.joon.is-a.dev/yeowun/) — location-based notes left at places | 2026.01 – | Live | Flutter · Gemini AI · PostGIS · background geofencing |
| [Gilmok](https://apps.joon.is-a.dev/gilmok/) — offline-first map app | 2026.03 – | Live | Flutter · Drift · Supabase · flutter_map · offline-first |
| [Pick and Go](https://apps.joon.is-a.dev/pick-and-go/) — random trip courses you can actually reach | 2026.06 – | Live | Flutter · Riverpod · Neon · gamification |
| [Discard](https://apps.joon.is-a.dev/discard/) — a museum of the things I let go | 2026.10 – | iOS live · Android in review | Flutter · Drift · Neon (Data API · Storage · Functions) · Firebase Auth/App Check · Vision/ML Kit cutouts · home_widget |
| [Almost](https://apps.joon.is-a.dev/almost/) — a graveyard for things you almost did | 2026.10 – | iOS live · Android in review | Flutter · CustomPainter scenes · Neon (Postgres RLS · triggers · RPC) · Firebase Auth · 4 languages |
| [Nureongso](https://nureongso.joon.is-a.dev) — elected officials' pledges and public record ([GitHub](https://github.com/teiresias22/nureongso)) | 2026.09 – | Live (web) | Next.js 16 · Supabase · Python public-data pipeline · LLM pledge judging · Vercel |
| [joon-dev web](https://apps.joon.is-a.dev/) — personal project hub | 2026.07 – | Live | pnpm monorepo · Vite/Next.js · Firebase Hosting · GitHub Actions |
| [Pulse](https://pulse.joon.is-a.dev) — rewind earthquakes, weather hazards, rocket launches and satellite orbits on a 3D globe ([GitHub](https://github.com/teiresias22/pulse)) | 2026.10 – | Live (web) | React 19 · TypeScript · globe.gl (WebGL) · satellite.js (TLE orbits) · USGS · NASA EONET · NOAA · CelesTrak · iNaturalist · GitHub Pages |
| Multi-app marketing automation — separate system for promoting my own apps | 2026.04 – | Running | Claude Agent SDK · Supabase pg_cron · Threads/Instagram Graph API · attribution tracking · app metrics collection |

---

## 🛠 Tech stack

### Core

- **Flutter / Dart** — 7 apps live, shipping to iOS, Android and Web (home_widget · WidgetKit home/lock-screen widgets, local_auth biometrics, app_links deep links, screen-reader accessibility with Tooltip · Semantics)
- **Riverpod · Freezed** (hooks_riverpod · riverpod_generator) — state management and immutable-model code generation
- **React 19 · TypeScript** — MVVM-layered SPAs (Zustand · Tailwind CSS 4 · Zod · Next.js 16), **Flutter Web** admin platform — ARIA accessibility, Arabic RTL, **Jest · Vitest** unit tests
- **Supabase** — PostgreSQL · Auth · RLS · Storage · Edge Functions · PostGIS
- **Firebase** — FCM · Analytics · Crashlytics · Remote Config · Hosting · Cloud Functions · Realtime Database

### Architecture

- Clean Architecture · feature-based · MVVM + Repository pattern · 13-domain layered separation

### Backend · infrastructure

- **Laravel 10 · PHP 8.3** — serverless API on AWS Lambda (Laravel Vapor)
- **AWS** — Lambda · API Gateway · Aurora/RDS (MySQL) · DynamoDB · SQS · S3 · CloudFront
- **Node.js 20/22** — Firebase Cloud Functions (PayPal order creation and capture, KML and image proxies, Firestore triggers → Slack alerts)
- **Neon** · **Drift (SQLite)** — serverless PostgreSQL and offline-first local DB (Gilmok · Discard)
- **Python** — public API and PDF collection pipelines (httpx · psycopg · pdfplumber) on scheduled GitHub Actions (Nureongso)

### DevOps / CI·CD

- **GitHub Actions + Fastlane** (Match · App Store Connect API) — one tag push ships to **TestFlight and the Play Store together**; store screenshots, graphics and preview videos generated by script in four languages
- **Firebase Hosting** · **Laravel Vapor** — web and serverless deploy pipelines (concurrency guards)
- **Tests and quality gates** — backend PHPUnit **681 files in parallel + pre-push gate**; clients pinned by Flutter widget/unit tests and Jest · Vitest
- **Release hardening** — caught the Android start-up crash that R8 strict mode causes with WorkManager after the AGP 9 · Gradle 9 move and shipped the same hotfix across several apps; native debug symbols included in release AABs

### Native iOS

- **Swift / UIKit · SwiftUI** — MarkTong production app (about 27k lines of Swift), Alamofire · MessageKit · Kingfisher

### AI · analytics

- **LLM judging routines** — a prefilter that only sends the model questions worth asking, plus **server-side re-verification of the model's evidence** (checking that quotes actually appear in the collected text — hallucination detection); on-demand Google Cloud Translation
- **LLM cross-checking** — two models (Claude · Codex) review the same verdict independently and **only agreements are applied**; a person checks only the disagreements, with precision measured against a gold sample (Nureongso)
- **Claude API · Google Gemini AI** (badges · recaps, with model fallback when a quota runs out) · **PostHog · GA4 · Microsoft Clarity**

### Marketing automation (separate system for promoting my own apps)

- **Claude Code Agent SDK** — marketing automation for eight of my projects (7 apps, 1 web service): multi-agent orchestration + a Supabase pg_cron publishing pipeline, **Threads · Instagram Graph API**
- **Attribution tracking** — built a UTM-redirector post → click → install funnel, then redesigned bot detection from user-agent strings to **timing and IP reputation**, **disproving my own metrics** where crawlers had passed as real clicks and **correcting historical data** (counting switched from a blacklist to a whitelist)

### Maps · auth · payments

- **Google Maps · flutter_map · Leaflet · PostGIS** — map rendering, offline tile caching, spatial queries (supercluster marker clustering)
- Google · Kakao · Apple sign-in · **PayPal SDK** · JWT + HttpOnly cookie dual authentication
- **GoRouter** (Flutter) · **react-router-dom v7** (React)

---

## 🎓 Education

| School | Program | Status |
| --- | --- | --- |
| SeSAC (Seoul youth software academy) | iOS developer program | Completed |

---

## 🌍 Other

- Backpacked through 40+ countries — an understanding of users from many cultures
- Built multilingual apps in **8 languages** — KoreHalal (Korean · English · Arabic · Malay · Indonesian, **including Arabic RTL layout**) and personal apps (Spanish · Japanese · Chinese)
- Many App Store and Play Store releases
