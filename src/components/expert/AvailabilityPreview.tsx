"use client";

import Link from "next/link";
import { useMemo } from "react";
import { shortestMinutes, useSlotPicker } from "@/lib/useAvailability";
import { WEEKDAY, cx, parseDateKey, toDateKey } from "@/lib/format";
import type { Expert } from "@/lib/types";


/**
 * 앞으로 7일 예약 가능 현황 — 예약 달력과 같은 계산(저장된 예약 반영)을 쓴다.
 * 날짜를 누르면 그 날짜가 선택된 상태로 예약을 시작한다.
 */
export function AvailabilityPreview({ expert }: { expert: Expert }) {
  const { now, getOpen } = useSlotPicker(expert.id, shortestMinutes(expert));

  const days = useMemo(() => {
    if (!now) return null;
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const dateKey = toDateKey(d);
      return { dateKey, offset: i, slots: getOpen(dateKey) };
    });
  }, [now, getOpen]);

  return (
    <section id="availability" className="scroll-mt-28">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-4xl font-bold text-navy-900 sm:text-5xl">상담 가능 시간</h2>
        <Link
          href={`/booking/${expert.id}`}
          className="inline-flex min-h-[44px] shrink-0 items-center text-md font-semibold text-teal-700 transition-colors hover:text-teal-800"
        >
          전체 일정
        </Link>
      </div>
      <p className="mt-1 text-md text-navy-500">날짜를 누르면 바로 예약할 수 있어요.</p>

      {days === null ? (
        <div className="mt-4 flex gap-2 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-[112px] w-[104px] shrink-0 animate-pulse rounded-xl bg-navy-100/70 md:flex-1" />
          ))}
        </div>
      ) : (
        <ul className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-7 md:overflow-visible md:px-0">
          {days.map(({ dateKey, offset, slots }) => {
            const d = parseDateKey(dateKey);
            const closed = slots.length === 0;
            const dayLabel = offset === 0 ? "오늘" : offset === 1 ? "내일" : WEEKDAY[d.getDay()];
            const body = (
              <>
                <span className={cx("text-sm font-semibold", closed ? "text-navy-300" : "text-navy-500")}>
                  {dayLabel}
                </span>
                <span className={cx("text-3xl font-extrabold leading-tight", closed ? "text-navy-300" : "text-navy-900")}>
                  {d.getMonth() + 1}/{d.getDate()}
                </span>
                {closed ? (
                  <span className="mt-1.5 text-sm text-navy-300">마감</span>
                ) : (
                  <>
                    <span className="mt-1.5 text-sm font-bold text-teal-700">{slots.length}개</span>
                    <span className="text-xs text-navy-400">{slots[0]}부터</span>
                  </>
                )}
              </>
            );
            return (
              <li key={dateKey} className="w-[104px] shrink-0 md:w-auto">
                {closed ? (
                  <div
                    className="flex h-full flex-col rounded-xl border border-navy-100 bg-navy-50/60 p-3"
                    aria-label={`${d.getMonth() + 1}월 ${d.getDate()}일 예약 마감`}
                  >
                    {body}
                  </div>
                ) : (
                  <Link
                    href={`/booking/${expert.id}?date=${dateKey}`}
                    aria-label={`${d.getMonth() + 1}월 ${d.getDate()}일 ${slots.length}개 시간 예약하기`}
                    className="flex h-full flex-col rounded-xl border border-navy-200 bg-white p-3 transition-colors hover:border-teal-500 hover:bg-teal-50/50"
                  >
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
