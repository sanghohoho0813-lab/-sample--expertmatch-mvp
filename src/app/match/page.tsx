import type { Metadata } from "next";
import { Suspense } from "react";
import { MatchSkeleton } from "@/components/ui/Skeleton";
import { MatchWizard } from "@/components/match/MatchWizard";

export const metadata: Metadata = {
  title: "맞춤 찾기",
  description: "5가지 질문에 답하면 고민·예산·일정에 맞는 전문가를 골라 드려요.",
};

export default function MatchPage() {
  return (
    <Suspense fallback={<MatchSkeleton />}>
      <MatchWizard />
    </Suspense>
  );
}
