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
import { useBottomLayerChange } from "@/lib/useBottomLayerChange";

export function CompareBar() {
  const pathname = usePathname();
  const { compare, removeCompare, clearCompare, ready } = useAppStore();
  const [open, setOpen] = useState(false);

  const experts = compare.map((id) => EXPERT_MAP[id]).filter(Boolean);
  // 비교는 전문가를 둘러보는 화면(홈·검색·상세)에서만 띄운다
  const browsing = pathname === "/" || pathname.startsWith("/experts");
  const hidden = !ready || experts.length === 0 || !browsing;
  // 모바일 상세는 하단 예약 바가 우선 — 비교 바는 데스크톱에서만
  const onDetail = /^\/experts\/[^/]+/.test(pathname);
  const canCompare = experts.length >= 2;

  useBottomLayerChange(hidden, experts.length, pathname);

  if (hidden) return null;

  return (
    <>
      <div
        className={cx(
          // 데스크톱은 가운데 정렬한 폭으로 — 오른쪽 아래 공용 이동 버튼 자리를 비워 둔다
          "fixed inset-x-0 bottom-[56px] z-40 px-3 pb-2 lg:inset-x-auto lg:bottom-0 lg:left-1/2 lg:w-[min(860px,calc(100vw-260px))] lg:-translate-x-1/2 lg:px-0 lg:pb-6",
          onDetail && "hidden lg:block",
        )}
      >
        <div className="mx-auto flex w-full max-w-shell animate-fade-up items-center gap-3 rounded-2xl bg-navy-900 px-3 py-2.5 shadow-pop sm:gap-4 sm:px-4">
          <div className="hidden shrink-0 items-center gap-2 pl-1 text-white sm:flex">
            <GitCompareArrows className="h-5 w-5 text-teal-400" strokeWidth={2.2} />
            <span className="text-xl font-bold">전문가 비교</span>
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
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-dashed border-navy-600 text-sm font-semibold text-navy-500"
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
              className="hidden h-11 items-center rounded-xl px-3 text-lg font-medium text-navy-300 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              전체 해제
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              disabled={!canCompare}
              className="inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-xl bg-teal-500 px-4 text-lg font-bold text-navy-950 transition-colors duration-200 hover:bg-teal-400 disabled:cursor-default disabled:bg-white/10 disabled:text-navy-200"
            >
              <GitCompareArrows className="h-4 w-4 sm:hidden" strokeWidth={2.4} />
              {canCompare ? `${experts.length}명 비교하기` : "1명 더 담아 주세요"}
            </button>
          </div>
        </div>
      </div>

      <Overlay
        open={open}
        onClose={() => setOpen(false)}
        title={`전문가 ${experts.length}명 비교`}
        description="수치로 비교할 수 있는 항목만 모았어요."
        width="max-w-5xl"
        footer={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                clearCompare();
                setOpen(false);
              }}
              className="inline-flex h-12 shrink-0 items-center whitespace-nowrap rounded-xl border border-navy-200 px-4 text-md font-semibold text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900"
            >
              비우기
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-12 min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-navy-900 px-5 text-lg font-semibold text-white transition-colors hover:bg-navy-800 sm:ml-auto sm:flex-none"
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
