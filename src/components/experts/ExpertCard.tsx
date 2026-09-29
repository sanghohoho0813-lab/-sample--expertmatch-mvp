"use client";

import Link from "next/link";
import { Check, CheckCircle2, GitCompareArrows, Heart, Star } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Icon } from "@/components/ui/Icon";
import { CATEGORY_MAP } from "@/lib/data/categories";
import { useAppStore } from "@/lib/store/AppStore";
import { useExpertAvailability } from "@/lib/useAvailability";
import { cx, formatCount, formatPrice, formatSlotLabel } from "@/lib/format";
import type { Expert } from "@/lib/types";

function Rating({ expert }: { expert: Expert }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-[22px]">
      <Star className="h-4 w-4 text-amber-500" fill="currentColor" strokeWidth={0} />
      <span className="font-bold text-navy-900">{expert.rating.toFixed(1)}</span>
      <span className="text-navy-400">({formatCount(expert.reviewCount)})</span>
    </span>
  );
}

/** 가장 빠른 예약 가능 시간 — 저장된 예약까지 반영한 실제 값 */
function EarliestLine({ expert }: { expert: Expert }) {
  const avail = useExpertAvailability(expert);

  if (!avail) {
    return (
      <p className="flex items-center gap-2 text-[20.5px] text-navy-300" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-navy-100" />
        예약 가능 시간 확인 중
      </p>
    );
  }
  if (!avail.earliest) {
    return <p className="text-[20.5px] text-navy-400">예약 가능한 시간이 없어요</p>;
  }

  const label = formatSlotLabel(avail.earliest.dateKey, avail.earliest.time, avail.now);
  const soon = label.startsWith("오늘") || label.startsWith("내일");
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[20.5px]">
      <span className="inline-flex items-center gap-1.5 text-navy-400">
        <span
          className={cx("h-2 w-2 rounded-full", soon ? "bg-teal-500" : "bg-navy-200")}
          aria-hidden
        />
        가장 빠른 예약
      </span>
      <span className={cx("font-bold", soon ? "text-teal-700" : "text-navy-800")}>
        {label}
      </span>
    </p>
  );
}

