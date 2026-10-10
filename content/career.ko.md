---
title: 전준환 | 경력기술서
notion: 363a3015-22b8-81df-acde-dadc28a0814d
---

> 📌 실무 경험을 프로젝트 단위로 기술합니다. 회사 경력 → 팀/사이드 프로젝트 → 개인 프로젝트 순으로 구성됩니다.

---

# 🏢 아이씨유컴퍼니 (ICU Company)

**Flutter · React · Laravel · AWS · Firebase** | 2024.08 ~ 현재 (재직 중)

> 무슬림 여행자 서비스 **KoreHalal**의 **앱 · 관리자/파트너 콘솔 · 사용자 웹 · 백엔드 API를 한 사람이 담당**합니다. 개발팀은 프론트엔드 1 · 백엔드 1 · 디자이너 1로 시작해 **개발자 1 · 디자이너 1** 체제로 재편됐고, 이때 백엔드까지 인수해 **제품 전 스택을 단독으로** 맡고 있습니다. 기능 하나를 넣을 때 서버 스키마 · API부터 세 클라이언트 UI까지 한 주기에 맞추며, 한쪽에만 반영돼 기기마다 동작이 갈리는 사고를 겪은 뒤 **「클라이언트 동등성」을 리포 컨벤션으로 명문화**했습니다. 2026년 하반기부터는 해외 여행사 발굴 · 여행 견적 같은 **사내 영업 · 운영 도구**까지 맡고 있습니다.

---

## KoreHalal Trip — 앱 · 관리자/파트너 콘솔 · 사용자 웹 · 백엔드

