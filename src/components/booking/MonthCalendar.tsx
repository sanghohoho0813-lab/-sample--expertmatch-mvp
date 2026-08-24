"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bookableSlots } from "@/lib/availability";
import { cx, toDateKey } from "@/lib/format";

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

export function MonthCalendar({
  expertId,
  today,
  now,
  value,
  onChange,
  /** 예약 가능 기간 (오늘부터 n일) */
  horizon = 60,
}: {
  expertId: string;
  today: Date;
  now: Date;
  value: string | null;
  onChange: (dateKey: string) => void;
  horizon?: number;
}) {
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const last = useMemo(
    () =>
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + horizon),
    [today, horizon],
  );

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const daysInMonth = new Date(
      cursor.getFullYear(),
      cursor.getMonth() + 1,
      0,
    ).getDate();
    const lead = first.getDay();
    const out: Array<{ date: Date | null } > = [];
    for (let i = 0; i < lead; i += 1) out.push({ date: null });
    for (let d = 1; d <= daysInMonth; d += 1) {
      out.push({ date: new Date(cursor.getFullYear(), cursor.getMonth(), d) });
    }
    return out;
  }, [cursor]);

  const canPrev =
    cursor.getFullYear() > today.getFullYear() ||
    (cursor.getFullYear() === today.getFullYear() &&
      cursor.getMonth() > today.getMonth());
  const canNext =
    new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1).getTime() <=
    last.getTime();

  const shift = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-navy-100 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={!canPrev}
          aria-label="이전 달"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-navy-500 transition-colors hover:bg-navy-50 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <p className="text-[16px] font-bold text-navy-900">
          {cursor.getFullYear()}년 {cursor.getMonth() + 1}월
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={!canNext}
          aria-label="다음 달"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-navy-500 transition-colors hover:bg-navy-50 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {WEEKDAY.map((w, i) => (
          <div
            key={w}
            className={cx(
              "pb-2 text-center text-[12px] font-semibold",
              i === 0 ? "text-danger-500" : "text-navy-400",
            )}
          >
            {w}
          </div>
        ))}

        {cells.map((cell, i) => {
          if (!cell.date) return <div key={`empty-${i}`} />;
          const dateKey = toDateKey(cell.date);
          const isPast = cell.date.getTime() < today.getTime();
          const isBeyond = cell.date.getTime() > last.getTime();
          const slots = isPast || isBeyond ? [] : bookableSlots(expertId, dateKey, now);
          const disabled = isPast || isBeyond || slots.length === 0;
          const selected = value === dateKey;
          const isToday = dateKey === toDateKey(today);

          return (
            <button
              key={dateKey}
              type="button"
              disabled={disabled}
              onClick={() => onChange(dateKey)}
              aria-pressed={selected}
              aria-label={`${cell.date.getMonth() + 1}월 ${cell.date.getDate()}일${
                disabled ? " 예약 불가" : ` 예약 가능 ${slots.length}자리`
              }`}
              className={cx(
                "relative flex h-11 w-full flex-col items-center justify-center rounded-xl text-[14.5px] font-semibold transition-all duration-200 sm:h-[46px]",
                selected
                  ? "bg-teal-600 text-white shadow-[0_6px_16px_-8px_rgba(5,144,137,0.9)]"
                  : disabled
                    ? "cursor-not-allowed text-navy-200"
                    : "text-navy-800 hover:bg-teal-50 active:scale-[0.94]",
                isToday && !selected && !disabled && "ring-1 ring-inset ring-navy-200",
              )}
            >
              {cell.date.getDate()}
              {!disabled && (
                <span
                  className={cx(
                    "mt-0.5 h-1 w-1 rounded-full",
                    selected ? "bg-white" : "bg-teal-500",
                  )}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-navy-100 pt-3.5 text-[12.5px] text-navy-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          예약 가능
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-navy-200" />
          예약 마감
        </span>
      </div>
    </div>
  );
}
