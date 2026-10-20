import { cx } from "@/lib/format";

/** 회색 자리표시 블록 — 실제 화면과 같은 자리·크기로 그려 로딩 후 흔들림이 없게 한다 */
export function Bone({ className }: { className?: string }) {
  return <div className={cx("animate-pulse rounded-xl bg-navy-100/70", className)} aria-hidden />;
}

/** 예약 화면 로딩: 상단 단계 바 + 질문 + 선택지 + 우측 요약 */
export function BookingSkeleton() {
  return (
    <div role="status" aria-label="예약 화면을 불러오는 중">
      <div className="border-b border-navy-100 bg-white">
        <div className="shell py-4">
          <Bone className="h-8 w-56" />
          <Bone className="mt-4 h-2 w-full rounded-full lg:hidden" />
        </div>
      </div>
      <div className="shell flex gap-10 py-8 lg:py-10">
        <div className="min-w-0 flex-1 space-y-3">
          <Bone className="h-11 w-3/4 max-w-md" />
          <Bone className="h-6 w-1/2 max-w-xs" />
          <div className="space-y-3 pt-4">
            {[0, 1, 2].map((i) => (
              <Bone key={i} className="h-[120px] w-full rounded-2xl" />
            ))}
          </div>
        </div>
        <Bone className="hidden h-[360px] w-[372px] shrink-0 rounded-2xl lg:block" />
      </div>
    </div>
  );
}

/** 단일 카드형 화면 로딩 (예약 완료·상세) */
export function CardSkeleton() {
  return (
    <div className="shell py-12 sm:py-16" role="status" aria-label="불러오는 중">
      <div className="mx-auto max-w-lg space-y-4">
        <Bone className="mx-auto h-20 w-20 rounded-full" />
        <Bone className="mx-auto h-10 w-3/4" />
        <Bone className="h-[320px] w-full rounded-3xl" />
      </div>
    </div>
  );
}

/** 마이페이지 목록 자리 — 예약 카드·빈 화면 안내와 같은 높이(약 310px)로 잡아 로딩 후 아래 영역이 밀리지 않게 */
export function ListSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="내 상담을 불러오는 중">
      <Bone className="h-[310px] w-full rounded-2xl" />
    </div>
  );
}

/**
 * 예약 상세 로딩 — 마이페이지에서 다시 여는 경우가 대부분이라 상세 배치(뒤로 · 상태 카드 · 영수증,
 * 데스크톱은 오른쪽 상담방·준비)와 같은 자리·크기로 그린다.
 */
export function BookingDetailSkeleton() {
  return (
    <div className="shell py-6 sm:py-10" role="status" aria-label="예약 정보를 불러오는 중">
      <div className="mx-auto grid max-w-lg grid-cols-1 lg:max-w-5xl lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <div>
          <Bone className="h-11 w-24" />
          <Bone className="mt-2 h-[240px] w-full rounded-3xl" />
          <Bone className="mt-6 h-[366px] w-full rounded-3xl" />
        </div>
        <div className="hidden lg:block">
          <Bone className="mt-[52px] h-[154px] w-full rounded-2xl" />
          <Bone className="mt-8 h-[320px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/** 마이페이지 전체 로딩: 제목 + 탭 + 목록 */
export function MyPageSkeleton() {
  return (
    <div className="shell py-6 pb-32 lg:py-10 lg:pb-20">
      <div className="flex items-center gap-3.5">
        <Bone className="h-14 w-14 rounded-2xl" />
        <div className="space-y-2">
          <Bone className="h-5 w-28" />
          <Bone className="h-8 w-48" />
        </div>
      </div>
      <Bone className="mt-6 h-12 w-full" />
      {/* 기본 탭(상담)의 예정·완료·취소 선택 */}
      <Bone className="mt-4 h-[52px] w-full sm:w-72" />
      <div className="mt-5">
        <ListSkeleton />
      </div>
    </div>
  );
}

/** 전문가 카드 자리 — 사진 · 이름 줄 · 문구 · 근거 · 가격 줄 (맞춤 찾기 결과처럼 카드가 늦게 그려지는 곳) */
export function ExpertCardSkeleton() {
  return (
    <div className="flex min-h-[420px] flex-col rounded-2xl border border-navy-100 bg-white p-4 sm:p-5" aria-hidden>
      <div className="flex gap-3.5">
        <Bone className="h-[84px] w-[84px] shrink-0 sm:h-[100px] sm:w-[100px]" />
        <div className="flex-1 space-y-2 pt-1">
          <Bone className="h-3.5 w-12" />
          <Bone className="h-5 w-28" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-24" />
        </div>
      </div>
      <Bone className="mt-4 h-4 w-full" />
      <Bone className="mt-2 h-4 w-4/5" />
      <Bone className="mt-3 h-[84px] w-full" />
      <Bone className="mt-auto h-11 w-full" />
    </div>
  );
}

/** 맞춤 찾기 질문 화면 로딩 — 진행 줄 · 질문 · 두 칸 선택지 */
export function MatchSkeleton() {
  return (
    <div className="shell max-w-2xl py-8 pb-32 sm:py-12" role="status" aria-label="질문을 불러오는 중">
      <Bone className="h-11 w-40" />
      <Bone className="mt-3 h-1.5 w-full rounded-full" />
      <Bone className="mt-8 h-8 w-4/5" />
      <Bone className="mt-3 h-5 w-1/2" />
      <div className="mt-7 grid grid-cols-2 gap-2.5 sm:gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Bone key={i} className="h-[96px] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

/** 맞춤 찾기 결과 로딩 — 제목 · 조건 · 카드 세 장 */
export function MatchResultSkeleton() {
  return (
    <div className="shell py-8 pb-32 sm:py-12" role="status" aria-label="추천 결과를 불러오는 중">
      <Bone className="h-5 w-32" />
      <Bone className="mt-4 h-[60px] w-full max-w-xl sm:h-10" />
      <Bone className="mt-3 h-10 w-full max-w-2xl" />
      <Bone className="mt-6 h-[88px] w-full max-w-xl sm:h-10" />
      <Bone className="mt-8 h-7 w-44" />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <ExpertCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/** 비교 화면 로딩 — 제목 · 차이 표 · 이런 경우 카드 */
export function CompareSkeleton() {
  return (
    <div className="shell py-8 pb-32 sm:py-12" role="status" aria-label="비교 화면을 불러오는 중">
      <Bone className="h-10 w-32" />
      <Bone className="mt-3 h-10 w-64" />
      <Bone className="mt-2 h-5 w-80 max-w-full" />
      <Bone className="mt-8 h-7 w-40" />
      <Bone className="mt-4 h-[300px] w-full rounded-2xl" />
      <Bone className="mt-10 h-7 w-52" />
      <Bone className="mt-4 h-[420px] w-full rounded-2xl" />
    </div>
  );
}

/** 상담방 로딩 — 뒤로 · 전문가 머리말 · 진행 단계 · 입장 안내 · 전달 내용 */
export function RoomSkeleton() {
  return (
    <div className="mx-auto max-w-2xl" role="status" aria-label="상담방을 불러오는 중">
      <Bone className="h-11 w-24" />
      <div className="mt-2 flex items-center gap-3.5">
        <Bone className="h-16 w-16 shrink-0 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Bone className="h-7 w-3/4" />
          <Bone className="h-4 w-1/2" />
        </div>
      </div>
      <Bone className="mt-6 h-[52px] w-full" />
      <Bone className="mt-6 h-[164px] w-full rounded-2xl" />
      <Bone className="mt-6 h-[132px] w-full rounded-2xl" />
    </div>
  );
}
