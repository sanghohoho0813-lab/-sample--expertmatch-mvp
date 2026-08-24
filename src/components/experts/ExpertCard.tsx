"use client";

import Link from "next/link";
import { Check, GitCompareArrows, Heart, Star } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Icon } from "@/components/ui/Icon";
import { CATEGORY_MAP, METHOD_ICON, METHOD_LABEL } from "@/lib/data/categories";
import { WEEK_LABELS, weekdayAvailability } from "@/lib/availability";
import { useAppStore } from "@/lib/store/AppStore";
import { cx, formatCount, formatPrice } from "@/lib/format";
import type { Expert } from "@/lib/types";

function WeekStrip({ expert }: { expert: Expert }) {
  const days = weekdayAvailability(expert.id, expert.availableThisWeek);
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {WEEK_LABELS.map((label, i) => (
        <span
          key={label}
          className={cx(
            "flex h-[21px] w-[21px] items-center justify-center rounded-full text-[11px] font-bold",
            days[i] ? "bg-teal-600 text-white" : "bg-navy-50 text-navy-300",
          )}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export function ExpertCard({ expert }: { expert: Expert }) {
  const { isFavorite, toggleFavorite, isComparing, toggleCompare, ready } =
    useAppStore();
  const favorite = ready && isFavorite(expert.id);
  const comparing = ready && isComparing(expert.id);

  // 필터·정렬 기준(priceFrom)과 어긋나지 않도록 최저가 상품을 노출한다
  const lead = expert.products.reduce((a, b) => (b.price < a.price ? b : a));

  return (
    <article
      className={cx(
        "group relative grid grid-cols-[96px_minmax(0,1fr)] items-start gap-x-3.5 gap-y-3 rounded-2xl border bg-white p-3.5 transition-all duration-200 ease-out sm:grid-cols-1 sm:gap-y-0 sm:p-0",
        comparing
          ? "border-teal-600 shadow-[0_0_0_1px_#0E7C86,0_12px_30px_-18px_rgba(22,41,75,0.35)]"
          : "border-navy-100 shadow-card hover:-translate-y-1 hover:border-navy-200 hover:shadow-card-hover",
      )}
    >
      {/* 프로필 이미지 */}
      <div className="relative col-start-1 row-start-1 sm:col-auto sm:row-auto">
        <Portrait
          name={expert.name}
          accent={expert.accent}
          rounded="rounded-xl sm:rounded-none sm:rounded-t-2xl"
          className="aspect-square w-full sm:aspect-[3/2]"
        />
        {comparing && (
          <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-lg bg-teal-600 px-1.5 py-1 text-[11px] font-bold text-white shadow-sm sm:left-2.5 sm:top-2.5">
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
            "absolute right-1 top-1 z-20 flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-sm transition-all duration-200 sm:right-2.5 sm:top-2.5 sm:h-10 sm:w-10",
            favorite
              ? "bg-white text-danger-500 shadow-sm"
              : "bg-white/75 text-navy-400 hover:bg-white hover:text-navy-700",
          )}
        >
          <Heart
            className={cx(
              "h-[18px] w-[18px] transition-transform duration-200",
              favorite && "scale-110",
            )}
            fill={favorite ? "currentColor" : "none"}
            strokeWidth={2.1}
          />
        </button>
      </div>

      {/* 이름 · 직함 · 태그 */}
      <div className="col-start-2 row-start-1 min-w-0 sm:col-auto sm:row-auto sm:px-4 sm:pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 text-[16px] font-bold leading-tight text-navy-900 sm:text-[17px]">
            <Link
              href={`/experts/${expert.id}`}
              className="transition-colors hover:text-teal-700"
            >
              {expert.name}
              <span className="ml-1 text-[13px] font-semibold text-navy-400">
                전문가
              </span>
              <span className="absolute inset-0 z-0" aria-hidden />
            </Link>
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 text-[13px]">
            <Star
              className="h-3.5 w-3.5 text-amber-500"
              fill="currentColor"
              strokeWidth={0}
            />
            <span className="font-bold text-navy-900">{expert.rating.toFixed(1)}</span>
            <span className="text-navy-400">({formatCount(expert.reviewCount)})</span>
          </span>
        </div>

        <p className="mt-1 truncate text-[13.5px] text-navy-500">{expert.title}</p>

        <div className="mt-2 flex h-[22px] items-center gap-1.5 overflow-hidden">
          {expert.categories.slice(0, 1).map((id) => (
            <span
              key={id}
              className="inline-flex shrink-0 items-center gap-1 rounded-md bg-teal-50 px-1.5 py-1 text-[11.5px] font-semibold leading-none text-teal-800"
            >
              <Icon name={CATEGORY_MAP[id].icon} className="h-3 w-3" />
              {CATEGORY_MAP[id].name}
            </span>
          ))}
          {expert.skills.slice(0, 2).map((skill, i) => (
            <span
              key={skill}
              className={cx(
                "shrink-0 whitespace-nowrap rounded-md bg-navy-50 px-1.5 py-1 text-[11.5px] font-medium leading-none text-navy-500",
                // 좁은 화면에서 잘려 보이지 않도록 두 번째 태그는 sm 이상에서만 노출
                i === 1 && "hidden sm:inline-flex",
              )}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 가격 · 예약가능 · 액션 */}
      <div className="col-span-2 row-start-2 min-w-0 sm:col-auto sm:row-auto sm:px-4 sm:pb-4 sm:pt-3">
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-[12.5px] text-navy-400">상담</span>
          <span className="text-[18px] font-extrabold tracking-tight text-navy-900">
            {formatPrice(lead.price)}
            <span className="ml-0.5 text-[12.5px] font-bold text-navy-600">원</span>
          </span>
          <span className="text-[12.5px] font-medium text-navy-400">
            / {lead.minutes}분
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-2">
          {expert.availableThisWeek ? (
            <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-teal-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-70 animate-ring-pulse" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-600" />
              </span>
              이번 주 가능
            </span>
          ) : (
            <span className="text-[12.5px] font-medium text-navy-400">
              다음 주부터 가능
            </span>
          )}
          <WeekStrip expert={expert} />
        </div>

        <div className="mt-2.5 flex items-center gap-2 truncate text-[12px] text-navy-400">
          {expert.methods.map((m) => (
            <span key={m} className="inline-flex shrink-0 items-center">
              <Icon name={METHOD_ICON[m]} className="h-3.5 w-3.5" />
              <span className="sr-only">{METHOD_LABEL[m]}</span>
            </span>
          ))}
          <span className="text-navy-200">|</span>
          <span className="shrink-0">경력 {expert.yearsOfExperience}년</span>
          <span className="text-navy-200">|</span>
          <span className="truncate">상담 {formatCount(expert.consultCount)}회</span>
        </div>

        <div className="relative z-10 mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleCompare(expert.id, expert.name)}
            aria-pressed={comparing}
            aria-label={comparing ? `${expert.name} 비교 해제` : `${expert.name} 비교하기`}
            className={cx(
              "inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 text-[13.5px] font-semibold transition-all duration-200 active:scale-[0.97]",
              comparing
                ? "border-teal-600 bg-teal-600 text-white"
                : "border-navy-200 bg-white text-navy-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800",
            )}
          >
            <GitCompareArrows className="h-4 w-4" strokeWidth={2.2} />
            비교
          </button>
          <Link
            href={`/experts/${expert.id}`}
            className="inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-xl border border-navy-200 bg-white text-[14px] font-bold text-navy-800 transition-all duration-200 hover:border-navy-900 hover:bg-navy-900 hover:text-white active:scale-[0.98]"
          >
            상세보기
          </Link>
        </div>
      </div>
    </article>
  );
}
