"use client";

import { X } from "lucide-react";
import {
  CATEGORY_MAP,
  METHOD_LABEL,
  PRICE_STEPS,
} from "@/lib/data/categories";
import type { CategoryId, ConsultMethod, Filters } from "@/lib/types";

interface Chip {
  key: string;
  label: string;
  clear: () => Filters;
}

/** 적용된 필터를 결과 위에 칩으로 보여 주고, 개별 해제까지 지원한다 */
export function ActiveFilterChips({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
}) {
  const chips: Chip[] = [];

  filters.categories.forEach((id) =>
    chips.push({
      key: `cat-${id}`,
      label: CATEGORY_MAP[id].name,
      clear: () => ({
        ...filters,
        categories: filters.categories.filter((c) => c !== id),
      }),
    }),
  );

  if (filters.priceMax) {
    const step = PRICE_STEPS.find((p) => p.value === filters.priceMax);
    chips.push({
      key: "price",
      label: step ? step.label : `${filters.priceMax}원 이하`,
      clear: () => ({ ...filters, priceMax: null }),
    });
  }

  if (filters.ratingMin) {
    chips.push({
      key: "rating",
      label: `★ ${filters.ratingMin.toFixed(1)} 이상`,
      clear: () => ({ ...filters, ratingMin: null }),
    });
  }

  filters.methods.forEach((m: ConsultMethod) =>
    chips.push({
      key: `method-${m}`,
      label: METHOD_LABEL[m],
      clear: () => ({
        ...filters,
        methods: filters.methods.filter((x) => x !== m),
      }),
    }),
  );

  if (filters.minYears) {
    chips.push({
      key: "years",
      label: `경력 ${filters.minYears}년 이상`,
      clear: () => ({ ...filters, minYears: null }),
    });
  }

  if (filters.availableOnly) {
    chips.push({
      key: "available",
      label: "7일 이내 예약 가능",
      clear: () => ({ ...filters, availableOnly: false }),
    });
  }

  filters.languages.forEach((l) =>
    chips.push({
      key: `lang-${l}`,
      label: l,
      clear: () => ({
        ...filters,
        languages: filters.languages.filter((x) => x !== l),
      }),
    }),
  );

  if (chips.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-[17px] font-semibold text-navy-400">적용된 필터</span>
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onChange(c.clear())}
          aria-label={`${c.label} 필터 해제`}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 pl-3 pr-2 text-[17px] font-semibold text-teal-800 transition-colors duration-200 hover:border-teal-400 hover:bg-teal-100"
        >
          {c.label}
          <X className="h-4 w-4 text-teal-600" strokeWidth={2.6} />
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex min-h-[40px] items-center rounded-xl px-2.5 text-[17px] font-medium text-navy-400 underline-offset-2 transition-colors hover:text-navy-800 hover:underline"
      >
        전체 해제
      </button>
    </div>
  );
}
