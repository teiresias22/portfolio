---
title: 전준환 | 이력서
notion: 363a3015-22b8-8145-9b66-c083ecf7b661
---

> 💡 **Flutter · Swift · React · Laravel** — 모바일 · 웹 · 백엔드를 넘나드는 크로스플랫폼 개발자. 혼자서 기획부터 배포까지, 사용자 경험을 중심에 두고 제품을 만듭니다.

---

<!-- notion-only -->
## 👤 인적사항

| 항목 | 내용 |
| --- | --- |
| 이름 | 전준환 |
| 생년월일 | {{BIRTHDATE}} |
| 이메일 | [teiresias1987@gmail.com](mailto:teiresias1987@gmail.com) |
| 연락처 | {{PHONE}} |
| GitHub | [github.com/teiresias22](https://github.com/teiresias22) |

<!-- /notion-only -->
---

## 🌱 개발자가 되기까지

> 여행에서 시작해 개발로 — 멈추지 않고 새로운 길을 찾아온 여정

- **PECO 구매부**로 사회생활을 시작, **캐나다 워킹홀리데이**를 계기로 퇴사했습니다. 워홀 전후로 각 1년씩, 총 **2년간 세계여행**(40여 개국)을 경험했습니다.
- 귀국 후 **여행업**에 종사했으나, **코로나19**로 여행업계가 멈추면서 새로운 진로를 모색하게 되었습니다.
- 평소 관심을 두던 **개발**에 본격적으로 입문하기로 결심, **청년취업사관학교(SeSAC) iOS 개발자 과정**을 이수하고 개발자 커리어를 시작했습니다.
- 40여 개국 배낭여행에서 쌓은 다문화 감각을 다국어 · 글로벌 서비스 개발에 그대로 녹여내고 있습니다.

---

## 🏢 경력 사항

### 아이씨유컴퍼니 (ICU Company)

**Flutter · React · Laravel · AWS · Firebase** | 2024.08 ~ 재직 중

> 무슬림 여행자를 위한 **KoreHalal** 서비스의 앱 · 관리자/파트너 콘솔 · 사용자 웹 · 백엔드를 단독 담당(프론트 1 · 백엔드 1 · 디자이너 1 → 개발자 1 · 디자이너 1로 재편되며 백엔드까지 인수) — 싱가포르 · 말레이시아 · 인도네시아 · 한국 중심으로 **약 3,500명 설치 유지**(누적 최대 약 8,000명, Google Play 기준)

- **Problem** — 개발팀이 개발자 1 · 디자이너 1로 줄면서 앱 · 관리자/파트너 콘솔 · 사용자 웹 · 백엔드를 혼자 맡게 됨 — 인수한 앱은 템플릿 기반 평면 구조, 백엔드에는 권한 · 결제 · 동시성 결함이 쌓여 있었음
- **Engineering Challenge** — 네 표면(앱 · 콘솔 · 웹 · 서버)을 같은 동작으로 유지하면서 남의 데이터 조회(IDOR 6곳) · 0원 결제 · 중복 결제 요청 같은 결함을 운영 중에 고치기, 5개 언어 + 아랍어 RTL 대응
- **Design Decision** — 앱을 13개 도메인 레이어드 아키텍처(Riverpod · Freezed)로 전면 재구축(2025.01). 금액 · 주문 판정은 견적 API로 서버가 결정하고, 데이터 주인 확인을 소속 범위 기준으로 바꾸고 중복 요청 방지 장치 · 로그인 토큰 교체(도난 감지)를 도입, 사진은 일회용 업로드 주소로 S3에 직접 올림. 사내 영업 도구(해외 여행사 발굴 · 견적 빌더 · 푸시 캠페인, 2026.08 ~ 09)와 ICU Company 웹사이트([icucompany.com](https://icucompany.com))도 구축
- **Evidence** — 약 3,500명 설치 유지(누적 최대 약 8,000명), 레거시 업로드 경로는 CloudWatch 트래픽 0 확인 후 제거, 푸시 전 자동 테스트(PHPUnit 659개 파일) 복구, 하드코딩 문구 293곳 다국어화 · 아이콘 컨트롤 100곳 접근성 보강, ICU 웹사이트 Lighthouse SEO 100점

---

### 마크클라우드 (MarkCloud)

**Swift · Flutter · Firebase** | 2022.11 ~ 2024.01

> 상표 · 특허 등 지식재산(IP)에 AI를 접목하는 스타트업 — AI 상표 검색(MarkView)과 변리사 매칭 플랫폼(MarkTong)의 모바일 앱을 담당

- **Problem** — iOS에만 있던 AI 상표 검색 앱(MarkView)을 Android로 넓히고, 변리사 매칭 앱(MarkTong)을 iOS로 출시해야 함
- **Engineering Challenge** — Swift 앱의 UI 규격을 유지한 채 Flutter로 옮기면서 대용량 이미지 검색 성능 확보, MarkTong의 의뢰인/변리사 이중 역할과 실시간 채팅 · 안 읽음 뱃지
- **Design Decision** — MVVM + Provider · go_router로 Flutter 전환을 주도(디자인 토큰 · 공통 컴포넌트를 먼저 정의), MarkTong은 역할별 가입 · 프로필 분리와 방마다 마지막 읽은 위치와 비교해 안 읽은 수를 뱃지로 표시
- **Evidence** — 이미지 검색 성능 50% 개선 · CES 2023 전시, MarkTong(Swift 약 2.7만 LOC) App Store v2.0.1 배포

---

### PECO

**구매 · 생산관리** | 2015 ~ 2019

- 제품 생산 관리 및 해외 제품 출하 관리

---

## 🚀 주요 프로젝트

### 회사 프로젝트

| 프로젝트 | 기간 | 주요 기술 |
| --- | --- | --- |
| KoreHalal App | 2024.08 ~ (2025.01 재구축) | Flutter · PayPal · PostHog |
| ICU Company 웹사이트 | 2025.09 ~ | React 19 · Vite · Firebase Hosting |
| KoreHalal 관리자/파트너 콘솔 | 2025.11 ~ | Flutter Web · GoRouter |
| KoreHalal 사용자 웹 | 2026.02 ~ | React 19 · Zustand · PayPal SDK |
| KoreHalal 백엔드 | 2026.05 ~ | Laravel 10 · AWS Lambda · Vapor · MySQL |
| MarkView | 2023.03 ~ 2024.01 | Swift → Flutter · Provider · Firebase |
| MarkTong (마크통) | 2022.11 ~ 2023.03 | Swift · UIKit · Firebase · MessageKit · 아임포트 |

### 팀 / 사이드 프로젝트

| 프로젝트 | 기간 | 주요 기술 |
| --- | --- | --- |
| 모잇 (moit) | 2024.10 ~ | Flutter · Riverpod · go_router · Supabase · Flutter Web · Next.js 16 (앱 2인 공동 · 웹 단독) |
| Travel Buddy (해커톤) | 2024.08 | Flutter · Riverpod · Supabase Edge Functions · 벡터 임베딩 |

### 개인 프로젝트 (1인 개발)

| 프로젝트 | 기간 | 상태 | 주요 기술 |
| --- | --- | --- | --- |
| [Color of Days](https://apps.joon.is-a.dev/colorofdays/) | 2024.03 ~ | 실서비스 | Flutter · Riverpod · Supabase (Edge Functions · pg_cron) · home_widget · 온디바이스 인사이트 |
| [Time with Me](https://apps.joon.is-a.dev/time-with-me/) | 2024.06 ~ | 실서비스 | Flutter · Supabase · Google Maps · home_widget |
| [여운 (Yeowun)](https://apps.joon.is-a.dev/yeowun/) | 2026.01 ~ | 실서비스 | Flutter · Gemini AI · PostGIS · 백그라운드 지오펜싱 |
| [길목 (Gilmok)](https://apps.joon.is-a.dev/gilmok/) | 2026.03 ~ | 실서비스 | Flutter · Drift · Supabase · flutter_map · 오프라인 우선 |
| [Pick and Go](https://apps.joon.is-a.dev/pick-and-go/) | 2026.06 ~ | 실서비스 | Flutter · Riverpod · Neon · Gamification |
| [Discard](https://apps.joon.is-a.dev/discard/) | 2026.10 ~ | 스토어 출시 예정 | Flutter · Drift · Neon (Data API · Storage · Functions) · Firebase Auth/App Check · Vision/ML Kit 누끼 · home_widget |
| [Almost](https://apps.joon.is-a.dev/almost/) | 2026.10 ~ | 스토어 출시 예정 | Flutter · CustomPainter 장면 렌더링 · Neon (Postgres RLS · 트리거 · RPC) · Firebase Auth · 4개 언어 |
| [누렁소검은소](https://nureongso.joon.is-a.dev) | 2026.09 ~ | 운영 중 (웹) | Next.js 16 · Supabase · Python 공공데이터 수집 파이프라인 · LLM 공약 판정 · Vercel |
| [joon-dev 웹](https://apps.joon.is-a.dev/) | 2026.07 ~ | 운영 중 | pnpm 모노레포 · Vite/Next.js · Firebase Hosting · GitHub Actions |
| 멀티앱 마케팅 자동화 (별도 시스템) | 2026.04 ~ | 운영 중 | Claude Agent SDK · Supabase pg_cron · Threads/Instagram Graph API · 어트리뷰션 계측 |

---

## 🛠 기술 스택

### 주력

- **Flutter / Dart** — 5개 앱 실서비스 운영, iOS · Android · Web 동시 대응 (home_widget · WidgetKit 홈/잠금화면 위젯, local_auth 생체인증, app_links 딥링크, Tooltip · Semantics 기반 스크린리더 접근성)
- **Riverpod · Freezed** (hooks_riverpod · riverpod_generator) — 상태관리 · 불변 모델 코드 제너레이션
- **React 19 · TypeScript** — MVVM 레이어링 SPA (Zustand · Tailwind CSS 4 · Zod · Next.js 16), **Flutter Web** 관리자 플랫폼 — ARIA 기반 접근성 · 아랍어 RTL · **Jest · Vitest** 유닛 테스트 포함
- **Supabase** — PostgreSQL · Auth · RLS · Storage · Edge Functions · PostGIS
- **Firebase** — FCM · Analytics · Crashlytics · Remote Config · Hosting · Cloud Functions · Realtime Database

### 아키텍처

- Clean Architecture · Feature-based · MVVM + Repository Pattern · 레이어드 13개 도메인 분리

### 백엔드 · 인프라

- **Laravel 10 · PHP 8.3** — AWS Lambda 서버리스 API (Laravel Vapor)
- **AWS** — Lambda · API Gateway · Aurora/RDS(MySQL) · DynamoDB · SQS · S3 · CloudFront
- **Node.js 20/22** — Firebase Cloud Functions 서버 코드 (PayPal 주문 생성 · 결제 승인, KML · 이미지 프록시, Firestore 트리거 → Slack 알림)
- **Neon** · **Drift(SQLite)** — 서버리스 PostgreSQL · 오프라인 우선 로컬 DB (길목 · Discard)
- **Python** — 공공 API · PDF 수집 파이프라인(httpx · psycopg · pdfplumber)과 GitHub Actions 정기 수집 (누렁소검은소)

### DevOps / CI·CD

- **GitHub Actions + Fastlane** (Match · App Store Connect API) — 태그 푸시 시 **TestFlight · Play Store 동시 자동 배포**
- **Firebase Hosting** · **Laravel Vapor** — 웹 · 서버리스 배포 파이프라인 (concurrency 중복 방지)
- **테스트 · 품질 게이트** — 백엔드 PHPUnit **659개 파일 병렬 실행 + pre-push 게이트**, 클라이언트는 Flutter 위젯 · 단위 테스트와 Jest · Vitest로 회귀 고정

### iOS 네이티브

- **Swift / UIKit · SwiftUI** — MarkTong 상용 앱(Swift 약 2.7만 LOC), Alamofire · MessageKit · Kingfisher

### AI · 분석

- **LLM 판정 루틴 설계** — 모델에게 물을 것만 골라 넘기는 프리필터 + **모델이 낸 근거를 서버가 재검증**하는 구조(인용문이 실제 수집 본문에 있는지 대조 — 환각 검출), Google Cloud Translation 온디맨드 번역
- **Google Gemini AI**(배지 · 회고 생성) · **PostHog · GA4 · Microsoft Clarity**

### 마케팅 자동화 (자체 앱 홍보용 별도 시스템)

- **Claude Code Agent SDK** — 자체 앱 4개 마케팅 자동화, 멀티에이전트 오케스트레이션 + Supabase pg_cron 게시 파이프라인, **Threads · Instagram Graph API**
- **어트리뷰션 계측 설계** — UTM 리다이렉터 기반 게시 → 클릭 → 설치 퍼널을 구축한 뒤, 봇 판정을 UA 문자열에서 **타이밍 · IP 평판 기반으로 재설계**해, 크롤러가 진성 클릭으로 새던 **자사 지표를 직접 부정하고 과거 데이터까지 소급 정정**(집계도 블랙리스트 → 화이트리스트로 전환)

### 지도 · 인증 · 결제

- **Google Maps · flutter_map · Leaflet · PostGIS** — 지도 렌더링 · 오프라인 타일 캐싱 · 공간 쿼리 (supercluster 마커 군집화)
- Google · Kakao · Apple 소셜 로그인 · **PayPal SDK** · JWT + HttpOnly Cookie 이중 인증
- **GoRouter**(Flutter) · **react-router-dom v7**(React)

---

## 🎓 학력

| 학교 | 전공 | 졸업 |
| --- | --- | --- |
| 청년취업사관학교 (SeSAC) | iOS 개발자 과정 | 수료 |

---

## 🌍 기타

- 40여 개국 배낭여행 경험 — 다양한 문화권 사용자에 대한 이해 보유
- **8개 언어** 다국어 앱 개발 경험 — KoreHalal(한국어 · 영어 · 아랍어 · 말레이어 · 인도네시아어, **아랍어 RTL 레이아웃 포함**) · 개인 앱(스페인어 · 일본어 · 중국어)
- App Store · Play Store 실서비스 배포 경험 다수
