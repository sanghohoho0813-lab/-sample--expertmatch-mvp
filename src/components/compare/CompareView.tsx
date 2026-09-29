"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Check, Minus, Star, X } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { CATEGORY_MAP, METHOD_LABEL } from "@/lib/data/categories";
import { earliestSlot, type EarliestSlot } from "@/lib/availability";
import { useAppStore } from "@/lib/store/AppStore";
import { shortestMinutes, useNow } from "@/lib/useAvailability";
import { cx, formatCount, formatPrice, formatSlotLabel } from "@/lib/format";
import type { ConsultMethod, Expert } from "@/lib/types";

interface Ctx {
  earliest: Record<string, EarliestSlot | null | undefined>;
  now: Date | null;
}

interface Row {
  key: string;
  label: string;
  render: (e: Expert, ctx: Ctx) => React.ReactNode;
  /**
   * 객관적으로 우열을 가릴 수 있는 항목만 비교 값을 가진다.
   * 모두 같으면 아무것도 강조하지 않는다.
   */
  score?: (e: Expert, ctx: Ctx) => number | null;
  better?: "high" | "low";
  bestLabel?: string;
}

const METHODS: ConsultMethod[] = ["video", "phone", "chat"];

function slotScore(s: EarliestSlot | null | undefined): number | null {
  if (!s) return null;
  return Number(s.dateKey.replace(/-/g, "")) * 10000 + Number(s.time.replace(":", ""));
}

// 비교 우선순위: 분야 → 경력 → 방식 → 가격 → 예약 가능일 → 평점 → 후기 → 상담 건수
const ROWS: Row[] = [
  {
    key: "categories",
    label: "전문 분야",
    render: (e) => (
      <div className="flex flex-wrap gap-1.5">
        {e.categories.map((c, i) => (
          <span
            key={c}
            className={cx(
              "rounded-md px-2 py-1 text-[19.5px] font-semibold leading-none",
              i === 0 ? "bg-teal-50 text-teal-800" : "bg-navy-50 text-navy-600",
            )}
          >
            {CATEGORY_MAP[c].name}
          </span>
        ))}
      </div>
    ),
  },
  {
    key: "years",
    label: "경력",
    render: (e) => <>{e.yearsOfExperience}년</>,
    score: (e) => e.yearsOfExperience,
    better: "high",
    bestLabel: "가장 김",
  },
  {
    key: "methods",
    label: "상담 방식",
    render: (e) => (
      <div className="flex flex-wrap gap-1.5">
        {METHODS.map((m) => {
          const on = e.methods.includes(m);
          return (
            <span
              key={m}
              className={cx(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[19.5px] leading-none",
                on ? "bg-navy-50 font-semibold text-navy-700" : "text-navy-300",
              )}
            >
              {on ? (
                <Check className="h-3.5 w-3.5 text-teal-600" strokeWidth={3} />
              ) : (
                <Minus className="h-3.5 w-3.5" strokeWidth={3} />
              )}
              {METHOD_LABEL[m].replace("상담", "")}
              <span className="sr-only">{on ? "가능" : "불가"}</span>
            </span>
          );
        })}
      </div>
    ),
  },
  {
    key: "price",
    label: "상담료",
    render: (e) => {
      const lead = e.products.reduce((a, b) => (b.price < a.price ? b : a));
      return (
        <>
          {formatPrice(lead.price)}원
          <span className="ml-1 font-normal text-navy-400">/ {lead.minutes}분</span>
        </>
      );
    },
    score: (e) => e.priceFrom,
    better: "low",
    bestLabel: "가장 낮음",
  },
  {
    key: "earliest",
    label: "가장 빠른 예약",
    render: (e, ctx) => {
      const s = ctx.earliest[e.id];
      if (s === undefined || !ctx.now) return <span className="text-navy-300">확인 중</span>;
      if (s === null) return <span className="text-navy-400">예약 가능 시간 없음</span>;
      return <>{formatSlotLabel(s.dateKey, s.time, ctx.now)}</>;
    },
    score: (e, ctx) => slotScore(ctx.earliest[e.id]),
    better: "low",
    bestLabel: "가장 빠름",
  },
  {
    key: "rating",
    label: "평점",
    render: (e) => (
      <span className="inline-flex items-center gap-1">
        <Star className="h-4 w-4 text-amber-500" fill="currentColor" strokeWidth={0} />
        {e.rating.toFixed(1)}
      </span>
    ),
    score: (e) => e.rating,
    better: "high",
    bestLabel: "가장 높음",
  },
  {
    key: "reviews",
    label: "후기 수",
    render: (e) => <>{formatCount(e.reviewCount)}개</>,
    score: (e) => e.reviewCount,
    better: "high",
    bestLabel: "가장 많음",
  },
  {
    key: "consults",
    label: "상담 건수",
    render: (e) => <>{formatCount(e.consultCount)}회</>,
    score: (e) => e.consultCount,
    better: "high",
    bestLabel: "가장 많음",
  },
];

/** 행별로 가장 좋은 값을 가진 전문가 id 집합 (모두 같으면 빈 집합) */
function bestIds(row: Row, experts: Expert[], ctx: Ctx): Set<string> {
  if (!row.score || experts.length < 2) return new Set();
  const scored = experts
    .map((e) => ({ id: e.id, v: row.score!(e, ctx) }))
    .filter((x): x is { id: string; v: number } => x.v !== null);
  if (scored.length < 2) return new Set();
  const values = scored.map((x) => x.v);
  const target = row.better === "low" ? Math.min(...values) : Math.max(...values);
  if (values.every((v) => v === target)) return new Set();
  return new Set(scored.filter((x) => x.v === target).map((x) => x.id));
}

