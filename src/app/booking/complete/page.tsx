import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingComplete } from "@/components/booking/BookingComplete";

export const metadata: Metadata = {
  title: "예약 완료",
};

export default function BookingCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-20">
          <div className="mx-auto h-96 max-w-lg animate-pulse rounded-3xl bg-navy-100/70" />
        </div>
      }
    >
      <BookingComplete />
    </Suspense>
  );
}
