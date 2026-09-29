"use client";

import Link from "next/link";
import { useExpertAvailability } from "@/lib/useAvailability";
import { formatPrice, formatSlotLabel } from "@/lib/format";
import type { Expert } from "@/lib/types";

/** 모바일 상세 하단 고정 — 가격 · 가장 빠른 예약 · 상담 예약하기 하나만 */
export function MobileBookingBar({ expert }: { expert: Expert }) {
  const avail = useExpertAvailability(expert);
  const lowest = expert.products.reduce((a, b) => (b.price < a.price ? b : a));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-bar lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[23px] font-extrabold leading-tight text-navy-900">
            {formatPrice(lowest.price)}
            <span className="text-[18.5px] font-semibold text-navy-500">원~</span>
          </p>
          <p className="mt-0.5 text-[18px] font-semibold leading-tight text-teal-700">
            {!avail
              ? " "
              : avail.earliest
                ? `${formatSlotLabel(avail.earliest.dateKey, avail.earliest.time, avail.now)} 가능`
                : "예약 가능 시간 없음"}
          </p>
        </div>
        <Link
          href={`/booking/${expert.id}`}
          className="inline-flex h-[52px] shrink-0 items-center justify-center rounded-xl bg-teal-600 px-4 text-[21px] xs:px-5 xs:text-[22px] font-bold text-white transition-colors duration-200 hover:bg-teal-700"
        >
          상담 예약하기
        </Link>
      </div>
    </div>
  );
}
