"use client";

import { Check } from "lucide-react";
import { cx } from "@/lib/format";

export function StepIndicator({
  steps,
  current,
  onJump,
  maxReached,
}: {
  steps: string[];
  current: number;
  maxReached: number;
  onJump: (index: number) => void;
}) {
  return (
    <>
      {/* 모바일: 진행 바 */}
      <div className="lg:hidden">
        <div className="flex items-baseline justify-between">
          <p className="text-[21px] font-bold text-teal-700">
            STEP {current + 1}
            <span className="ml-1 font-medium text-navy-400">/ {steps.length}</span>
          </p>
          <p className="text-[23.5px] font-bold text-navy-900">{steps[current]}</p>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-300 ease-out"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 데스크톱: 단계 목록 */}
      <ol className="hidden lg:flex lg:items-center lg:gap-0.5 xl:gap-1">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= maxReached;
          return (
            <li key={label} className="flex items-center gap-1">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(i)}
                className={cx(
                  "flex items-center gap-2 rounded-xl px-2 py-2 transition-colors duration-200 xl:px-2.5",
                  reachable && !active && "hover:bg-navy-50",
                  !reachable && "cursor-default",
                )}
              >
                <span
                  className={cx(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[19px] font-bold transition-colors duration-200",
                    active
                      ? "bg-teal-600 text-white"
                      : done
                        ? "bg-teal-100 text-teal-700"
                        : "bg-navy-100 text-navy-400",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                {/* 좁은 데스크톱에서는 현재 단계 라벨만 노출해 가로 넘침을 막는다 */}
                <span
                  className={cx(
                    "whitespace-nowrap text-[19px] font-semibold transition-colors duration-200 xl:text-[21px]",
                    active ? "text-navy-900" : "hidden text-navy-600 xl:inline",
                    !active && !done && "xl:text-navy-300",
                  )}
                >
                  {label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span
                  className={cx(
                    "h-px w-3 transition-colors duration-200 xl:w-5",
                    done ? "bg-teal-300" : "bg-navy-100",
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}