export function ExpertCard({
  expert,
  reasons = [],
}: {
  expert: Expert;
  /** 검색 조건과 일치하는 근거 (matchReasons) */
  reasons?: string[];
}) {
  const { isFavorite, toggleFavorite, isComparing, toggleCompare, ready } =
    useAppStore();
  const favorite = ready && isFavorite(expert.id);
  const comparing = ready && isComparing(expert.id);

  // 필터·정렬 기준(priceFrom)과 어긋나지 않도록 최저가 상품을 노출한다
  const lead = expert.products.reduce((a, b) => (b.price < a.price ? b : a));
  const primary = CATEGORY_MAP[expert.categories[0]];

  return (
    <article
      className={cx(
        "group relative grid grid-cols-[88px_minmax(0,1fr)] items-start gap-x-3.5 gap-y-3.5 rounded-2xl border bg-white p-4 transition-all duration-200 ease-out sm:flex sm:flex-col sm:items-stretch sm:gap-0 sm:p-0",
        comparing
          ? "border-teal-600 shadow-[0_0_0_1px_#0E7C86]"
          : "border-navy-100 shadow-card hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-card-hover",
      )}
    >
      {/* 프로필 사진 — 정사각 프레임으로 원본 상반신이 잘리지 않게 */}
      <div className="relative col-start-1 row-start-1 sm:w-full">
        <Portrait
          name={expert.name}
          accent={expert.accent}
          photo={expert.photo}
          rounded="rounded-xl sm:rounded-none sm:rounded-t-2xl"
          sizes="(max-width: 640px) 88px, (max-width: 1280px) 50vw, 400px"
          className="aspect-square w-full"
        />
        {comparing && (
          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-lg bg-teal-600 px-1.5 py-1 text-[17px] font-bold text-white sm:left-3 sm:top-3">
            <Check className="h-3 w-3" strokeWidth={3.2} />
            비교중
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleFavorite(expert.id, expert.name)}
          aria-label={favorite ? `${expert.name} 찜 해제` : `${expert.name} 찜하기`}
          aria-pressed={favorite}
          className={cx(
            "absolute right-1 top-1 z-20 hidden h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200 sm:right-3 sm:top-3 sm:flex",
            favorite
              ? "bg-white text-danger-500 shadow-sm"
              : "bg-white/85 text-navy-400 hover:bg-white hover:text-navy-700",
          )}
        >
          <Heart
            className="h-[18px] w-[18px]"
            fill={favorite ? "currentColor" : "none"}
            strokeWidth={2.1}
          />
        </button>
      </div>

      {/* 1. 이름 · 직함 */}
      <div className="col-start-2 row-start-1 min-w-0 sm:px-5 sm:pt-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-[27px] font-bold leading-tight text-navy-900 sm:text-[29.5px]">
            <Link
              href={`/experts/${expert.id}`}
              className="transition-colors hover:text-teal-700"
            >
              {expert.name}
              <span className="ml-1 text-[19.5px] font-semibold text-navy-400">
                전문가
              </span>
              <span className="absolute inset-0 z-0" aria-hidden />
            </Link>
          </h3>
          <span className="hidden sm:inline-flex">
            <Rating expert={expert} />
          </span>
        </div>
        <p className="mt-1 truncate text-[22px] text-navy-500">{expert.title}</p>
        <span className="mt-1.5 inline-flex sm:hidden">
          <Rating expert={expert} />
        </span>
      </div>

      {/* 2~8. 판단에 필요한 순서대로 */}
      <div className="col-span-2 min-w-0 sm:flex sm:flex-1 sm:flex-col sm:px-5 sm:pb-5 sm:pt-3">
        {/* 핵심 분야 + 신뢰 요소 */}
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[20.5px] text-navy-500">
          <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-1 text-[19.5px] font-semibold leading-none text-teal-800">
            <Icon name={primary.icon} className="h-3.5 w-3.5" />
            {primary.name}
          </span>
          <span>경력 {expert.yearsOfExperience}년</span>
          <span className="text-navy-200" aria-hidden>
            ·
          </span>
          <span>상담 {formatCount(expert.consultCount)}회</span>
        </div>

        {/* 어떤 문제를 잘 해결하는지 */}
        <p className="mt-2.5 line-clamp-2 text-[22px] leading-snug text-navy-700">
          {expert.headline}
        </p>

        {/* 검색 조건과 일치하는 근거 */}
        {reasons.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1.5" aria-label="조건 일치 이유">
            {reasons.map((r, i) => (
              <li
                key={r}
                className={cx(
                  "flex items-center gap-1.5 text-[20px] font-semibold text-teal-800",
                  i > 0 && "hidden sm:flex",
                )}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.4} />
                <span className="truncate">{r}</span>
              </li>
            ))}
          </ul>
        )}

        {/* 가격 · 가장 빠른 예약 · CTA */}
        <div className="mt-4 border-t border-navy-100 pt-4 sm:mt-auto">
          <p className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-[20.5px] text-navy-400">상담</span>
            <span className="text-[31.5px] font-extrabold tracking-tight text-navy-900">
              {formatPrice(lead.price)}
              <span className="ml-0.5 text-[20.5px] font-bold text-navy-600">원</span>
            </span>
            <span className="text-[20.5px] text-navy-400">/ {lead.minutes}분</span>
          </p>
          <div className="mt-1.5">
            <EarliestLine expert={expert} />
          </div>

          <div className="relative z-10 mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleCompare(expert.id, expert.name)}
              aria-pressed={comparing}
              aria-label={comparing ? `${expert.name} 비교 해제` : `${expert.name} 비교하기`}
              className={cx(
                "inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3.5 text-[20.5px] font-semibold transition-colors duration-200",
                comparing
                  ? "border-teal-600 bg-teal-50 text-teal-800"
                  : "border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50",
              )}
            >
              <GitCompareArrows className="h-4 w-4" strokeWidth={2.2} />
              비교
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(expert.id, expert.name)}
              aria-label={favorite ? `${expert.name} 찜 해제` : `${expert.name} 찜하기`}
              aria-pressed={favorite}
              className={cx(
                "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200 sm:hidden",
                favorite
                  ? "border-danger-500/40 bg-danger-50 text-danger-500"
                  : "border-navy-200 bg-white text-navy-400",
              )}
            >
              <Heart
                className="h-[18px] w-[18px]"
                fill={favorite ? "currentColor" : "none"}
                strokeWidth={2.1}
              />
            </button>
            <Link
              href={`/experts/${expert.id}`}
              className="inline-flex h-12 min-w-0 flex-1 items-center justify-center rounded-xl bg-navy-900 px-4 text-[22px] font-bold text-white transition-colors duration-200 hover:bg-navy-800"
            >
              상세보기
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
