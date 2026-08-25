"use client";

import Link from "next/link";
import { CornerDownLeft, Search, Star } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Icon } from "@/components/ui/Icon";
import { cx, formatPrice } from "@/lib/format";
import type { Suggestions } from "@/lib/suggest";

export interface SuggestItem {
  kind: "keyword" | "category" | "expert";
  id: string;
  label: string;
}

/** 자동완성 항목을 키보드 탐색용 평면 목록으로 만든다 */
export function flattenSuggestions(s: Suggestions): SuggestItem[] {
  return [
    ...s.keywords.map((k) => ({ kind: "keyword" as const, id: k, label: k })),
    ...s.categories.map((c) => ({
      kind: "category" as const,
      id: c.id,
      label: c.name,
    })),
    ...s.experts.map((e) => ({
      kind: "expert" as const,
      id: e.id,
      label: e.name,
    })),
  ];
}

export function SearchSuggest({
  suggestions,
  activeIndex,
  onPick,
  tone = "light",
}: {
  suggestions: Suggestions;
  activeIndex: number;
  onPick: (item: SuggestItem) => void;
  tone?: "light" | "dark";
}) {
  const flat = flattenSuggestions(suggestions);
  const indexOf = (kind: SuggestItem["kind"], id: string) =>
    flat.findIndex((f) => f.kind === kind && f.id === id);

  const rowClass = (i: number) =>
    cx(
      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150",
      i === activeIndex ? "bg-teal-50" : "hover:bg-navy-50",
    );

  return (
    <div
      id="search-suggest"
      role="listbox"
      aria-label="검색 추천"
      className={cx(
        "absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-pop",
        tone === "dark" && "border-white/15",
      )}
    >
      {suggestions.keywords.length > 0 && (
        <div className="border-b border-navy-100 py-1.5">
          <p className="px-4 py-1.5 text-[15px] font-bold text-navy-400">추천 검색어</p>
          {suggestions.keywords.map((k) => {
            const i = indexOf("keyword", k);
            return (
              <button
                key={k}
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onPick(flat[i])}
                className={rowClass(i)}
              >
                <Search className="h-[18px] w-[18px] shrink-0 text-navy-300" strokeWidth={2.2} />
                <span className="min-w-0 flex-1 truncate text-[19px] text-navy-800">
                  {k}
                </span>
                {i === activeIndex && (
                  <CornerDownLeft className="h-4 w-4 shrink-0 text-navy-300" strokeWidth={2.2} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {suggestions.categories.length > 0 && (
        <div className="border-b border-navy-100 py-1.5">
          <p className="px-4 py-1.5 text-[15px] font-bold text-navy-400">상담 분야</p>
          {suggestions.categories.map((c) => {
            const i = indexOf("category", c.id);
            return (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onPick(flat[i])}
                className={rowClass(i)}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                  <Icon name={c.icon} className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[19px] font-semibold text-navy-900">
                    {c.name}
                  </span>
                  <span className="block truncate text-[16px] text-navy-400">
                    {c.tagline}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {suggestions.experts.length > 0 && (
        <div className="py-1.5">
          <p className="px-4 py-1.5 text-[15px] font-bold text-navy-400">전문가</p>
          {suggestions.experts.map((e) => {
            const i = indexOf("expert", e.id);
            const lead = e.products.reduce((a, b) => (b.price < a.price ? b : a));
            return (
              <button
                key={e.id}
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(ev) => ev.preventDefault()}
                onClick={() => onPick(flat[i])}
                className={rowClass(i)}
              >
                <Portrait
                  name={e.name}
                  accent={e.accent}
                  photo={e.photo}
                  rounded="rounded-lg"
                  sizes="40px"
                  className="h-10 w-10 shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[19px] font-semibold text-navy-900">
                    {e.name}
                    <span className="ml-1.5 text-[16px] font-normal text-navy-400">
                      {e.title}
                    </span>
                  </span>
                  <span className="mt-0.5 flex items-center gap-2 text-[16px] text-navy-500">
                    <span className="inline-flex items-center gap-0.5 font-semibold text-navy-700">
                      <Star className="h-3.5 w-3.5 text-amber-500" fill="currentColor" strokeWidth={0} />
                      {e.rating.toFixed(1)}
                    </span>
                    <span className="text-navy-200">·</span>
                    {formatPrice(lead.price)}원 / {lead.minutes}분
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <Link
        href="/experts"
        onMouseDown={(e) => e.preventDefault()}
        className="block border-t border-navy-100 bg-navy-50/60 px-4 py-3 text-center text-[17px] font-semibold text-navy-500 transition-colors hover:bg-navy-100 hover:text-navy-800"
      >
        전체 전문가 둘러보기
      </Link>
    </div>
  );
}
