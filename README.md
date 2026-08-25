# (sample) ExpertMatch — 전문가 상담·매칭 플랫폼 MVP

사용자가 자신의 고민에 맞는 전문가를 **탐색 → 비교 → 상세 확인 → 상담 예약 완료**까지
실제로 체험할 수 있는 반응형 웹앱 MVP입니다.

> 포트폴리오 / 정부지원사업 시연용 데모입니다. 실제 결제·상담·채팅은 진행되지 않습니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm run typecheck
npm run lint
```

Vercel에 그대로 배포할 수 있습니다 (환경변수 불필요).

## 기술 스택

| 항목 | 사용 |
| --- | --- |
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript (strict) |
| 스타일 | Tailwind CSS |
| 아이콘 | lucide-react |
| 폰트 | Pretendard (CDN) + 시스템 폰트 폴백 |
| 데이터 | Mock 데이터 + localStorage (Supabase 스키마는 `supabase/schema.sql`) |

애니메이션은 Tailwind keyframes만 사용하며 별도 애니메이션 라이브러리를 추가하지 않았습니다.

## 핵심 사용자 Journey

```
홈 → 검색/카테고리 → 전문가 목록 → 필터·정렬 → 비교(최대 3명)
   → 전문가 상세 → 상담 상품 → 상담 방식 → 날짜 → 시간 → 상담 내용
   → 예약 확인 → 예약 완료 → 마이페이지에서 예약 조회
```

전 과정이 실제로 동작합니다.

## 페이지

| 경로 | 설명 |
| --- | --- |
| `/` | 홈 — Hero 검색, 인기 분야, 추천 전문가, 이용방법, 후기, CTA |
| `/experts` | 전문가 검색 — 데스크톱 좌측 필터 사이드바 / 모바일 필터 바텀시트, 정렬 |
| `/experts/[id]` | 전문가 상세 — 소개·전문분야·경력 타임라인·상담상품·상담가능시간·리뷰 |
| `/booking/[id]` | 6단계 상담 예약 플로우 |
| `/booking/complete` | 예약 완료 (체크 애니메이션 + 예약번호) |
| `/mypage` | 예정/완료 상담, 찜한 전문가, 후기, 히스토리, 프로필 |
| `/chat` | 채팅 안내 (데모 범위 밖 — UI만 제공) |
| `/about` | 제작사(미래에이아이랩) 소개 |

## 폴더 구조

```
src/
├─ app/                     # App Router 페이지
├─ components/
│  ├─ layout/               # Header, Footer, MobileTabBar, Logo
│  ├─ home/                 # Hero, CategoryGrid, FeaturedExperts, HowItWorks, ...
│  ├─ experts/              # ExpertCard, FilterPanel, ExpertSearchClient
│  ├─ expert/               # 상세 페이지 구성요소 (BookingCard, ReviewList, ...)
│  ├─ compare/              # CompareBar, CompareView
│  ├─ booking/              # BookingFlow, DayStrip, MonthCalendar, StepIndicator, BookingComplete
│  ├─ mypage/               # MyPageClient
│  └─ ui/                   # Portrait, Button, Stars, Overlay, Toaster, Icon
└─ lib/
   ├─ data/                 # experts(12명), reviews(30개), categories(10개)
   ├─ store/AppStore.tsx    # 찜 / 비교 / 예약 상태 + Toast (localStorage 영속)
   ├─ availability.ts       # 전문가·날짜 기반 결정적 예약 슬롯 생성
   ├─ search.ts             # 검색 · 필터 · 정렬 로직
   ├─ format.ts             # 날짜·가격·시간 포맷 유틸
   └─ types.ts
