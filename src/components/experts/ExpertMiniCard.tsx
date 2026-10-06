"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { useExpertAvailability } from "@/lib/useAvailability";
import { cx, formatCount, formatPrice, formatSlotLabel } from "@/lib/format";
import type { Expert } from "@/lib/types";

/**
 * 홈 '추천 전문가'용 사진 중심 카드.
 * 둘러보기 단계에서는 얼굴·분야·가격·가장 빠른 시간만 보여주고,
 * 비교·찜 같은 결정 도구는 검색 결과 카드(ExpertCard)에 둔다.
 */
export function ExpertMiniCard({ expert, className }: { expert: Expert; className?: string }) {
  const avail = useExpertAvailability(expert);
  const lead = expert.products.reduce((a, b) => (b.price < a.price ? b : a));
  const label = avail?.earliest
    ? formatSlotLabel(avail.earliest.dateKey, avail.earliest.time, avail.now)
    : null;

  return (
    <Link
      href={`/experts/${expert.id}`}
      className={cx(
        "group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card transition-[border-color,box-shadow] duration-200 hover:border-navy-200 hover:shadow-card-hover",
        className,
      )}
    >
      <Portrait
        name={expert.name}
        accent={expert.accent}
        photo={expert.photo}
        rounded="rounded-none"
        sizes="(min-width: 1024px) 300px, 280px"
        className="aspect-square w-full"
      />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[25px] font-bold leading-tight text-navy-900">
          {expert.name}
          <span className="ml-1 text-[18.5px] font-semibold text-navy-400">전문가</span>
        </p>
        <p className="mt-1 truncate text-[19.5px] text-navy-500">{expert.title}</p>
        <p className="mt-1.5 inline-flex items-center gap-1 text-[19.5px]">
          <Star className="h-4 w-4 text-amber-500" fill="currentColor" strokeWidth={0} />
          <span className="font-bold text-navy-900">{expert.rating.toFixed(1)}</span>
          <span className="text-navy-400">후기 {formatCount(expert.reviewCount)}</span>
        </p>
        <div className="mt-auto pt-3">
          <p className="text-[22px] font-extrabold text-navy-900">
            {formatPrice(lead.price)}
            <span className="text-[18px] font-semibold text-navy-500">원~</span>
          </p>
          <p
            className={cx(
              "mt-0.5 text-[18.5px] font-semibold",
              label ? "text-teal-700" : "text-navy-300",
            )}
          >
            {!avail ? "예약 가능 시간 확인 중" : label ? `${label} 가능` : "이번 주 예약 마감"}
          </p>
        </div>
      </div>
    </Link>
  );
}
