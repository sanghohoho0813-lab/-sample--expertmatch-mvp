import type { Metadata } from "next";
import { Suspense } from "react";
import { ExpertSearchClient } from "@/components/experts/ExpertSearchClient";
import { Bone } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "전문가 찾기",
  description:
    "분야·경력·평점·상담료로 전문가를 비교하고 바로 상담을 예약하세요.",
};

/** 검색 화면 로딩 — 검색창 · (모바일) 필터·분야 칩 · (데스크톱) 왼쪽 필터 · 결과 카드 격자 */
function SearchSkeleton() {
  return (
    <div className="shell min-h-[calc(100dvh-6rem)] py-4 lg:py-6" role="status" aria-label="전문가 목록을 불러오는 중">
      <Bone className="h-12 w-full rounded-2xl" />
      <div className="mt-2 flex gap-2 lg:hidden">
        <Bone className="h-12 flex-1 rounded-2xl" />
        <Bone className="h-12 flex-1 rounded-2xl" />
      </div>
      <Bone className="mt-3 h-10 w-full rounded-full lg:hidden" />
      <div className="mt-6 flex gap-6 xl:gap-8">
        <Bone className="hidden h-[560px] w-[272px] shrink-0 rounded-2xl lg:block" />
        <div className="min-w-0 flex-1">
          <Bone className="h-7 w-36" />
          <Bone className="mt-4 h-[68px] w-full rounded-2xl" />
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Bone key={i} className="h-[300px] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExpertsPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <ExpertSearchClient />
    </Suspense>
  );
}
