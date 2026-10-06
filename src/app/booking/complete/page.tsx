import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingComplete } from "@/components/booking/BookingComplete";
import { CardSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "예약 완료",
  robots: { index: false },
};

export default function BookingCompletePage() {
  return (
    <Suspense
      fallback={<CardSkeleton />}
    >
      <BookingComplete />
    </Suspense>
  );
}
