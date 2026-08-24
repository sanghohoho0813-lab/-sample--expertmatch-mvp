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
│  ├─ booking/              # BookingFlow, MonthCalendar, StepIndicator, BookingComplete
│  ├─ mypage/               # MyPageClient
│  └─ ui/                   # Avatar, Button, Stars, Overlay, Toaster, Icon
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
  일요일 휴무, 토요일 축소 운영, 일부 날짜 마감이 반영됩니다.

### 상태 저장

찜 / 비교 / 예약 내역은 `localStorage` 키 `expertmatch:v1` 에 저장됩니다.
localStorage 는 마운트 이후에만 읽어 Hydration 불일치가 발생하지 않도록 처리했습니다.

### Supabase

`supabase/schema.sql` 에 `users / experts / expert_categories / expert_skills /
consultation_products / availability / bookings / reviews / favorites` 테이블과
RLS 정책을 정의해 두었습니다. Mock 데이터 구조와 1:1로 대응하므로 데이터 소스만
교체하면 됩니다.

## 반응형

375 / 390 / 430 / 768 / 1024 / 1280 / 1440 뷰포트에서 가로 스크롤과 요소 이탈이
없도록 구성했습니다.

- **모바일**: 하단 탭 내비게이션(홈/검색/예약/채팅/마이), 필터 바텀시트,
  예약 Sticky CTA, 세로 카드형 비교, 최소 44px 터치 영역
- **데스크톱**: 좌측 필터 사이드바 + 2열 카드 그리드, 하단 Compare Bar,
  상세 페이지 우측 Sticky 예약 카드, 표 형태 비교

## 디자인

Deep Navy(`navy-900 #0B1A33`) + Teal(`teal-600 #059089`) 조합의
Premium Professional Marketplace 톤입니다. 평점은 Warm Yellow(`amber-500`),
경고는 Soft Red(`danger-500`)로 제한해 사용합니다.
전환 시간은 150~300ms이며 `prefers-reduced-motion` 을 존중합니다.

전문가 프로필 이미지는 외부 이미지 의존 없이 항상 동일한 비율로 렌더링되는
그라데이션 모노그램 아바타를 사용합니다 (`src/components/ui/Avatar.tsx`).
실제 사진이 준비되면 이 컴포넌트만 교체하면 됩니다.

## 구현 범위 밖 (의도적으로 제외)

실제 PG 결제, 실시간 채팅, 영상통화, 소셜 로그인, 전문가 정산/관리자,
푸시 알림은 MVP 범위에서 제외했습니다.
