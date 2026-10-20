import type { Metadata } from "next";
import { Suspense } from "react";
import { MatchResultSkeleton } from "@/components/ui/Skeleton";
import { MatchResult } from "@/components/match/MatchResult";

export const metadata: Metadata = {
  title: "맞춤 찾기 결과",
  description: "내 고민·예산·일정과 전문가 데이터를 하나씩 대조한 추천 결과예요.",
};

export default function MatchResultPage() {
  return (
    <Suspense fallback={<MatchResultSkeleton />}>
      <MatchResult />
    </Suspense>
  );
}
