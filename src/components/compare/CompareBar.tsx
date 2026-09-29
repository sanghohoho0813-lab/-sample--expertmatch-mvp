"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { GitCompareArrows, X } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Overlay } from "@/components/ui/Overlay";
import { CompareView } from "@/components/compare/CompareView";
import { EXPERT_MAP } from "@/lib/data/experts";
import { MAX_COMPARE, useAppStore } from "@/lib/store/AppStore";
import { cx } from "@/lib/format";

export function CompareBar() {
  const pathname = usePathname();
  const { compare, removeCompare, clearCompare, ready } = useAppStore();
  const [open, setOpen] = useState(false);

  const experts = compare.map((id) => EXPERT_MAP[id]).filter(Boolean);
  const hidden = !ready || experts.length === 0 || pathname.startsWith("/booking");

  // 전문가 상세는 탭바 대신 예약 CTA가 하단에 고정되므로 그 위로 띄운다
  const stacked = /^\/experts\/[^/]+/.test(pathname);

  if (hidden) return null;

  return (
    <>
      <div
        className={cx(
          "fixed inset-x-0 z-40 px-3 pb-3 pb-safe lg:bottom-0 lg:px-6 lg:pb-6",
          stacked ? "bottom-[78px]" : "bottom-[56px]",
        )}
      >
        <div className="mx-auto flex w-full max-w-shell animate-fade-up items-center gap-3 rounded-2xl bg-navy-900 p-3 shadow-pop sm:gap-4 sm:px-4">
          <div className="hidden shrink-0 items-center gap-2 pl-1 text-white sm:flex">
            <GitCompareArrows className="h-5 w-5 text-teal-400" strokeWidth={2.2} />
            <span className="text-[23px] font-bold">전문가 비교</span>
          </div>

          <ul className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
            {experts.map((e) => (
              <li key={e.id} className="relative shrink-0">
                <Portrait name={e.name} accent={e.accent}
          photo={e.photo} rounded="rounded-xl" className="h-10 w-10" />
                <button
                  type="button"
                  onClick={() => removeCompare(e.id)}
                  aria-label={`${e.name} 비교 목록에서 제외`}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-navy-700 bg-navy-800 text-navy-200 transition-colors hover:bg-danger-500 hover:text-white"
                >
                  <X className="h-3 w-3" strokeWidth={3} />
                </button>
              </li>
            ))}
            {Array.from({ length: MAX_COMPARE - experts.length }).map((_, i) => (
              <li
                key={`slot-${i}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-dashed border-navy-600 text-[17.5px] font-semibold text-navy-500"
                aria-hidden
              >
                +
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={clearCompare}
              className="hidden h-11 items-center rounded-xl px-3 text-[21.5px] font-medium text-navy-300 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              전체 해제
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-teal-500 px-4 text-[23px] font-bold text-navy-950 transition-all duration-200 hover:bg-teal-400 active:scale-[0.97]"
            >
              <span className="sm:hidden">
                <GitCompareArrows className="h-4 w-4" strokeWidth={2.4} />
              </span>
              전문가 {experts.length}명 비교하기
            </button>
          </div>
        </div>
      </div>

      <Overlay
        open={open}
        onClose={() => setOpen(false)}
        title={`전문가 ${experts.length}명 비교`}
        description="경력·가격·예약 가능일처럼 수치로 비교되는 항목만 표시해 드려요."
        width="max-w-5xl"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                clearCompare();
                setOpen(false);
              }}
              className="inline-flex h-12 items-center rounded-xl px-3 text-[23px] font-medium text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900"
            >
              비교 목록 비우기
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-12 items-center rounded-xl bg-navy-900 px-6 text-[24px] font-semibold text-white transition-colors hover:bg-navy-800"
            >
              계속 둘러보기
            </button>
          </div>
        }
      >
        <CompareView
          experts={experts}
          onRemove={removeCompare}
          onNavigate={() => setOpen(false)}
        />
      </Overlay>
    </>
  );
}
