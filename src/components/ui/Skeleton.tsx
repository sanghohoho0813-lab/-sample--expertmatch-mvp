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

/** 마이페이지 목록 자리 — 빈 화면 안내와 같은 높이로 잡아 로딩 후 아래 영역이 밀리지 않게 */
export function ListSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="내 상담을 불러오는 중">
      <Bone className="h-[330px] w-full rounded-2xl" />
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
      <div className="mt-6">
        <ListSkeleton />
      </div>
    </div>
  );
}
