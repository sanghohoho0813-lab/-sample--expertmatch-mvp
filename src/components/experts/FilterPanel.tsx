"use client";

import { RotateCcw } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import {
  CATEGORIES,
  LANGUAGES,
  METHOD_ICON,
  METHOD_LABEL,
  PRICE_STEPS,
} from "@/lib/data/categories";
import { cx } from "@/lib/format";
import type { CategoryId, ConsultMethod, Filters } from "@/lib/types";

const RATINGS = [4.9, 4.8, 4.5];
const YEARS = [5, 10, 15];

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-navy-100 py-5 first:border-t-0 first:pt-0">
      <h3 className="text-[14px] font-bold text-navy-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 text-[13.5px] font-medium transition-all duration-200 active:scale-[0.97]",
        active
          ? "border-teal-600 bg-teal-50 text-teal-800"
          : "border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50",
      )}
    >
      {children}
    </button>
  );
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
}) {
  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <div>
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-[15px] font-bold text-navy-900">필터</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[13px] font-medium text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-700"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.2} />
          초기화
        </button>
      </div>

      <Group title="전문분야">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Pill
              key={c.id}
              active={filters.categories.includes(c.id)}
              onClick={() =>
                onChange({
                  ...filters,
                  categories: toggle<CategoryId>(filters.categories, c.id),
                })
              }
            >
              <Icon
                name={c.icon}
                className={cx(
                  "h-3.5 w-3.5",
                  filters.categories.includes(c.id) ? "text-teal-600" : "text-navy-300",
                )}
              />
              {c.name}
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="상담가격">
        <div className="flex flex-wrap gap-2">
          {PRICE_STEPS.map((p) => (
            <Pill
              key={p.label}
              active={(filters.priceMax ?? 0) === p.value}
              onClick={() =>
                onChange({ ...filters, priceMax: p.value === 0 ? null : p.value })
              }
            >
              {p.label}
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="평점">
        <div className="flex flex-wrap gap-2">
          {RATINGS.map((r) => (
            <Pill
              key={r}
              active={filters.ratingMin === r}
              onClick={() =>
                onChange({ ...filters, ratingMin: filters.ratingMin === r ? null : r })
              }
            >
              ★ {r.toFixed(1)} 이상
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="상담방식">
        <div className="flex flex-wrap gap-2">
          {(["video", "phone", "chat"] as ConsultMethod[]).map((m) => (
            <Pill
              key={m}
              active={filters.methods.includes(m)}
              onClick={() =>
                onChange({ ...filters, methods: toggle<ConsultMethod>(filters.methods, m) })
              }
            >
              <Icon
                name={METHOD_ICON[m]}
                className={cx(
                  "h-3.5 w-3.5",
                  filters.methods.includes(m) ? "text-teal-600" : "text-navy-300",
                )}
              />
              {METHOD_LABEL[m]}
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="경력">
        <div className="flex flex-wrap gap-2">
          {YEARS.map((y) => (
            <Pill
              key={y}
              active={filters.minYears === y}
              onClick={() =>
                onChange({ ...filters, minYears: filters.minYears === y ? null : y })
              }
            >
              {y}년 이상
            </Pill>
          ))}
        </div>
      </Group>

      <Group title="예약 가능">
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-navy-200 bg-white px-3.5 py-3 transition-colors hover:border-navy-300">
          <span className="text-[14px] font-medium text-navy-700">
            이번 주 예약 가능한 전문가만
          </span>
          <span className="relative inline-flex shrink-0">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) =>
                onChange({ ...filters, availableOnly: e.target.checked })
              }
              className="peer sr-only"
            />
            <span className="h-6 w-11 rounded-full bg-navy-200 transition-colors duration-200 peer-checked:bg-teal-600" />
            <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
          </span>
        </label>
      </Group>

      <Group title="언어">
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <Pill
              key={l}
              active={filters.languages.includes(l)}
              onClick={() =>
                onChange({ ...filters, languages: toggle<string>(filters.languages, l) })
              }
            >
              {l}
            </Pill>
          ))}
        </div>
      </Group>
    </div>
  );
}
