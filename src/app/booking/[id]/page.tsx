import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { BookingSkeleton } from "@/components/ui/Skeleton";
import { EXPERTS, getExpert } from "@/lib/data/experts";

/** 목록에 없는 전문가 주소는 빌드된 404 로 */
export const dynamicParams = false;

export function generateStaticParams() {
  return EXPERTS.map((e) => ({ id: e.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const expert = getExpert(params.id);
  return {
    title: expert ? `${expert.name} 전문가 상담 예약` : "상담 예약",
  };
}

export default function BookingPage({ params }: { params: { id: string } }) {
  const expert = getExpert(params.id);
  if (!expert) notFound();

  return (
    <Suspense
      fallback={<BookingSkeleton />}
    >
      <BookingFlow expert={expert} />
    </Suspense>
  );
}
