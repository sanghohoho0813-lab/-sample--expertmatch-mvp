"use client";

import Link from "next/link";
import { CalendarClock } from "lucide-react";
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
          <p className="text-xl font-extrabold leading-tight text-navy-900">
            {formatPrice(lowest.price)}
            <span className="text-sm font-semibold text-navy-500">원~</span>
          </p>
          <p className="mt-0.5 flex min-h-[24px] items-center gap-1 whitespace-nowrap text-xs font-semibold leading-tight text-teal-700 min-[390px]:text-sm">
            {avail && (
              <>
                <CalendarClock className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden />
                {avail.earliest
                  ? formatSlotLabel(avail.earliest.dateKey, avail.earliest.time, avail.now)
                  : "예약 가능 시간 없음"}
              </>
            )}
          </p>
        </div>
        <Link
          href={`/booking/${expert.id}`}
          className="inline-flex h-[52px] shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-teal-600 px-4 text-md font-bold text-white min-[390px]:px-5 min-[390px]:text-lg transition-colors duration-200 hover:bg-teal-700"
        >
          상담 예약하기
        </Link>
      </div>
    </div>
  );
}
