import type { Metadata } from "next";
import { Suspense } from "react";
import { CompareSkeleton } from "@/components/ui/Skeleton";
import { ComparePage } from "@/components/compare/ComparePage";

export const metadata: Metadata = {
  title: "전문가 비교",
  description: "상담료·가장 빠른 예약·경력 차이와 상황별로 어떤 전문가가 맞는지 한 화면에서 비교해요.",
};

export default function CompareRoute() {
  return (
    <Suspense fallback={<CompareSkeleton />}>
      <ComparePage />
    </Suspense>
  );
}