function Cell({
  row,
  expert,
  ctx,
  best,
}: {
  row: Row;
  expert: Expert;
  ctx: Ctx;
  best: boolean;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={cx(row.score ? "font-semibold text-navy-900" : "text-navy-700")}>
        {row.render(expert, ctx)}
      </span>
      {best && (
        <span className="text-[18.5px] font-semibold text-teal-700">{row.bestLabel}</span>
      )}
    </div>
  );
}

export function CompareView({
  experts,
  onRemove,
  onNavigate,
}: {
  experts: Expert[];
  onRemove: (id: string) => void;
  onNavigate?: () => void;
}) {
  const now = useNow();
  const { bookings, ready } = useAppStore();

  const ctx = useMemo<Ctx>(() => {
    const earliest: Ctx["earliest"] = {};
    if (now && ready) {
      for (const e of experts) {
        earliest[e.id] = earliestSlot(e.id, now, bookings, shortestMinutes(e));
      }
    }
    return { earliest, now: now && ready ? now : null };
  }, [experts, now, ready, bookings]);

  const best = useMemo(
    () => Object.fromEntries(ROWS.map((r) => [r.key, bestIds(r, experts, ctx)])),
    [experts, ctx],
  );

  return (
    <div>
      {/* 데스크톱: 넓은 비교 표 */}
      <div className="scroll-slim hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-[150px] bg-white p-5 align-bottom text-[19.5px] font-semibold text-navy-400">
                <span className="sr-only">비교 항목</span>
              </th>
              {experts.map((e) => (
                <th
                  key={e.id}
                  scope="col"
                  className="border-l border-navy-100 p-5 align-top font-normal"
                >
                  <div className="flex items-start gap-3.5">
                    <Portrait
                      name={e.name}
                      accent={e.accent}
                      photo={e.photo}
                      rounded="rounded-xl"
                      sizes="64px"
                      className="h-16 w-16 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/experts/${e.id}`}
                        onClick={onNavigate}
                        className="block text-[25.5px] font-bold text-navy-900 transition-colors hover:text-teal-700"
                      >
                        {e.name}
                      </Link>
                      <p className="mt-0.5 text-[19.5px] leading-snug text-navy-500">
                        {e.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(e.id)}
                      aria-label={`${e.name} 비교에서 제외`}
                      className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-navy-300 transition-colors hover:bg-navy-50 hover:text-navy-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {/* 특징 한 줄 */}
                  <p className="mt-3.5 rounded-xl bg-canvas px-3.5 py-3 text-[20px] leading-snug text-navy-700">
                    {e.headline}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key} className="border-t border-navy-100">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-white p-5 align-top text-[20.5px] font-semibold text-navy-500"
                >
                  {row.label}
                </th>
                {experts.map((e) => (
                  <td
                    key={e.id}
                    className="border-l border-navy-100 p-5 align-top text-[22px]"
                  >
                    <Cell row={row} expert={e} ctx={ctx} best={best[row.key].has(e.id)} />
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-navy-100">
              <td className="sticky left-0 z-10 bg-white p-5" />
              {experts.map((e) => (
                <td key={e.id} className="border-l border-navy-100 p-5">
                  <Link
                    href={`/booking/${e.id}`}
                    onClick={onNavigate}
                    className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-teal-600 px-4 text-[22px] font-bold text-white transition-colors hover:bg-teal-700"
                  >
                    상담 예약하기
                  </Link>
                  <Link
                    href={`/experts/${e.id}`}
                    onClick={onNavigate}
                    className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl text-[20.5px] font-semibold text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-800"
                  >
                    프로필 보기
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 모바일: 세로 카드 비교 */}
      <div className="space-y-3 p-4 md:hidden">
        {experts.map((e) => (
          <div key={e.id} className="rounded-2xl border border-navy-100 bg-white p-4">
            <div className="flex items-start gap-3">
              <Portrait
                name={e.name}
                accent={e.accent}
                photo={e.photo}
                rounded="rounded-xl"
                sizes="56px"
                className="h-14 w-14 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/experts/${e.id}`}
                  onClick={onNavigate}
                  className="text-[24.5px] font-bold text-navy-900"
                >
                  {e.name}
                </Link>
                <p className="mt-0.5 truncate text-[19.5px] text-navy-500">{e.title}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(e.id)}
                aria-label={`${e.name} 비교에서 제외`}
                className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-navy-300 hover:bg-navy-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 rounded-xl bg-canvas px-3.5 py-3 text-[20px] leading-snug text-navy-700">
              {e.headline}
            </p>

            <dl className="mt-2 divide-y divide-navy-100">
              {ROWS.map((row) => (
                <div key={row.key} className="flex gap-3 py-3">
                  <dt className="w-[92px] shrink-0 pt-0.5 text-[19.5px] font-semibold text-navy-400">
                    {row.label}
                  </dt>
                  <dd className="min-w-0 flex-1 text-[20.5px]">
                    <Cell row={row} expert={e} ctx={ctx} best={best[row.key].has(e.id)} />
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href={`/booking/${e.id}`}
              onClick={onNavigate}
              className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-xl bg-teal-600 text-[22px] font-bold text-white transition-colors hover:bg-teal-700"
            >
              {e.name} 전문가 상담 예약하기
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