| 표면 | 기간 | 역할 | 주요 기술 |
| --- | --- | --- | --- |
| 앱 (iOS · Android) · [App Store](https://apps.apple.com/app/id6736513932) · [Google Play](https://play.google.com/store/apps/details?id=com.korehalal.app) | 2024.08 ~ 현재 | 프론트 단독 (2025.01 재구축) | Flutter · Dart · Riverpod · Freezed · Firebase · PayPal · PostHog · Microsoft Clarity |
| 관리자/파트너 콘솔 (Flutter Web) | 2025.11 ~ 현재 | 프론트 단독 | Flutter Web · Dart · GoRouter · Table Calendar · fl_chart |
| 사용자 웹 (React) | 2026.02 ~ 현재 | 프론트 단독 | React 19 · TypeScript · Zustand · PayPal SDK · i18next · Tailwind CSS 4 · Node.js 22 (Cloud Functions) |
| 백엔드 (AWS 서버리스) | 2026.05 ~ 현재 | 인수 후 단독 운영 | PHP 8.3 · Laravel 10 · Laravel Vapor · AWS Lambda · API Gateway · Aurora/RDS (MySQL) · DynamoDB · SQS · S3 · CloudFront · Firebase RTDB · FCM |

> **싱가포르 · 말레이시아 · 인도네시아 · 한국** 중심으로 앱 **약 3,500명 설치 유지**(누적 최대 약 8,000명, Google Play 기준) — 아랍어 RTL · 5개 언어 대응은 이 시장 분포에서 나온 요구사항입니다.

> 여러 표면에 걸친 작업은 **기능 단위로 한 번만** 적었습니다. 제목 옆 표시가 그 기능이 걸친 표면입니다 — `앱` Flutter(iOS · Android) · `콘솔` 관리자/파트너 웹(Flutter Web) · `웹` 사용자 웹(React) · `서버` Laravel 백엔드

### 레거시 앱 인수 → 전면 재구축 `앱`

- **Problem** — 인수한 앱이 상용 템플릿 · MobX · 평면 구조라 기능을 더할수록 상태관리가 뒤섞임
- **Engineering Challenge** — 구조를 바꾸기 전에 PayPal 결제 오류 · 소셜 로그인 심사 요건 같은 운영 이슈부터 처리해야 했음(인수 구조로 v1.0.0 ~ v1.0.6 배포)
- **Design Decision** — 폴더 정리로는 한계를 못 넘는다고 보고 2025.01 전면 재구축을 주도 — 13개 도메인 레이어드 아키텍처(Data Source → Repository → UseCase → ViewModel → View) + Riverpod · Freezed
- **Evidence** — 재구축한 구조 위에 배달 · 1:1 채팅 · 바코드 스캐너 · 공항 보드 등 새 도메인을 같은 방식으로 추가, 5개 언어 + 아랍어 RTL로 약 3,500명 설치 유지

### 백엔드 인수 · 보안 결함 개선 `서버`

- **Problem** — 메인 API 서버(Laravel Vapor · AWS Lambda)를 인수해 혼자 운영하게 됐는데, 권한 · 결제 · 동시성 결함이 쌓여 있었음
- **Engineering Challenge** — 교차계정 예약 조회(IDOR 6곳), 프로필 수정을 통한 자가 권한상승, 실제 PayPal 청구액 미저장 · 0원 결제 생성, 더블 서브밋, 남의 댓글을 작성자까지 바꿔 덮어쓸 수 있던 커뮤니티 API
- **Design Decision** — 소유권 가드를 역할이 아닌 스코프 기준으로 교체하고 「대상은 경로가 정한다」로 고정, 더블 서브밋은 재사용 가능한 idempotency 미들웨어로. refresh 토큰은 회전 + 재사용 감지(60초 유예 안은 같은 응답, 밖은 탈취로 보고 전부 폐기), 비밀번호는 argon2id로 전환하되 레거시 bcrypt는 검증 후 승격
- **Evidence** — 커뮤니티 보안 감사 9건 · IDOR 6곳 수정, PHPUnit 659개 파일 병렬 실행 + pre-push 게이트 복구, 아무것도 검증하지 않던 단언 14곳을 고치자 가려져 있던 실제 결함이 드러남

### 목록 응답의 실시간 연산 제거 `서버`

- **Problem** — 대시보드 · 검색 목록이 응답마다 상품별 금액 · 쿠폰 적용 여부를 PHP에서 다시 계산
- **Engineering Challenge** — 비용이 상품 수 × 쿠폰 수 × 적용대상 수로 불어나 쿠폰이 늘수록 목록이 무거워지고, Lambda 실행시간이 곧 과금
- **Design Decision** — 할인 기간 · 요일 판정을 SQL 조건으로 내리고, 쿠폰은 단일 인덱스 SQL로 「사용 가능한 상품 UUID 집합」을 한 번에 구해 O(1) 조회. 좋아요 · 댓글 · 리뷰 통계는 야간 배치 + 이벤트 동기화로 비정규화
- **Evidence** — 응답마다 돌던 `withCount` 집계를 다른 호출부까지 제거, 연산량 감소가 곧 Lambda 비용 절감

### 이미지 업로드 — S3 직접 업로드 전환 `서버` `앱` `콘솔` `웹`

- **Problem** — 사진이 프록시 이미지 서버를 통과하는 멀티파트 방식이라 고화질 · 다중 업로드가 자주 실패
- **Engineering Challenge** — ALB 10MB 페이로드 상한, 앱 · 콘솔 · 웹 3개 클라이언트가 모두 옛 경로를 사용
- **Design Decision** — 서버는 Presigned PUT URL만 발급하고 바이트는 클라이언트에서 S3로 직행(상한 자체가 사라짐), temp(24시간) → 영구 저장소는 S3 서버사이드 이동
- **Evidence** — 3개 클라이언트 전환 후 CloudWatch에서 레거시 라우트 트래픽 0을 확인하고 제거

### 금액 · 주문 판정의 서버 권위화 (배달 · 예약) `서버` `앱` `웹`

- **Problem** — 수수료는 품목 단위, 통화 환산은 표시 단위로 반올림돼 클라이언트가 규칙을 흉내 내면 최소주문 · 무료배달 경계에서 「화면은 주문 가능 · 실제로는 거부」가 됨
- **Engineering Challenge** — 앱 · 웹 두 클라이언트, 표시는 사용자 통화 · 결제는 USD, 입력 중 순서가 뒤바뀌어 도착하는 견적 응답
- **Design Decision** — 결제 전 견적 API(`POST /delivery/quote`)가 금액과 게이트 판정을 모두 반환하고 클라이언트는 그리기만. 좌표는 선택으로 둬 주소 입력 전에도 금액을 보여주고, 늦게 도착한 옛 견적이 새 금액을 덮지 않는 순서 가드. 배달에 먼저 적용한 뒤 예약으로 확장
- **Evidence** — 가격 구간 경계의 통화 반올림 오차 · 할인 배지 통화 혼재 · 화면 내 통화 전환 시 금액 불일치를 정리하고 예약 · 배달이 같은 구조를 사용

### 고객↔업체 1:1 채팅 `서버` `앱` `콘솔` `웹`

- **Problem** — 예약 · 주문 고객과 업체가 앱 · 웹 · 파트너 콘솔 어디서든 대화해야 함
- **Engineering Challenge** — 실시간성과 도착 보장을 동시에, 건마다 방이 갈라지지 않게, 새 인증 인프라 없이 Firebase 보안 규칙 적용
- **Design Decision** — 대화 키 = (고객, 업체) 쌍, 예약 · 주문은 허용 근거로만 사용. 진실원장은 MySQL, Firebase RTDB는 서버만 쓰는 실시간 사본(미러 실패가 전송을 깨지 않게), 도착 보장은 증분 폴링(`after_id`)이 담당. Firebase 커스텀 토큰은 서버가 발급
- **Evidence** — 앱 · 콘솔 · 웹이 같은 규격으로 동작, presence · typing · 첨부 · 사람별 읽음 · 신고/차단 · 전송 실패 재전송까지 지원

### 할랄맵 · 장소 디렉토리 파이프라인 `서버` `웹` `앱` `콘솔`

- **Problem** — Google My Maps 임베드로 운영하던 할랄 장소 지도를 자체 데이터로 운영하고 신규 · 폐업을 자동 반영해야 함
- **Engineering Challenge** — Naver · Kakao · Google Place · TourAPI · LOCALDATA 등 여러 외부 소스의 매칭과 한도 — 외부 API 한도로 마지막 키워드 예외 하나에 모은 후보가 전부 사라지고, 상한 120이 자격 브랜드 178개 중 58개를 매번 같은 자리에서 버리던 문제
- **Design Decision** — KML 임포트 → Naver 매칭 → Kakao 자동 발굴(격주) → Google · TourAPI 보강 → LOCALDATA 폐업 감지(유예 → 비공개 → 재확인) 라이프사이클 설계. 실패는 키워드 단위로 격리하고 잘린 런은 Slack에 「중단됨」으로 표기 — 「다 훑었다」로 읽히는 게 상한보다 위험하기 때문
- **Evidence** — 앱 · 웹 지도를 자체 Place DB 공개 API로 대체(KML 폴백), 지점 상세 «근처 상품» 클릭으로 지도 → 예약 전환을 계측

### 위치정보법 제16조 대응 `서버` `콘솔`

- **Problem** — 개인위치정보 취급대장 · 관리자 접근기록을 법정 기간(6개월) 이상 보존해야 함
- **Engineering Challenge** — 좌표를 받는 경로 4곳의 early-return 갈래에서 기록이 빠지기 쉽고, 기록이 실수로 짧게 지워져서도 안 됨
- **Design Decision** — append-only로 설계해 수정 · 삭제 경로와 자동 파기 잡을 두지 않음. 기록은 라우트 미들웨어에 두어 좌표가 실제로 있을 때만 남기고, 식별정보는 회원 uuid · 비회원 IP+UA 해시만 저장
- **Evidence** — 심사 증빙용 조회 커맨드(`evidence:password-hashing`)와 콘솔 위치정보 접근기록 조회 화면 제공

### 해외 여행사 발굴 파이프라인 (2026.09) `서버` `콘솔`

- **Problem** — KoreHalal 상품을 팔 해외 여행사를 찾는 B2B 영업을 수작업 없이 돌리기
- **Engineering Challenge** — 20개국 22개 소스의 제각각인 형식, 사이트마다 「한국 상품을 파는가」 판정, 프로덕션 Lambda 제약(SQS 가시성 타임아웃 · 월 예산)
- **Design Decision** — 공식 명단이 있는 나라는 등록부 · 협회 · 박람회 명단을 출처별로 읽어 오고, 없는 나라는 검색과 Google Places로 찾음(웹페이지 긁어 오기는 약관 위반 · 서버 IP 차단 위험 때문에 배제). AI는 의견만 내고 최종 판정은 규칙이 함 — 답이 뻔한 곳은 규칙으로 먼저 걸러 AI 호출을 줄이고, AI가 댄 근거 문장이 실제 사이트 본문에 없으면 지어낸 것으로 보고 판정을 낮춤. 서버 시간 제한 안에서 돌도록 작업을 45초씩 잘라 스스로 이어 가게 하고, 업체 번호로 나눠 여러 줄을 동시에 처리
- **Evidence** — 프로덕션 적재 병목(로컬 대비 1/10)을 청크 조회로 해소하고 테스트로 고정, 대기 2,740건 중 72%가 모델에 물을 필요 없는 페이지임을 찾아 프리필터 한 곳으로 통합, 수집 → 판정 → 연락처 → 접촉 칸반까지 프로덕션 운영 중

### 그 밖의 작업

- `콘솔` Provider · Place Provider · Admin 3-Role 권한 구조(`roles[]` 집합 판정), `웹` MVVM 단방향 레이어링(pages → viewmodels → repositories → api → stores)
- 쿠폰 · 그룹 출발 예약 · 기간 예외(연휴 마감 · 특별가) · 선택 옵션, 공항 실시간 보드 · 기도시간 · Qibla 보정, 온디맨드 번역 · 기여 뱃지 · 추천 엔진(Final Score)
- 할랄 바코드 스캐너 — 온디바이스 OCR(Vision / ML Kit) + HACCP 로컬 미러 · 3단계 판정 엔진
- 5개 언어 + 아랍어 RTL, 하드코딩 문구 293곳 다국어화, 아이콘 전용 컨트롤 100곳 접근성 보강, SEO · GEO(JSON-LD · `llms.txt`)
- 분석 대시보드(8개 호출 → 1개 집계 엔드포인트, GA4 · Clarity 외부 지표 대조), PostHog · Clarity · GA4 결제 퍼널 계측
- 여행 견적 빌더(단가 스냅샷 · PDF), 세그먼트 푸시 캠페인(900초 CLI 발송), 블로그 초안 파이프라인(발행은 사람만)
- 앱 안정성(한글 IME 중복 버그 → `reactive_forms` 교체, Crashlytics 비치명적 강등), Flutter 3.47 · Kotlin 2.3 · R8, 배포 가드 · Slack 다채널 알림

---

## ICU Company 웹사이트 (마케팅/리드젠)

| 항목 | 내용 |
| --- | --- |
| 기간 | 2025.09 ~ 현재 |
| 역할 | 프론트 단독 개발자 |
| 플랫폼 | Web · [웹사이트](https://icucompany.com) |
| 주요 기술 | React 19 · TypeScript · Vite · Firebase Hosting · Node.js 20 (Cloud Functions) · Vitest |

> 할랄 특화 인바운드 여행사(ICU Company)의 마케팅/리드젠 웹사이트 — 문의 폼, SEO 랜딩 4종, 다국어 hreflang 대응

- **Problem** — 할랄 특화 인바운드 여행사의 문의(리드)를 받고, 검색 · AI 답변에 노출돼야 함
- **Engineering Challenge** — React SPA는 JS를 실행하지 않는 크롤러(GPTBot · PerplexityBot 등)에게 빈 페이지로 보이고, 같은 계정에 KoreHalal 사이트가 여럿이라 오배포 위험이 있음
- **Design Decision** — 런타임(react-helmet-async) + 빌드타임 프리렌더링 이중 레이어로 라우트별 HTML · 메타 · JSON-LD · sitemap을 생성. 문의 폼 → Firestore → Cloud Function → Slack 실시간 알림, predeploy 훅으로 배포 대상 프로젝트를 화이트리스트 검증
- **Evidence** — Lighthouse SEO 100점 · CLS 0.001, Vitest + GitHub Actions CI

---

# 🏢 마크클라우드 (MarkCloud)

**Swift · Flutter · Firebase** | 2022.11 ~ 2024.01

> 상표 · 특허 등 지식재산(IP)에 AI를 접목하는 스타트업 — **AI 상표 검색(MarkView)**과 **변리사 매칭 플랫폼(MarkTong)**의 모바일 앱을 담당했고, MarkView는 **Flutter 전환까지 주도**했습니다.

---

## MarkView — AI 기반 이미지 & 텍스트 상표 검색

| 항목 | 내용 |
| --- | --- |
| 기간 | 2023.03 ~ 2024.01 |
| 역할 | 프론트 단독 개발자 |
| 플랫폼 | iOS → iOS + Android (Flutter 전환 후) |
| 주요 기술 | Swift · SwiftUI (1차) → Flutter · Dart · Provider · go_router (2차) · Firebase |

> AI 기반 이미지 · 텍스트 상표 검색 앱 — Swift로 시작해 Flutter 전환까지 주도

- **Problem** — iOS에만 있던 AI 상표 검색 앱을 Android까지 넓혀야 함
- **Engineering Challenge** — Swift · SwiftUI로 만든 앱의 UI 규격을 유지한 채 크로스플랫폼으로 옮기기, 대용량 이미지 검색 · 로딩 성능
- **Design Decision** — Flutter 전환을 주도해 MVVM + Provider · go_router로 재설계, 디자인 토큰 · 공통 컴포넌트를 먼저 정의해 Swift 버전 UI 규격을 그대로 이관
- **Evidence** — 이미지 검색 성능 50% 개선, CES 2023 전시 제품에 포함

---

## MarkTong (마크통) — 변리사 매칭 플랫폼 iOS 앱

| 항목 | 내용 |
| --- | --- |
| 기간 | 2022.11 ~ 2023.03 |
| 역할 | iOS 메인 개발자 |
| 플랫폼 | iOS (Swift · UIKit, App Store v2.0.1 배포) |
| 주요 기술 | Swift · UIKit · Firebase(Auth · Realtime Database · Storage · FCM · Analytics · Dynamic Links) · Alamofire · MessageKit · 아임포트(Iamport) · Kakao Local API · MapKit |

> 특허 · 상표 · 디자인 출원 의뢰인과 변리사를 연결하는 매칭 플랫폼 — Swift 파일 211개 · **약 2.7만 LOC** UIKit 코드베이스를 단독으로 설계 · 유지보수

- **Problem** — 특허 · 상표 · 디자인 출원 의뢰인과 변리사를 연결하는 매칭 플랫폼 iOS 앱
- **Engineering Challenge** — 의뢰인 / 변리사 이중 역할(가입 · 프로필 · 화면이 다름), 실시간 1:1 채팅과 방별 안 읽음 뱃지
- **Design Decision** — 역할별 가입 플로우 · 마이페이지 분리, MessageKit 채팅 UI + Firebase RTDB 동기화, `last_read_index` 비교로 방별 안 읽음 수를 집계해 FCM 뱃지 산출. 아임포트 본인인증, Kakao Local + MapKit 주변 변리사 탐색, 추천 서버 연동 AI 변리사 추천
- **Evidence** — Swift 파일 211개 · 약 2.7만 LOC를 단독 설계 · 유지보수, App Store v2.0.1 배포, Firebase Analytics로 가입 → 관심등록 → 상담개시 퍼널 계측

---

# 🤝 팀 / 사이드 프로젝트

> 〈하우스테이너(인터스타일) · 2024.01 ~ 2024.05〉 사이드 프로젝트에서 만난 멤버들과 팀을 유지해 **Travel Buddy**(해커톤)를 만들고 이어서 **모잇**을 개발하고 있습니다. 같은 사람들과 이어가는 팀이라 역할 분담을 매번 새로 세우지 않고 바로 개발에 들어갑니다. 회사는 프론트엔드 1인 체제, 개인 프로젝트는 1인 개발이라 **모잇은 다른 프론트엔드 개발자와 한 코드베이스를 함께 쓴 유일한 프로젝트**입니다.

---

## Travel Buddy (해커톤)

| 항목 | 내용 |
| --- | --- |
| 기간 | 2024.08 (약 10일) |
| 역할 | 프론트 단독 개발자 |
| 플랫폼 | iOS · Android (Flutter) |
| 주요 기술 | Flutter · Riverpod codegen · Freezed · Supabase(Edge Functions · 벡터 임베딩) · Google Maps |

> 여행 동행을 구하고 AI가 일정을 함께 짜주는 앱 — 해커톤 기간 **10일 안에** 소셜 로그인부터 AI 플래너 · 지도 루트까지 구현

### 주요 구현

- Supabase **Edge Function**(`get-embedding` · `summarize`)으로 일정을 요약해 **벡터 임베딩**으로 저장 — 사용자 · 모집글 양쪽 임베딩으로 취향 매칭 기반을 만들고 대화형 AI 플래너(Buddie) 구현
- 동행 모집 · 프로필, Google · Apple 로그인, **Google Maps** 루트 저장/불러오기
- 단기 프로젝트에도 **Riverpod codegen + Freezed** 구조를 적용해 화면 · 모델 추가 속도 확보

---

## 모잇 (moit)

| 항목 | 내용 |
| --- | --- |
| 기간 | 2024.10 ~ 현재 (초기 3개월 MVP 이후 베타로 지속 개발 중) |
| 역할 | 앱 2인 공동 개발 · 웹 단독 개발 |
| 플랫폼 | iOS · Android · Web (Next.js · Flutter Web) |
| 주요 기술 | Flutter 3.44 · Riverpod codegen · go_router · Freezed · Supabase · Flutter Web · Next.js 16 · React 19 |

> 동네 클래스와 반모임을 찾고 참여하는 커뮤니티 앱 — 2026년 클래스/반모임 마켓플레이스로 피봇했습니다.

- **Problem** — 동네 클래스 · 소모임을 찾고 참여하는 마켓플레이스. 앱은 다른 프론트엔드 개발자와 한 코드베이스를 함께 쓰고, 웹(Next.js)은 혼자 만듦
- **Engineering Challenge** — 앱이 계속 바뀌는 동안 웹과 앱의 화면 · 동작을 같게 유지하기. 디자인 토큰을 맞춰도 화면 단위 차이는 계속 벌어졌고, Flutter 웹을 프레임에 올리면 Safari의 교차 오리진 스토리지 분리로 세션이 고립되고 iframe 안에서는 OAuth가 성립하지 않음
- **Design Decision** — 앱을 디자인의 기준으로 두고 `sync-design`이 Dart 테마 · 아이콘에서 웹 CSS 토큰을 재생성, 어긋나면 CI 실패. 같은 화면을 두 번 만들지 않도록 Flutter 웹 빌드를 Next.js 페이지 안 프레임에 올리되 동일 오리진으로 서빙하고 OAuth는 부모 페이지 팝업으로 위임. 전환은 환경변수 하나(`NEXT_PUBLIC_APP_FRAME`)로 해 되돌리기가 코드 배포 없이 끝나게 함. 2인 협업은 feature 내부 `data / domain / presentation` 구조를 문서로 고정
- **Evidence** — `dart:io` 제거 · 미사용 폰트 정리로 웹 첫 로딩 28.9MB → 15.7MB · 앱 용량 13MB 감소, 같은 계정에 A/B variant가 번갈아 노출되던 버그를 고정 배정으로 수정해 실험 데이터 오염 차단

---

# 🌟 개인 프로젝트 (1인 개발)

> 기획 · 설계 · 디자인 · 개발 · 배포를 1인으로 진행했습니다. 현재 **5개 앱이 App Store · Play Store에서 실서비스 중**이고 2개 앱이 출시 예정입니다. 앱 수보다 **여러 앱을 혼자서도 유지 가능한 상태로 묶는 것**에 무게를 둡니다 — 랜딩 · 약관은 `joon-dev` 모노레포에서 자동 생성 · 배포, 배포는 태그 푸시 한 번으로 iOS · Android 동시 출시. 앱 홍보용 마케팅 자동화는 마지막 항목에 별도로 정리했습니다.

---

## Color of Days

| 항목 | 내용 |
| --- | --- |
| 기간 | 2024.03 ~ 현재 |
| 플랫폼 | iOS · Android (실서비스 중) · [App Store](https://apps.apple.com/app/id6443436725) · [Google Play](https://play.google.com/store/apps/details?id=com.colorofdays.color_of_days) · [소개 페이지](https://apps.joon.is-a.dev/colorofdays/) |
| 주요 기술 | Flutter · Riverpod · Freezed · Supabase (Edge Functions · pg_cron) · Firebase · home_widget · fl_chart · local_auth |

> 하루의 기분을 7가지 색 중 하나로 남기는 감정 기록 앱 — 연간 달력 · 통계 · 회고 · 홈/잠금화면 위젯, 가장 오래 운영한 개인 앱

- **Problem** — 글 쓰기 부담스러운 날에도 색 하나만 고르면 남는 감정 기록 — 쌓인 기록은 1년치 흐름과 패턴으로 돌아와야 함
- **Engineering Challenge** — 색 하나와 짧은 코멘트뿐인 기록에서 의미 있는 인사이트 만들기(태그에만 기대던 시절엔 800일 기록에도 「기록이 더 필요」만 떴음), 클라이언트 · 서버 두 곳에서 따로 계산돼 어긋나던 연속 기록(스트릭), 일기 원문을 지키면서 넣는 AI 회고
- **Design Decision** — 인사이트 · 주간/월간 회고 · 태그 추천을 온디바이스 순수 함수로 분리해 단위 테스트로 고정, 색 · 요일 · 태그에서 관찰 문장을 뽑아 태그 없이도 동작. 스트릭 기준은 함수 하나로 통일하고, 끊길 스트릭을 저녁에 알리는 서버 알림(Edge Function + pg_cron)도 같은 규칙임을 테스트로 보장. AI 회고는 색 순서 · 태그 빈도만 보내고 일기 원문은 보내지 않으며, 실패하면 정적 문구로 대체 · Remote Config 킬스위치
- **Evidence** — 가입자의 59%가 실제 기록 작성(작성자 1인당 평균 31건, 최다 855건), 앱을 열지 않고도 색을 고를 수 있는 인터랙티브 홈 위젯 · iOS 잠금화면 위젯

---

## Time with Me

| 항목 | 내용 |
| --- | --- |
| 기간 | 2024.06 ~ 현재 |
| 플랫폼 | iOS · Android (Flutter, 실서비스 중) · [App Store](https://apps.apple.com/app/id6705135769) · [Google Play](https://play.google.com/store/apps/details?id=com.joonhwan.timewithme.time_with_me) · [소개 페이지](https://apps.joon.is-a.dev/time-with-me/) |
| 주요 기술 | Flutter · Supabase · Google Maps · home_widget · Firebase |

> 친구 · 가족 · 커플이 캘린더 하나를 공유하며 추억을 기록하는 앱

- **Problem** — 함께 쓰는 캘린더가 필요하지만, 예약 내용을 손으로 옮겨 적는 게 번거로움
- **Engineering Challenge** — 형식 없는 예약 문자를 믿을 만한 일정으로 바꾸기, 그리고 반복 · 다중일 · 연말연시에 걸친 기념일이 화면마다 다른 날짜에 뜨던 문제
- **Design Decision** — 문자를 공유 시트로 넘기면 Edge Function이 Gemini 구조화 출력으로 파싱하고, 예약 여부 · 신뢰도 0.5 이상 · 시각 파싱이 모두 통과할 때만 프리필. 백그라운드 문자 감지는 플랫폼 정책 · 프라이버시 때문에 배제. 반복 일정은 한 행만 저장하고 표시 시점에 계산하며, 4곳에 중복된 판정을 `occursOn` 하나로 통합
- **Evidence** — App Store · Play Store 실서비스, 도메인 이전 전에 보낸 초대 링크도 계속 열림

---

## 여운 (Yeowun)

| 항목 | 내용 |
| --- | --- |
| 기간 | 2026.01 ~ 현재 |
| 플랫폼 | iOS · Android (실서비스 중) · [App Store](https://apps.apple.com/app/id6759911276) · [Google Play](https://play.google.com/store/apps/details?id=com.traceline.joon.trace_line) · [소개 페이지](https://apps.joon.is-a.dev/yeowun/) |
| 주요 기술 | Flutter · Supabase · PostGIS · Google Gemini AI · Firebase Hosting |

> 장소에 남긴 사진 · 글을 다른 사용자가 근처에 갔을 때 열어보는 위치 기반 기록 앱

- **Problem** — 여행지의 실제 장소에 기록을 남기고, 그 근처에 온 사람만 열어볼 수 있게 하기
- **Engineering Challenge** — iOS가 백그라운드에서 감시할 수 있는 영역은 20개가 한도인데, 주변 기록은 얼마든지 있을 수 있음
- **Design Decision** — 가장 가까운 18개 + 반경 3km 「재중심」 지오펜스 1개만 감시하고, 그 경계를 벗어나면 목록을 갱신. 배터리를 쓰고 심사에서 설명하기 어려운 상시 백그라운드 GPS 대신 선택. 여정은 수동 입력 대신 사진 EXIF 좌표 + 근접 군집화 · PostGIS로 복원
- **Evidence** — App Store · Play Store 실서비스, Gemini로 여행 배지 · 회고 생성

---

## 길목 (Gilmok)

| 항목 | 내용 |
| --- | --- |
| 기간 | 2026.03 ~ 현재 |
| 플랫폼 | iOS · Android · Web (Flutter, 실서비스 중) · [App Store](https://apps.apple.com/app/id6761645899) · [Google Play](https://play.google.com/store/apps/details?id=com.wayArchive.joonhwan.way_archive) · [웹](https://apps.joon.is-a.dev/gilmok/) |
| 주요 기술 | Flutter · Dart · Riverpod · Drift (SQLite) · Supabase · flutter_map · Firebase |

> Google My Maps에 모아둔 장소를 가져와 네트워크 없이 쓰는 오프라인 우선 지도 앱

- **Problem** — My Maps에 모아둔 장소가 정작 데이터가 안 터지는 해외에서 쓸모가 없음
- **Engineering Challenge** — URL 하나로 지도를 통째로 가져와 재동기화하고, 오프라인 타일 위에 수천 개 마커를 폰에서 끊김 없이 그리기
- **Design Decision** — Drift(SQLite)를 원본, Supabase는 선택적 동기화로 두어 네트워크 없이 모든 기능이 동작(클라우드 우선이면 가장 필요한 곳에서 실패). 마커를 전부 그리는 대신 supercluster 군집화, 타일 캐시를 제어하려고 flutter_map을 래퍼 없이 직접 사용
- **Evidence** — App Store · Play Store 실서비스, 사용자 지도 한 장에 최대 2,798개(누적 8,002개) 마커를 성능 저하 없이 렌더링

---

## Pick and Go

| 항목 | 내용 |
| --- | --- |
| 기간 | 2026.06 ~ 현재 |
| 플랫폼 | iOS · Android (Flutter, 실서비스 중) · [App Store](https://apps.apple.com/app/id6770894684) · [Google Play](https://play.google.com/store/apps/details?id=com.pickngo.joondev.pick_and_go) · [소개 페이지](https://apps.joon.is-a.dev/pick-and-go/) |
| 주요 기술 | Flutter · Dart · Riverpod · Freezed · go_router · Neon (Serverless PostgreSQL) · Firebase |

> 위치 · 이동수단 · 시간으로 실제 갈 수 있는 랜덤 여행 코스를 게임처럼 뽑아주는 앱

- **Problem** — 랜덤 여행 추천은 재밌지만, 가진 시간과 이동수단으로 못 가는 곳이 나오면 쓸모가 없음
- **Engineering Challenge** — 같은 환승역이 노선마다 다른 이름이라 지하철 직통 · 1회 환승 경로 계산이 깨짐
- **Design Decision** — 먼저 거르고 뽑기: 이동수단별 거리 범위로 후보를 제한한 뒤 추첨해 모든 결과가 도달 가능(뽑고 나서 다시 뽑는 방식은 추첨을 낭비하고 반복에 빠질 수 있음). 역 이름은 경로 계산 전에 정규화
- **Evidence** — App Store · Play Store 실서비스, 룰렛 · 사다리 · 카드 뽑기 UI와 번갈아 뽑는 커플 모드

---

## Discard — 내가 버린 것들의 박물관

| 항목 | 내용 |
| --- | --- |
| 기간 | 2026.10 ~ 현재 |
| 플랫폼 | iOS · Android (Flutter, 스토어 출시 예정) · [소개 페이지](https://apps.joon.is-a.dev/discard/) |
| 주요 기술 | Flutter · Riverpod · go_router · Drift (SQLite) · Neon (Data API · Storage · Functions) · Firebase (Auth · App Check · Analytics · Crashlytics) · Apple Vision / ML Kit · home_widget |

> 버린 물건을 번호 붙은 전시품처럼 기록해 나의 소비 · 소유 패턴을 보여주는 앱

- **Problem** — 무엇을 버리는지도 무엇을 사는지만큼 습관을 말해 주지만, 그 패턴을 볼 방법이 없음
- **Engineering Challenge** — 여러 기기 간 로컬 우선 동기화: 기기 시각은 초 단위라 같은 초의 수정을 못 가리고, 두 기기가 같은 전시 번호를 만들 수 있으며, 동기화가 쓴 내용이 다음 동기화를 부르는 무한 반복
- **Design Decision** — Drift를 원본으로 두고 Neon Data API(Firebase JWT + RLS)로 기기 시각이 아닌 서버 시계 커서 기준 증분 동기화, 겹친 번호는 모든 기기가 같은 답을 내는 규칙으로 재번호. 사진은 저장소에 직접 접근시키지 않고 Neon Function이 용량 · 개수 한도와 App Check를 거쳐 서명 URL 발급. 누끼는 기기 안에서(Vision / ML Kit) 처리해 사진을 외부로 보내지 않음
- **Evidence** — 동기화 · 도메인 규칙 · 스키마 업그레이드를 검증하는 단위 · 마이그레이션 테스트 42개

---

## Almost — 하려다 만 것들의 묘지

| 항목 | 내용 |
| --- | --- |
| 기간 | 2026.10 ~ 현재 |
| 플랫폼 | iOS · Android (Flutter, 스토어 출시 예정) · [소개 페이지](https://apps.joon.is-a.dev/almost/) |
| 주요 기술 | Flutter · Riverpod · go_router · CustomPainter · Neon (Postgres · Data API) · Firebase (Auth · Analytics · Crashlytics) · flutter_local_notifications |

> 하고 싶은 일을 적어 두면 때가 되어 물어보고, 해낸 일은 꽃밭에 · 그만둔 일은 묘지에 남기는 앱

- **Problem** — 하려던 일은 조용히 잊혀 감. 때가 되면 물어보고, 해낸 일은 꽃으로 · 그만둔 일은 묘비로 남겨 돌아보게 하기
- **Engineering Challenge** — 앱 서버가 없음: 클라이언트가 Neon Data API로 Postgres와 바로 통신하므로 소유권 · 한도 · 유료 아이템을 DB가 지켜야 함. 콜드 스타트 직후 갓 발급된 토큰에선 사용자 id가 비어 RLS가 조용히 빈 결과를 돌려줌
- **Design Decision** — 직접 운영해야 하는 백엔드 대신 규칙을 Postgres에 둠(RLS · 트리거 · CHECK, 공개 묘지는 SECURITY DEFINER RPC). RLS는 빈 결과 대신 오류를 내고 클라이언트가 재시도. 확인 알림은 iOS 대기 한도(64) 안에서 가까운 50개만 재예약
- **Evidence** — 익명 사용자 여럿으로 RLS · 트리거 · RPC를 검증하는 16단계 서버 E2E, 앱 카탈로그와 서버 시드를 대조하는 테스트를 포함한 Flutter 테스트 57개

---

## 누렁소검은소 — 선출직 공약 · 의정활동 공개 기록

| 항목 | 내용 |
| --- | --- |
| 기간 | 2026.09 ~ 현재 |
| 플랫폼 | Web (운영 중) · [웹사이트](https://nureongso.joon.is-a.dev) |
| 주요 기술 | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (PostgreSQL) · Python (httpx · psycopg · pdfplumber) · Gemini · GitHub Actions · Vercel |

> 선출직이 무슨 공약을 했고 얼마나 지켰는지, 임기 동안 무엇을 했는지 공개 기록으로 나란히 보여주는 서비스 — 기관이 공개한 기록만 옮기고 의견은 싣지 않습니다

- **Problem** — 선거 공보물만으로는 재선 의원이 지난 임기에 무엇을 했는지 알 수 없고, 공약 · 기록은 6개 기관의 API · 엑셀 · PDF에 흩어져 있음
- **Engineering Challenge** — 빠짐없고 정확한 데이터 확보. 인증키 없이 호출하면 페이지 인자를 무시하고 같은 5행을 총건수만 정상으로 돌려주는 API, 의원 코드 없이 이름(한자 · 띄어쓰기 · 괄호 표기 혼재)만 주는 출결 · 겸직 데이터
- **Design Decision** — LLM은 「이 공약과 이 기록이 같은 일인가」만 판단하고, 이행 여부는 공개된 SQL 규칙표가 결정 — 다시 돌려도 같은 답이 나오고 누구나 검증 가능. 측정할 근거가 없는 공약은 억지로 판정하지 않고 판단불가로 남김(국회의원 공약 중 입법형은 약 10%)
- **Evidence** — 선거공보 1,683건에서 공약 21,336건 추출, 국회의원 3,239명 · 단체장 · 교육감 259명 기록을 GitHub Actions로 정기 갱신, 소스와 판정 규칙 공개

---

## joon-dev 웹 (개인 프로젝트 허브)

| 항목 | 내용 |
| --- | --- |
| 기간 | 2026.07 ~ 현재 |
| 플랫폼 | Web · [웹사이트](https://apps.joon.is-a.dev/) |
| 주요 기술 | pnpm 모노레포 · Vite + React · Next.js 16 · TypeScript · Firebase Hosting · GitHub Actions |

> 앱마다 따로 있던 랜딩 · 약관 사이트를 Firebase Hosting 하나로 합친 pnpm 모노레포

- **Problem** — 앱마다 호스팅 사이트 · 랜딩 · 약관이 따로였고, 앱 하나를 추가하려면 설정 파일 여러 개를 손으로 고쳐야 했음
- **Engineering Challenge** — Vite · Next.js 앱을 한 Firebase Hosting 사이트의 서브패스로 서빙 — rewrites · 캐시 헤더, 끝 슬래시 없이 들어오면 빈 화면이 뜨는 문제
- **Design Decision** — `apps.config.json` 하나에서 sitemap · Remote Config · Hosting rewrites/headers/redirects를 생성해 손으로 고치는 파일을 없앰. 끝 슬래시 리다이렉트는 glob이 슬래시를 무시해 무한 리다이렉트가 되므로 regex 사용
- **Evidence** — master 푸시마다 빌드 · 배포 후 smoke-check가 모든 서브패스의 HTTP 200 + title을 확인

---

## 멀티앱 마케팅 자동화 (자체 앱 홍보용 별도 시스템)

| 항목 | 내용 |
| --- | --- |
| 기간 | 2026.04 ~ 현재 (자동 발행 기준) |
| 플랫폼 | Threads · Instagram (자체 앱 4개를 한 계정에서 운영) |
| 주요 기술 | Claude Agent SDK · Supabase (pg_cron · pg_net) · Threads / Instagram Graph API · UTM 리다이렉터 |

> 마케팅 인력 없이 혼자 만든 앱들을 알리기 위한 멀티에이전트 게시 · 계측 시스템

- **Problem** — 혼자 만든 앱 4개를 꾸준히 알려야 하고, 어떤 게시물이 실제 설치로 이어지는지 알아야 함
- **Engineering Challenge** — 어트리뷰션. 게시 → 클릭 → 설치 퍼널이 좋아 보였지만 클릭 대부분이 크롤러였고, UA 규칙은 크롤러가 버전을 바꿀 때마다 뚫렸으며 범위를 넓히면 축약 UA를 쓰는 실제 안드로이드 사용자가 빠짐
- **Design Decision** — CMO · ContentWriter · PerformanceAnalyst · SocialMediaManager 4개 에이전트가 기획 · 작성 · 분석을 나누고, 발행은 GitHub Actions 대신 Supabase pg_cron + pg_net으로 서버에서 처리(하루 5개 슬롯, 앱별 라우팅). 봇 판정은 타이밍 · IP 평판(게시 60초 내 도착 · 같은 UA 120초 내 재등장 · 이미 봇으로 찍힌 IP)으로 바꾸고, 집계는 블랙리스트 → 실제 플랫폼 화이트리스트로 전환(크롤러는 UA를 계속 바꾸므로 블랙리스트는 항상 뒤처짐), 과거 데이터는 소급 정정
- **Evidence** — 2026.04 이후 Threads · Instagram 625건 자동 발행. 봇 수치는 숨기지 않고 따로 표기해, 0이 되면 계측이 멈췄다는 신호로 사용
