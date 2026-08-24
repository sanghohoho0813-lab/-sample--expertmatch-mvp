"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bookableSlots } from "@/lib/availability";
import { cx, toDateKey } from "@/lib/format";

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];
const PAGE = 7;

/** 참고 디자인의 가로 날짜 선택 UI (6/3 월 · 6/4 화 …) */
export function DayStrip({
  expertId,
  today,
  now,
  value,
  onChange,
  horizon = 28,
}: {
  expertId: string;
  today: Date;
  now: Date;
  value: string | null;
  onChange: (dateKey: string) => void;
  horizon?: number;
}) {
  const [offset, setOffset] = useState(0);

  const days = useMemo(() => {
    return Array.from({ length: horizon }, (_, i) => {
      const d = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i,
      );
      const dateKey = toDateKey(d);
      const slots = bookableSlots(expertId, dateKey, now);
      return { d, dateKey, count: slots.length };
    });
  }, [expertId, today, now, horizon]);

  const page = days.slice(offset, offset + PAGE);
  const canPrev = offset > 0;
  const canNext = offset + PAGE < horizon;

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setOffset((o) => Math.max(0, o - PAGE))}
          aria-label="이전 날짜"
          className="flex h-11 w-9 shrink-0 items-center justify-center rounded-xl border border-navy-200 bg-white text-navy-500 transition-colors hover:bg-navy-50 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
        </button>

        <ul className="grid min-w-0 flex-1 grid-cols-7 gap-1.5">
          {page.map(({ d, dateKey, count }) => {
            const disabled = count === 0;
            const selected = value === dateKey;
            const sunday = d.getDay() === 0;
            return (
              <li key={dateKey}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(dateKey)}
                  aria-pressed={selected}
                  aria-label={`${d.getMonth() + 1}월 ${d.getDate()}일 ${
                    WEEKDAY[d.getDay()]
                  }요일${disabled ? " 예약 불가" : ` ${count}자리`}`}
                  className={cx(
                    "flex min-h-[62px] w-full flex-col items-center justify-center gap-0.5 rounded-xl border text-center transition-all duration-200 active:scale-[0.96]",
                    selected
                      ? "border-teal-600 bg-teal-600 text-white shadow-[0_8px_18px_-10px_rgba(14,124,134,0.95)]"
                      : disabled
                        ? "cursor-not-allowed border-navy-100 bg-navy-50/70 text-navy-300"
                        : "border-navy-200 bg-white text-navy-800 hover:border-teal-500 hover:bg-teal-50",
                  )}
                >
                  <span className="text-[14px] font-bold leading-none">
                    {d.getMonth() + 1}/{d.getDate()}
                  </span>
                  <span
                    className={cx(
                      "text-[11.5px] font-semibold leading-none",
                      selected
                        ? "text-teal-100"
                        : disabled
                          ? "text-navy-300"
                          : sunday
                            ? "text-danger-500"
                            : "text-navy-400",
                    )}
                  >
                    {WEEKDAY[d.getDay()]}
                  </span>
                  <span
                    className={cx(
                      "mt-0.5 text-[10.5px] font-bold leading-none",
                      selected
                        ? "text-white/90"
                        : disabled
                          ? "text-navy-200"
                          : "text-teal-700",
                    )}
                  >
                    {disabled ? "마감" : `${count}자리`}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          disabled={!canNext}
          onClick={() => setOffset((o) => Math.min(horizon - PAGE, o + PAGE))}
          aria-label="다음 날짜"
          className="flex h-11 w-9 shrink-0 items-center justify-center rounded-xl border border-navy-200 bg-white text-navy-500 transition-colors hover:bg-navy-50 disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
