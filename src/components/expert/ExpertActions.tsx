"use client";

import { GitCompareArrows, Heart, Share2 } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { cx } from "@/lib/format";
import type { Expert } from "@/lib/types";

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

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => toggleFavorite(expert.id, expert.name)}
        aria-pressed={favorite}
        className={cx(
          "inline-flex h-11 items-center gap-1.5 rounded-xl border px-3.5 text-[14px] font-semibold transition-all duration-200 active:scale-[0.97]",
          favorite
            ? "border-danger-500 bg-danger-50 text-danger-600"
            : "border-white/25 text-white hover:bg-white/10",
        )}
      >
        <Heart
          className="h-4 w-4"
          fill={favorite ? "currentColor" : "none"}
          strokeWidth={2.2}
        />
        {favorite ? "찜함" : "찜하기"}
      </button>

      <button
        type="button"
        onClick={() => toggleCompare(expert.id, expert.name)}
        aria-pressed={comparing}
        className={cx(
          "inline-flex h-11 items-center gap-1.5 rounded-xl border px-3.5 text-[14px] font-semibold transition-all duration-200 active:scale-[0.97]",
          comparing
            ? "border-teal-400 bg-teal-500 text-navy-950"
            : "border-white/25 text-white hover:bg-white/10",
        )}
      >
        <GitCompareArrows className="h-4 w-4" strokeWidth={2.2} />
        {comparing ? "비교중" : "비교하기"}
      </button>

      <button
        type="button"
        onClick={share}
        aria-label="전문가 프로필 공유"
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.97]"
      >
        <Share2 className="h-4 w-4" strokeWidth={2.2} />
      </button>
    </div>
  );
}
