"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { bookableSlots, startOfToday, type DayAvailability } from "@/lib/availability";
import { formatTimeKorean, parseDateKey, toDateKey } from "@/lib/format";

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

export function AvailabilityPreview({ expertId }: { expertId: string }) {
  const [days, setDays] = useState<DayAvailability[] | null>(null);

  // 날짜는 클라이언트 마운트 이후 계산해 하이드레이션 불일치를 방지
  useEffect(() => {
    const now = new Date();
    const from = startOfToday();
    setDays(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
        const dateKey = toDateKey(d);
        const slots = bookableSlots(expertId, dateKey, now);
        return { dateKey, slots, isClosed: slots.length === 0 };
      }),
    );
  }, [expertId]);

  return (
    <section id="availability" className="scroll-mt-24">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[25px] font-bold text-navy-900 sm:text-[28px]">
          상담 가능 시간
        </h2>
        <Link
          href={`/booking/${expertId}`}
          className="text-[19px] font-semibold text-teal-700 transition-colors hover:text-teal-800"
        >
          전체 일정 보기
        </Link>
      </div>
      <p className="mt-1.5 text-[19px] text-navy-500">
        앞으로 7일간 예약 가능한 시간입니다.
      </p>

      {days === null ? (
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-[104px] animate-pulse rounded-xl bg-navy-100/70" />
          ))}
        </div>
      ) : (
        <div className="scroll-slim mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-7 sm:overflow-visible">
          {days.map((day) => {
            const d = parseDateKey(day.dateKey);
            return (
              <div
                key={day.dateKey}
                className={`flex w-[86px] shrink-0 flex-col rounded-xl border p-2.5 sm:w-auto ${
                  day.isClosed
                    ? "border-navy-100 bg-navy-50/60"
                    : "border-navy-100 bg-white"
                }`}
              >
                <span className="text-[16px] font-semibold text-navy-400">
                  {WEEKDAY[d.getDay()]}
                </span>
                <span
                  className={`mt-0.5 text-[21px] font-extrabold ${
                    day.isClosed ? "text-navy-300" : "text-navy-900"
                  }`}
                >
                  {d.getDate()}
                </span>
                {day.isClosed ? (
                  <span className="mt-2 text-[16px] text-navy-300">마감</span>
                ) : (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-teal-50 px-1.5 py-1 text-[15px] font-bold text-teal-700">
                    <CalendarDays className="h-3 w-3" strokeWidth={2.4} />
                    {day.slots.length}자리
                  </span>
                )}
                {!day.isClosed && (
                  <span className="mt-1.5 text-[15px] leading-tight text-navy-400">
                    {formatTimeKorean(day.slots[0])} 부터
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
