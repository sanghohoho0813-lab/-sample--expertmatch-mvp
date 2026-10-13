import type { Metadata } from "next";
import { Suspense } from "react";
import { RescheduleFlow } from "@/components/booking/RescheduleFlow";
import { CardSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "일정 변경",
  robots: { index: false },
};

export default function ReschedulePage() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <RescheduleFlow />
    </Suspense>
  );
}
