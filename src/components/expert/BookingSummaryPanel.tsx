"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { METHOD_LABEL } from "@/lib/data/categories";
import { useExpertAvailability } from "@/lib/useAvailability";
import { formatPrice, formatSlotLabel, responseLabel } from "@/lib/format";
import type { Expert } from "@/lib/types";

/** 상세 히어로 우측 — 예약 결정에 필요한 정보와 단 하나의 Primary CTA */
export function BookingSummaryPanel({ expert }: { expert: Expert }) {
  const avail = useExpertAvailability(expert);
  const lowest = expert.products.reduce((a, b) => (b.price < a.price ? b : a));

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-6">
      <p className="text-[19.5px] text-navy-300">상담료</p>
      <p className="mt-1 text-[37.5px] font-extrabold leading-none tracking-tight text-white">
        {formatPrice(lowest.price)}
        <span className="ml-1 text-[20.5px] font-semibold text-navy-300">
          원 / {lowest.minutes}분부터
        </span>
      </p>

      <div className="mt-5 rounded-xl bg-white/[0.07] p-4">
        <p className="flex items-center gap-1.5 text-[19.5px] text-navy-300">
          <CalendarClock className="h-4 w-4" strokeWidth={2.2} />
          가장 빠른 예약
        </p>
        <p className="mt-1 min-h-[30px] text-[28px] font-bold text-teal-200">
          {!avail
            ? "확인 중"
            : avail.earliest
              ? formatSlotLabel(avail.earliest.dateKey, avail.earliest.time, avail.now)
              : "예약 가능한 시간 없음"}
        </p>
        {avail && avail.earliest && (
          <p className="mt-0.5 text-[19.5px] text-navy-300">
            7일 이내 {avail.weekCount}개 시간 예약 가능
          </p>
        )}
      </div>

      <dl className="mt-4 space-y-2 text-[20.5px]">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-navy-300">상담 방식</dt>
          <dd className="font-semibold text-white">
            {expert.methods.map((m) => METHOD_LABEL[m].replace("상담", "")).join(" · ")}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-navy-300">응답</dt>
          <dd className="font-semibold text-white">
            {responseLabel(expert.responseMinutes).replace("평균 ", "")}
          </dd>
        </div>
      </dl>

      <Link
        href={`/booking/${expert.id}`}
        className="mt-5 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-teal-500 text-[23px] font-bold text-navy-950 transition-colors duration-200 hover:bg-teal-400"
      >
        상담 예약하기
        <ArrowRight className="h-5 w-5" strokeWidth={2.4} />
      </Link>
    </div>
  );
}

/** 모바일 히어로 — 가격과 가장 빠른 예약을 첫 화면에 */
export function QuickFacts({ expert }: { expert: Expert }) {
  const avail = useExpertAvailability(expert);
  const lowest = expert.products.reduce((a, b) => (b.price < a.price ? b : a));
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] lg:hidden">
      <div className="p-4">
        <dt className="text-[18.5px] text-navy-300">상담료</dt>
        <dd className="mt-1 text-[25.5px] font-bold text-white">
          {formatPrice(lowest.price)}원~
        </dd>
      </div>
      <div className="border-l border-white/10 p-4">
        <dt className="text-[18.5px] text-navy-300">가장 빠른 예약</dt>
        <dd className="mt-1 min-h-[28px] text-[22px] font-bold leading-snug text-teal-200">
          {!avail
            ? "확인 중"
            : avail.earliest
              ? formatSlotLabel(avail.earliest.dateKey, avail.earliest.time, avail.now)
              : "없음"}
        </dd>
      </div>
    </dl>
  );
}
