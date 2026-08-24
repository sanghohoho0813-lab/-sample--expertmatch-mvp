"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, GitCompareArrows, Heart, MessagesSquare } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { RatingInline } from "@/components/ui/Stars";
import { Icon } from "@/components/ui/Icon";
import { CATEGORY_MAP, METHOD_ICON, METHOD_LABEL } from "@/lib/data/categories";
import { useAppStore } from "@/lib/store/AppStore";
import { cx, formatCount, formatPrice, responseLabel } from "@/lib/format";
import type { Expert } from "@/lib/types";

export function ExpertCard({
  expert,
  layout = "list",
}: {
  expert: Expert;
  layout?: "list" | "grid";
}) {
  const { isFavorite, toggleFavorite, isComparing, toggleCompare, ready } =
    useAppStore();
  const favorite = ready && isFavorite(expert.id);
  const comparing = ready && isComparing(expert.id);

  return (
    <article
      className={cx(
        "group relative flex flex-col rounded-2xl border bg-white p-4 transition-all duration-200 ease-out sm:p-5",
        comparing
          ? "border-teal-500 shadow-[0_0_0_1px_rgba(18,179,168,0.5),0_10px_30px_-16px_rgba(11,26,51,0.3)]"
          : "border-navy-100 shadow-card hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-card-hover",
      )}
    >
      <div className="flex gap-3.5 sm:gap-4">
        <div className="relative">
          <Avatar name={expert.name} accent={expert.accent} size="lg" />
          {expert.availableThisWeek && (
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-teal-500">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Link
                  href={`/experts/${expert.id}`}
                  className="text-[17px] font-bold leading-tight text-navy-900 transition-colors hover:text-teal-700 sm:text-[18px]"
                >
                  {expert.name}
                  <span className="absolute inset-0 z-0" aria-hidden />
                </Link>
                {expert.badge && (
                  <span className="relative z-10 inline-flex items-center gap-1 rounded-md bg-teal-50 px-1.5 py-0.5 text-[11px] font-bold text-teal-700">
                    <CheckCircle2 className="h-3 w-3" strokeWidth={2.6} />
                    {expert.badge}
                  </span>
                )}
              </h3>
              <p className="mt-1 truncate text-[14px] font-medium text-navy-600">
                {expert.title}
              </p>
              <p className="mt-0.5 truncate text-[13px] text-navy-400">
                {expert.affiliation}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleFavorite(expert.id, expert.name)}
              aria-label={favorite ? `${expert.name} 찜 해제` : `${expert.name} 찜하기`}
              aria-pressed={favorite}
              className={cx(
                "relative z-10 -mr-1.5 -mt-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                favorite
                  ? "text-danger-500"
                  : "text-navy-300 hover:bg-navy-50 hover:text-navy-500",
              )}
            >
              <Heart
                className={cx(
                  "h-[21px] w-[21px] transition-transform duration-200",
                  favorite && "scale-110",
                )}
                fill={favorite ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <RatingInline rating={expert.rating} reviewCount={expert.reviewCount} />
            <span className="hidden h-3 w-px bg-navy-100 sm:block" />
            <span className="inline-flex items-center gap-1 text-[13px] text-navy-500">
              <MessagesSquare className="h-3.5 w-3.5 text-navy-300" strokeWidth={2} />
              상담 {formatCount(expert.consultCount)}회
            </span>
            <span className="hidden h-3 w-px bg-navy-100 sm:block" />
            <span className="text-[13px] text-navy-500">
              경력 {expert.yearsOfExperience}년
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3.5 line-clamp-2 text-[14px] leading-relaxed text-navy-600">
        {expert.headline}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {expert.categories.slice(0, 2).map((id) => {
          const cat = CATEGORY_MAP[id];
          return (
            <span
              key={id}
              className="inline-flex items-center gap-1 rounded-lg bg-navy-50 px-2 py-1 text-[12px] font-semibold text-navy-600"
            >
              <Icon name={cat.icon} className="h-3.5 w-3.5 text-teal-600" />
              {cat.name}
            </span>
          );
        })}
        {expert.strengths.slice(0, layout === "grid" ? 1 : 2).map((s) => (
          <span
            key={s}
            className="hidden rounded-lg border border-navy-100 px-2 py-1 text-[12px] text-navy-500 sm:inline-flex"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-dashed border-navy-100 pt-3.5 text-[12.5px] text-navy-500">
        <span className="inline-flex items-center gap-1.5">
          {expert.methods.map((m) => (
            <span key={m} className="inline-flex items-center gap-1">
              <Icon name={METHOD_ICON[m]} className="h-3.5 w-3.5 text-navy-400" />
              <span className="sr-only">{METHOD_LABEL[m]}</span>
            </span>
          ))}
          <span>{expert.methods.map((m) => METHOD_LABEL[m].replace("상담", "")).join("·")}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5 text-navy-300" strokeWidth={2} />
          {responseLabel(expert.responseMinutes)}
        </span>
        {expert.availableThisWeek ? (
          <span className="inline-flex items-center gap-1 font-semibold text-teal-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-70 animate-ring-pulse" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-500" />
            </span>
            이번 주 {expert.openSlots}자리 예약 가능
          </span>
        ) : (
          <span className="text-navy-400">이번 주 예약 마감</span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[12px] text-navy-400">상담료</p>
          <p className="mt-0.5 text-[19px] font-extrabold leading-none tracking-tight text-navy-900">
            {formatPrice(expert.priceFrom)}
            <span className="ml-0.5 text-[13px] font-semibold text-navy-500">원~</span>
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleCompare(expert.id, expert.name)}
            aria-pressed={comparing}
            className={cx(
              "inline-flex h-11 items-center gap-1.5 rounded-xl border px-3 text-[13.5px] font-semibold transition-all duration-200 active:scale-[0.97]",
              comparing
                ? "border-teal-600 bg-teal-600 text-white"
                : "border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50",
            )}
          >
            <GitCompareArrows className="h-4 w-4" strokeWidth={2.2} />
            {comparing ? "비교중" : "비교"}
          </button>
          <Link
            href={`/experts/${expert.id}`}
            className="inline-flex h-11 items-center rounded-xl bg-navy-900 px-4 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-navy-800 active:scale-[0.97]"
          >
            상세보기
          </Link>
        </div>
      </div>
    </article>
  );
}