```

## 데이터

- **전문가 12명** — 분야, 경력, 평점, 상담 건수, 상담료, 상담 방식, 예약 가능 여부가 모두 다릅니다.
- **리뷰 30개** — 실제 상담 후기 형태의 한국어 문장 (Lorem ipsum 없음).
- **상담 슬롯** — `expertId + 날짜` 해시 기반으로 생성되어 새로고침해도 동일합니다.
  일요일 휴무, 토요일 축소 운영, 일부 날짜 마감이 반영되며,
  오늘 날짜는 이미 지난 시간과 1시간 이내 임박한 시간을 제외합니다.

### 상태 저장

찜 / 비교 / 예약 내역은 `localStorage` 키 `expertmatch:v1` 에 저장됩니다.
localStorage 는 마운트 이후에만 읽어 Hydration 불일치가 발생하지 않도록 처리했습니다.

### Supabase

`supabase/schema.sql` 에 `users / experts / expert_categories / expert_skills /
consultation_products / availability / bookings / reviews / favorites` 테이블과
RLS 정책을 정의해 두었습니다. Mock 데이터 구조와 1:1로 대응하므로 데이터 소스만
교체하면 됩니다.

## UX 상세

- **검색 자동완성** — 입력 즉시 추천 검색어 · 상담 분야 · 전문가를 제안하고,
  ↑/↓/Enter/Esc 키보드 탐색을 지원합니다 (`src/lib/suggest.ts`).
- **적용된 필터 칩** — 결과 상단에 적용 중인 필터를 칩으로 노출하고 개별 해제할 수 있습니다.
- **최근 본 전문가** — 상세 진입 이력을 최대 8명까지 저장해 검색·상세 하단에 노출합니다.
- **맨 위로 버튼** — 하단 고정 바(비교 바 · 예약 CTA)와 겹치지 않도록 위치를 자동 조정합니다.
- **접근성** — 본문 건너뛰기 링크, 검색 결과 수 `aria-live` 안내,
  콤보박스 ARIA 속성, 최소 44px 터치 영역.

## 반응형 · QA

375 / 390 / 430 / 768 / 1024 / 1280 / 1440 뷰포트를 실제 브라우저(Chromium)로
검증했으며, 모든 구간에서 가로 스크롤과 요소 이탈이 없습니다.

QA로 확인한 대표 플로우:

- **Desktop** — 홈 → `창업` 검색 → 평점 필터 → 전문가 2명 비교 → 상세 →
  상담 상품 → 방식 → 날짜 → 시간 → 내용 → 예약 → 완료 → 마이페이지 조회
- **Mobile** — 홈 → 카테고리 → 목록 → 필터 시트 → 비교 → 상세 → 예약 → 완료 → 마이페이지

TypeScript 오류 0, ESLint 경고 0, 브라우저 콘솔 오류·Hydration 경고 0입니다.

- **모바일**: 하단 탭 내비게이션(홈/검색/예약/채팅/마이), 필터 바텀시트,
  예약 Sticky CTA, 세로 카드형 비교, 최소 44px 터치 영역
- **데스크톱**: 좌측 필터 사이드바 + 2열 카드 그리드, 하단 Compare Bar,
  상세 페이지 우측 Sticky 예약 카드, 표 형태 비교

## 디자인

첨부된 레퍼런스 디자인(PC 검색·비교 / 모바일 매칭·예약)을 기준으로 구현했습니다.

Deep Navy(`navy-900 #16294B`) + Teal(`teal-600 #0E7C86`) 조합의
Premium Professional Marketplace 톤입니다. 평점은 Warm Yellow(`amber-500`),
경고는 Soft Red(`danger-500`)로 제한해 사용합니다.
전환 시간은 150~300ms이며 `prefers-reduced-motion` 을 존중합니다.

레퍼런스에서 가져온 주요 요소:

- 네이비 Hero + 대형 검색창 + 인기 검색어 칩, 우측 나침반 일러스트(인라인 SVG)
- 검증된 전문가 / 정확한 매칭 / 간편한 예약 / 안전한 상담 4-up 가치 스트립
- 좌측 체크박스형 필터 사이드바 + 3열 전문가 카드 그리드
- 카드: 프로필 이미지 · 평점 · 태그 · `50,000원 / 30분` · 요일별 예약 가능 스트립
- 하단 비교 바 + 항목별 비교표(BEST 표시)
- 모바일: 원형 카테고리 그리드, 상담 방식 라디오 행, 가로 날짜 선택, 시간 칩 그리드

레이아웃은 기계적으로 복제하지 않고 반응형·사용성 관점에서 조정했습니다
(예: 비교는 스펙에 맞춰 하단 Compare Bar + 모달, 예약은 6단계 Step 플로우).

### 프로필 이미지

전문가 12명의 실제 프로필 사진을 `public/experts/{expertId}.png` 에 원본 그대로
보관하고, `next/image` 로 뷰포트에 맞는 크기·포맷(WebP)으로 변환해 전달합니다.
사진이 없는 전문가는 `src/components/ui/Portrait.tsx` 의 듀오톤 실루엣
placeholder 로 자동 대체됩니다.

### 컬러

파랑·청록 일변도가 되지 않도록 두 축을 추가했습니다.

- **Gold** (`gold-400 #D6AC4E`) — 배지, 섹션 라벨, 히어로 액센트 등 신뢰감에 온기를 더하는 포인트
- **Cream** (`cream-50 #FDFBF8`) — 흰색/회색만 반복되지 않도록 섹션 배경에 사용

홈은 `네이비 히어로 → 크림 → 화이트 → 네이비 → 크림 → 네이비 CTA` 로
명암이 교차하도록 구성했고, 카테고리 아이콘은 분야별 색상을 부여했습니다.

### 타이포그래피

본문 기준 21px, 그 외 모든 크기를 최초 대비 약 1.55배 키워 한국어 가독성을
우선했습니다 (예: 13px → 21px, 15px → 24px, 히어로 H1 50px → 78px).

## 제작사 표기

이 데모가 **미래에이아이랩(MIRAE AI LAB)** 의 레퍼런스 작업물임을 알 수 있도록
다음 위치에 표기했습니다.

- 모든 페이지 최상단 제작사 바 (심볼 + "미래에이아이랩이 제작한 서비스 레퍼런스 데모")
- 홈 하단 제작사 소개 밴드 (로고 · 역량 3종 · CTA)
- 푸터 `Built by` 로고 블록 및 저작권 표기
- `/about` 제작사 소개 페이지
- 데모 계정 = **미래에이아이랩 김팀장** (헤더 · 마이페이지)
- 메타데이터 `author` / `creator` / `publisher` / OpenGraph

로고 원본은 `public/brand/mirae-logo.png` 에 배경을 투명 처리해 보관하며,
글자색이 짙어 어두운 배경에서는 밝은 플레이트 위에 올려 사용합니다
(`src/components/brand/MiraeLogo.tsx` 의 `plate` 옵션).

## 구현 범위 밖 (의도적으로 제외)

실제 PG 결제, 실시간 채팅, 영상통화, 소셜 로그인, 전문가 정산/관리자,
푸시 알림은 MVP 범위에서 제외했습니다.
