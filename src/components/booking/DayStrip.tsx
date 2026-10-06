"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WEEKDAY, cx, toDateKey } from "@/lib/format";

const PAGE = 7;

/**
 * 가로 날짜 선택 UI.
 * 모바일: 손가락으로 넘기는 한 줄 스크롤 / 태블릿 이상: 7일 단위 페이지 + 화살표
 */
export function DayStrip({
  getSlots,
  today,
  value,
  onChange,
  horizon = 28,
}: {
  /** 저장된 예약까지 반영한 날짜별 예약 가능 시간 */
  getSlots: (dateKey: string) => string[];
  today: Date;
  value: string | null;
  onChange: (dateKey: string) => void;
  horizon?: number;
}) {
  // 미리 선택된 날짜가 있으면 그 날짜가 보이는 페이지에서 시작
  const [offset, setOffset] = useState(() => {
    if (!value) return 0;
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const [y, m, d] = value.split("-").map(Number);
    const idx = Math.round((new Date(y, m - 1, d).getTime() - start) / 86_400_000);
    return idx > 0 && idx < horizon ? Math.floor(idx / PAGE) * PAGE : 0;
  });
  const selectedRef = useRef<HTMLButtonElement>(null);

  // 모바일 가로 스크롤에서 선택된 날짜를 화면 안으로
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
    // 처음 진입했을 때만 맞춘다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days = useMemo(() => {
    return Array.from({ length: horizon }, (_, i) => {
      const d = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + i,
      );
      const dateKey = toDateKey(d);
      const slots = getSlots(dateKey);
      return { d, dateKey, count: slots.length };
    });
  }, [getSlots, today, horizon]);

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
          className="hidden h-11 w-9 shrink-0 items-center justify-center rounded-xl border border-navy-200 bg-white text-navy-500 transition-colors hover:bg-navy-50 disabled:opacity-30 sm:flex"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
        </button>

        <ul className="no-scrollbar -mx-5 flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto scroll-px-5 px-5 py-1 sm:mx-0 sm:grid sm:grid-cols-7 sm:gap-1.5 sm:overflow-visible sm:px-0">
          {days.map(({ d, dateKey, count }, i) => {
            const disabled = count === 0;
            const selected = value === dateKey;
            const sunday = d.getDay() === 0;
            const inPage = i >= offset && i < offset + PAGE;
            return (
              <li key={dateKey} className={cx("w-[72px] shrink-0 snap-start sm:w-auto", !inPage && "sm:hidden")}>
                <button
                  ref={selected ? selectedRef : undefined}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(dateKey)}
                  aria-pressed={selected}
                  aria-label={`${d.getMonth() + 1}월 ${d.getDate()}일 ${
                    WEEKDAY[d.getDay()]
                  }요일${disabled ? " 예약 불가" : ` ${count}자리`}`}
                  className={cx(
                    "flex min-h-[76px] w-full flex-col items-center justify-center gap-1 rounded-xl border text-center transition-colors duration-200",
                    selected
                      ? "border-teal-600 bg-teal-600 text-white shadow-[0_8px_18px_-10px_rgba(14,124,134,0.95)]"
                      : disabled
                        ? "cursor-not-allowed border-navy-100 bg-navy-50/70 text-navy-300"
                        : "border-navy-200 bg-white text-navy-800 hover:border-teal-500 hover:bg-teal-50",
                  )}
                >
                  <span className="text-[21px] font-bold leading-none">
                    {d.getMonth() + 1}/{d.getDate()}
                  </span>
                  <span
                    className={cx(
                      "text-[18px] font-semibold leading-none",
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
                      "mt-0.5 text-[17px] font-bold leading-none",
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
          className="hidden h-11 w-9 shrink-0 items-center justify-center rounded-xl border border-navy-200 bg-white text-navy-500 transition-colors hover:bg-navy-50 disabled:opacity-30 sm:flex"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
