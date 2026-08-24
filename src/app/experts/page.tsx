import type { Metadata } from "next";
import { Suspense } from "react";
import { ExpertSearchClient } from "@/components/experts/ExpertSearchClient";

export const metadata: Metadata = {
  title: "전문가 찾기",
  description:
    "분야·경력·평점·상담료로 전문가를 비교하고 바로 상담을 예약하세요.",
};

function SearchSkeleton() {
  return (
    <div className="shell py-10">
      <div className="h-12 w-full animate-pulse rounded-2xl bg-navy-100" />
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-navy-100/70" />
        ))}
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
