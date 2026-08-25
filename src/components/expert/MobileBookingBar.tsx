"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { Stars } from "@/components/ui/Stars";
import { cx, formatPrice } from "@/lib/format";
import type { Expert } from "@/lib/types";

export function MobileBookingBar({ expert }: { expert: Expert }) {
  const { isFavorite, toggleFavorite, ready } = useAppStore();
  const favorite = ready && isFavorite(expert.id);

  return (
    <div className="fixed inset-x-0 bottom-[56px] z-30 border-t border-navy-100 bg-white/97 px-4 py-3 pb-safe shadow-bar backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => toggleFavorite(expert.id, expert.name)}
          aria-label={favorite ? "찜 해제" : "찜하기"}
          aria-pressed={favorite}
          className={cx(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors",
            favorite
              ? "border-danger-500 bg-danger-50 text-danger-500"
              : "border-navy-200 bg-white text-navy-400",
          )}
        >
          <Heart
            className="h-5 w-5"
            fill={favorite ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Stars value={expert.rating} size={12} />
            <span className="text-[19px] font-semibold text-navy-600">
              {expert.rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-0.5 text-[27.5px] font-extrabold leading-none text-navy-900">
            {formatPrice(expert.priceFrom)}
            <span className="ml-0.5 text-[20.5px] font-semibold text-navy-500">
              원~
            </span>
          </p>
        </div>

        <Link
          href={`/booking/${expert.id}`}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 px-6 text-[25px] font-bold text-white transition-all duration-200 hover:bg-teal-700 active:scale-[0.98]"
        >
          상담 예약하기
        </Link>
      </div>
    </div>
  );
}
