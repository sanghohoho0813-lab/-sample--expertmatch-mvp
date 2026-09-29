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
  { value: null, label: "전체" },
  { value: 4.5, label: "4.5+" },
  { value: 4.8, label: "4.8+" },
  { value: 4.9, label: "4.9+" },
] as const;

const YEARS = [
  { value: null, label: "전체" },
  { value: 5, label: "5년+" },
  { value: 10, label: "10년+" },
  { value: 15, label: "15년+" },
] as const;

/** 처음부터 보여줄 분야 수 — 나머지는 '더보기'로 */
const VISIBLE_CATEGORIES = 6;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-navy-100 py-4 last:border-b-0">
      <h3 className="text-[23px] font-bold text-navy-900">{title}</h3>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function CheckRow({
  checked,
  onToggle,
  label,
  hint,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex min-h-[40px] w-full items-center gap-2.5 rounded-lg px-1 text-left transition-colors duration-150 hover:bg-navy-50"
    >
      <span
        className={cx(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors duration-150",
          checked
            ? "border-teal-600 bg-teal-600 text-white"
            : "border-navy-200 bg-white text-transparent",
        )}
        aria-hidden
      >
        <Check className="h-3 w-3" strokeWidth={3.4} />
      </span>
      <span
        className={cx(
          "min-w-0 flex-1 truncate text-[21.5px]",
          checked ? "font-semibold text-navy-900" : "text-navy-600",
        )}
      >
        {label}
      </span>
      {hint && <span className="shrink-0 text-[18.5px] text-navy-300">{hint}</span>}
    </button>
  );
}

/** 단일 선택 항목은 세로 목록 대신 짧은 세그먼트로 — 사이드바 길이를 줄인다 */
function Segmented<T extends number | null>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-1.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.label}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cx(
              "min-h-[40px] rounded-lg border px-2 text-[19.5px] font-semibold transition-colors duration-150",
              active
                ? "border-teal-600 bg-teal-50 text-teal-800"
                : "border-navy-200 bg-white text-navy-600 hover:border-navy-300",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
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
  const [showAllCats, setShowAllCats] = useState(false);
  const [showDetail, setShowDetail] = useState(filters.languages.length > 0);

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  // 선택된 분야는 접혀 있어도 항상 보이도록 앞으로
  const visibleCats = showAllCats
    ? CATEGORIES
    : CATEGORIES.filter(
        (c, i) => i < VISIBLE_CATEGORIES || filters.categories.includes(c.id),
      );
  const hiddenCount = CATEGORIES.length - visibleCats.length;

  const priceOptions = PRICE_STEPS.map((p) => ({
    value: p.value === 0 ? null : p.value,
    label: p.label.replace("만원 이하", "만원↓"),
  }));

  return (
    <div>
      <div className="flex items-center justify-between border-b border-navy-100 pb-3">
        <h2 className="text-[24.5px] font-bold text-navy-900">필터</h2>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg px-1.5 py-1 text-[19.5px] font-medium text-navy-400 transition-colors hover:text-teal-700"
        >
          초기화
        </button>
      </div>

      {/* 가장 결정적인 조건을 맨 위에 — 한 번에 켜고 끄기 */}
      <div className="border-b border-navy-100 py-4">
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-[22px] font-semibold text-navy-800">
            7일 이내 예약 가능
          </span>
          <span className="relative inline-flex shrink-0">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) => onChange({ ...filters, availableOnly: e.target.checked })}
              className="peer sr-only"
            />
            <span className="h-7 w-12 rounded-full bg-navy-200 transition-colors duration-200 peer-checked:bg-teal-600 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-500 peer-focus-visible:ring-offset-2" />
            <span className="pointer-events-none absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
          </span>
        </label>
      </div>

      <Section title="상담 분야">
        <div className="space-y-0.5">
          {visibleCats.map((c) => (
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
        </div>
        {(hiddenCount > 0 || showAllCats) && (
          <button
            type="button"
            onClick={() => setShowAllCats((v) => !v)}
            aria-expanded={showAllCats}
            className="mt-1.5 inline-flex min-h-[40px] items-center gap-1 px-1 text-[19.5px] font-semibold text-teal-700 hover:text-teal-800"
          >
            {showAllCats ? "접기" : `분야 더보기 (${hiddenCount})`}
            <ChevronDown
              className={cx("h-4 w-4 transition-transform", showAllCats && "rotate-180")}
              strokeWidth={2.4}
            />
          </button>
        )}
      </Section>

      <Section title="상담 방식">
        <div className="space-y-0.5">
          {(["video", "phone", "chat"] as ConsultMethod[]).map((m) => (
            <CheckRow
              key={m}
              label={METHOD_LABEL[m]}
              checked={filters.methods.includes(m)}
              onToggle={() =>
                onChange({ ...filters, methods: toggle<ConsultMethod>(filters.methods, m) })
              }
            />
          ))}
        </div>
      </Section>

      <Section title="상담료">
        <Segmented
          label="상담료"
          options={priceOptions}
          value={filters.priceMax}
          onChange={(v) => onChange({ ...filters, priceMax: v })}
        />
      </Section>

      <Section title="평점">
        <Segmented
          label="평점"
          options={RATINGS}
          value={filters.ratingMin}
          onChange={(v) => onChange({ ...filters, ratingMin: v })}
        />
      </Section>

      <Section title="경력">
        <Segmented
          label="경력"
          options={YEARS}
          value={filters.minYears}
          onChange={(v) => onChange({ ...filters, minYears: v })}
        />
      </Section>

      {/* 자주 쓰지 않는 조건은 접어 둔다 */}
      <div className="pt-3">
        <button
          type="button"
          onClick={() => setShowDetail((v) => !v)}
          aria-expanded={showDetail}
          className="flex min-h-[44px] w-full items-center justify-between rounded-lg px-1 text-[20.5px] font-semibold text-navy-500 hover:text-navy-800"
        >
          상세 필터
          <ChevronDown
            className={cx("h-4 w-4 transition-transform", showDetail && "rotate-180")}
            strokeWidth={2.4}
          />
        </button>
        {showDetail && (
          <div className="mt-1">
            <p className="px-1 text-[19.5px] font-semibold text-navy-400">상담 언어</p>
            <div className="mt-1 space-y-0.5">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
