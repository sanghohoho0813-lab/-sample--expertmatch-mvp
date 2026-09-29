"use client";

import Link from "next/link";
import { useMemo } from "react";
import { shortestMinutes, useSlotPicker } from "@/lib/useAvailability";
import { cx, formatTimeKorean, parseDateKey, toDateKey } from "@/lib/format";
import type { Expert } from "@/lib/types";

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

/** 앞으로 7일 예약 가능 현황 — 예약 달력과 같은 계산(저장된 예약 반영)을 쓴다 */
export function AvailabilityPreview({ expert }: { expert: Expert }) {
  const { now, getOpen } = useSlotPicker(expert.id, shortestMinutes(expert));

  const days = useMemo(() => {
    if (!now) return null;
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const dateKey = toDateKey(d);
      return { dateKey, slots: getOpen(dateKey) };
    });
  }, [now, getOpen]);

  return (
    <section id="availability" className="scroll-mt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-[33px] font-bold text-navy-900 sm:text-[37.5px]">
          상담 가능 시간
        </h2>
        <Link
          href={`/booking/${expert.id}`}
          className="text-[22px] font-semibold text-teal-700 transition-colors hover:text-teal-800"
        >
          전체 일정 보기
        </Link>
      </div>
      <p className="mt-1.5 text-[22px] text-navy-500">앞으로 7일간 예약 가능한 시간입니다.</p>

      {days === null ? (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-[112px] animate-pulse rounded-xl bg-navy-100/70" />
          ))}
        </div>
      ) : (
        <ul className="scroll-slim -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-7 sm:overflow-visible">
          {days.map(({ dateKey, slots }) => {
            const d = parseDateKey(dateKey);
            const closed = slots.length === 0;
            return (
              <li
                key={dateKey}
                className={cx(
                  "flex w-[96px] shrink-0 flex-col rounded-xl border p-3 sm:w-auto",
                  closed ? "border-navy-100 bg-navy-50/60" : "border-navy-100 bg-white",
                )}
              >
                <span className="text-[19.5px] font-semibold text-navy-400">
                  {WEEKDAY[d.getDay()]}
                </span>
                <span
                  className={cx(
                    "text-[27px] font-extrabold",
                    closed ? "text-navy-300" : "text-navy-900",
                  )}
                >
                  {d.getDate()}
                </span>
                {closed ? (
                  <span className="mt-2 text-[19px] text-navy-300">마감</span>
                ) : (
                  <>
                    <span className="mt-2 text-[19px] font-bold text-teal-700">
                      {slots.length}개 시간
                    </span>
                    <span className="mt-0.5 text-[17.5px] leading-tight text-navy-400">
                      {formatTimeKorean(slots[0])}~
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
