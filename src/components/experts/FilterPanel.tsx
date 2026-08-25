"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  CATEGORIES,
  LANGUAGES,
  METHOD_LABEL,
  PRICE_STEPS,
} from "@/lib/data/categories";
import { cx } from "@/lib/format";
import type { CategoryId, ConsultMethod, Filters } from "@/lib/types";

const RATINGS = [
  { value: 4.9, label: "4.9 이상" },
  { value: 4.8, label: "4.8 이상" },
  { value: 4.5, label: "4.5 이상" },
];

const YEARS = [
  { value: 5, label: "5년 이상" },
  { value: 10, label: "10년 이상" },
  { value: 15, label: "15년 이상" },
];

function Group({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-navy-100 py-3.5 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 py-1 text-left"
      >
        <span className="text-[23px] font-bold text-navy-900">{title}</span>
        <ChevronDown
          className={cx(
            "h-4 w-4 shrink-0 text-navy-400 transition-transform duration-200",
            open && "rotate-180",
          )}
          strokeWidth={2.4}
        />
      </button>
      {open && <div className="mt-2 space-y-0.5">{children}</div>}
    </div>
  );
}

function CheckRow({
  checked,
  onToggle,
  label,
  hint,
  radio,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  hint?: string;
  radio?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex w-full min-h-[38px] items-center gap-2.5 rounded-lg px-1 text-left transition-colors duration-150 hover:bg-navy-50"
    >
      <span
        className={cx(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center border-[1.5px] transition-all duration-150",
          radio ? "rounded-full" : "rounded-[5px]",
          checked
            ? "border-teal-600 bg-teal-600 text-white"
            : "border-navy-200 bg-white text-transparent",
        )}
        aria-hidden
      >
        {radio ? (
          <span className={cx("h-1.5 w-1.5 rounded-full", checked ? "bg-white" : "bg-transparent")} />
        ) : (
          <Check className="h-3 w-3" strokeWidth={3.4} />
        )}
      </span>
      <span
        className={cx(
          "min-w-0 flex-1 truncate text-[21.5px]",
          checked ? "font-semibold text-navy-900" : "text-navy-600",
        )}
      >
        {label}
      </span>
      {hint && (
        <span className="shrink-0 text-[19px] text-navy-300">{hint}</span>
      )}
    </button>
  );
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
  counts,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
  /** 분야별 전문가 수 */
  counts?: Record<string, number>;
}) {
  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <div>
      <div className="flex items-center justify-between border-b border-navy-100 pb-3">
        <h2 className="text-[24px] font-bold text-navy-900">필터</h2>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg px-1.5 py-1 text-[21px] font-medium text-navy-400 transition-colors hover:text-teal-700"
        >
          초기화
        </button>
      </div>

      <Group title="상담 분야">
        <CheckRow
          label="전체"
          checked={filters.categories.length === 0}
          onToggle={() => onChange({ ...filters, categories: [] })}
        />
        {CATEGORIES.map((c) => (
          <CheckRow
            key={c.id}
            label={c.name}
            hint={counts ? `${counts[c.id] ?? 0}` : undefined}
            checked={filters.categories.includes(c.id)}
            onToggle={() =>
              onChange({
                ...filters,
                categories: toggle<CategoryId>(filters.categories, c.id),
              })
            }
          />
        ))}
      </Group>

      <Group title="상담 방식">
        <CheckRow
          label="전체"
          checked={filters.methods.length === 0}
          onToggle={() => onChange({ ...filters, methods: [] })}
        />
        {(["video", "phone", "chat"] as ConsultMethod[]).map((m) => (
          <CheckRow
            key={m}
            label={METHOD_LABEL[m]}
            checked={filters.methods.includes(m)}
            onToggle={() =>
              onChange({
                ...filters,
                methods: toggle<ConsultMethod>(filters.methods, m),
              })
            }
          />
        ))}
      </Group>

      <Group title="상담가격">
        {PRICE_STEPS.map((p) => (
          <CheckRow
            key={p.label}
            radio
            label={p.label}
            checked={
              p.value === 0 ? filters.priceMax === null : filters.priceMax === p.value
            }
            onToggle={() =>
              onChange({ ...filters, priceMax: p.value === 0 ? null : p.value })
            }
          />
        ))}
      </Group>

      <Group title="평점">
        <CheckRow
          radio
          label="전체"
          checked={filters.ratingMin === null}
          onToggle={() => onChange({ ...filters, ratingMin: null })}
        />
        {RATINGS.map((r) => (
          <CheckRow
            key={r.value}
            radio
            label={`★ ${r.label}`}
            checked={filters.ratingMin === r.value}
            onToggle={() => onChange({ ...filters, ratingMin: r.value })}
          />
        ))}
      </Group>

      <Group title="경력">
        <CheckRow
          radio
          label="전체"
          checked={filters.minYears === null}
          onToggle={() => onChange({ ...filters, minYears: null })}
        />
        {YEARS.map((y) => (
          <CheckRow
            key={y.value}
            radio
            label={y.label}
            checked={filters.minYears === y.value}
            onToggle={() => onChange({ ...filters, minYears: y.value })}
          />
        ))}
      </Group>

      <Group title="상담 가능 시간">
        <label className="mt-1 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-navy-200 bg-white px-3 py-2.5 transition-colors hover:border-navy-300">
          <span className="text-[21.5px] font-medium text-navy-700">
            이번 주 예약 가능만
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

      <Group title="언어" defaultOpen={false}>
        {LANGUAGES.map((l) => (
          <CheckRow
            key={l}
            label={l}
            checked={filters.languages.includes(l)}
            onToggle={() =>
              onChange({ ...filters, languages: toggle<string>(filters.languages, l) })
            }
          />
        ))}
      </Group>
    </div>
  );
}
