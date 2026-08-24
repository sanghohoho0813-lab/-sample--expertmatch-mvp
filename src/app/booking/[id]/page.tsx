import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { EXPERTS, getExpert } from "@/lib/data/experts";

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
      fallback={
        <div className="shell py-16">
          <div className="h-96 animate-pulse rounded-2xl bg-navy-100/70" />
        </div>
      }
    >
      <BookingFlow expert={expert} />
    </Suspense>
  );
}
