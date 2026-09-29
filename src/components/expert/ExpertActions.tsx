"use client";

import { GitCompareArrows, Heart, Share2 } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { cx } from "@/lib/format";
import type { Expert } from "@/lib/types";

/** 찜 · 비교 · 공유 — 예약 CTA보다 한 단계 낮은 보조 액션 */
export function ExpertActions({ expert }: { expert: Expert }) {
  const { isFavorite, toggleFavorite, isComparing, toggleCompare, ready, pushToast } =
    useAppStore();
  const favorite = ready && isFavorite(expert.id);
  const comparing = ready && isComparing(expert.id);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: `${expert.name} 전문가`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      pushToast({ message: "링크를 복사했어요", tone: "success" });
    } catch {
      /* 사용자가 공유를 취소한 경우 */
    }
  };

  const base =
    "inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-[20px] font-medium transition-colors duration-200";

  return (
    <div className="-ml-3 flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => toggleFavorite(expert.id, expert.name)}
        aria-pressed={favorite}
        className={cx(
          base,
          favorite ? "text-danger-500 hover:bg-white/10" : "text-navy-200 hover:bg-white/10 hover:text-white",
        )}
      >
        <Heart className="h-4 w-4" fill={favorite ? "currentColor" : "none"} strokeWidth={2.2} />
        {favorite ? "찜함" : "찜하기"}
      </button>
      <button
        type="button"
        onClick={() => toggleCompare(expert.id, expert.name)}
        aria-pressed={comparing}
        className={cx(
          base,
          comparing ? "text-teal-300 hover:bg-white/10" : "text-navy-200 hover:bg-white/10 hover:text-white",
        )}
      >
        <GitCompareArrows className="h-4 w-4" strokeWidth={2.2} />
        {comparing ? "비교중" : "비교에 담기"}
      </button>
      <button
        type="button"
        onClick={share}
        className={cx(base, "text-navy-200 hover:bg-white/10 hover:text-white")}
      >
        <Share2 className="h-4 w-4" strokeWidth={2.2} />
        공유
      </button>
    </div>
  );
}
