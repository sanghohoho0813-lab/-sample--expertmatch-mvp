"use client";

import Link from "next/link";
import { Check, Minus, X } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Stars } from "@/components/ui/Stars";
import { CATEGORY_MAP, METHOD_LABEL } from "@/lib/data/categories";
import { formatCount, formatPrice } from "@/lib/format";
import type { Expert } from "@/lib/types";

interface Row {
  key: string;
  label: string;
  render: (e: Expert) => React.ReactNode;
  /** 값이 가장 좋은 전문가를 강조 */
  best?: (list: Expert[]) => string | null;
}

const ROWS: Row[] = [
  {
    key: "categories",
    label: "전문 분야",
    render: (e) => (
      <div className="flex flex-wrap gap-1">
        {e.categories.map((c) => (
          <span
            key={c}
            className="rounded-md bg-navy-50 px-1.5 py-0.5 text-[12px] font-semibold text-navy-600"
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
    render: (e) => <span className="font-semibold">{e.yearsOfExperience}년</span>,
    best: (list) =>
      list.reduce((a, b) => (b.yearsOfExperience > a.yearsOfExperience ? b : a)).id,
  },
  {
    key: "rating",
    label: "평점",
    render: (e) => (
      <span className="inline-flex items-center gap-1.5">
        <Stars value={e.rating} size={13} />
        <span className="font-semibold">{e.rating.toFixed(1)}</span>
      </span>
    ),
    best: (list) => list.reduce((a, b) => (b.rating > a.rating ? b : a)).id,
  },
  {
    key: "reviews",
    label: "리뷰",
    render: (e) => <span>{formatCount(e.reviewCount)}개</span>,
    best: (list) => list.reduce((a, b) => (b.reviewCount > a.reviewCount ? b : a)).id,
  },
  {
    key: "consults",
    label: "상담 건수",
    render: (e) => <span>{formatCount(e.consultCount)}회</span>,
    best: (list) => list.reduce((a, b) => (b.consultCount > a.consultCount ? b : a)).id,
  },
  {
    key: "price",
    label: "상담료",
    render: (e) => (
      <span className="font-extrabold text-navy-900">
        {formatPrice(e.priceFrom)}원~
      </span>
    ),
    best: (list) => list.reduce((a, b) => (b.priceFrom < a.priceFrom ? b : a)).id,
  },
  {
    key: "methods",
    label: "상담 방식",
    render: (e) => (
      <div className="flex flex-wrap gap-1">
        {(["video", "phone", "chat"] as const).map((m) => {
          const on = e.methods.includes(m);
          return (
            <span
              key={m}
              className={
                on
                  ? "inline-flex items-center gap-0.5 rounded-md bg-teal-50 px-1.5 py-0.5 text-[12px] font-semibold text-teal-700"
                  : "inline-flex items-center gap-0.5 rounded-md bg-navy-50 px-1.5 py-0.5 text-[12px] text-navy-300"
              }
            >
              {on ? (
                <Check className="h-3 w-3" strokeWidth={3} />
              ) : (
                <Minus className="h-3 w-3" strokeWidth={3} />
              )}
              {METHOD_LABEL[m].replace("상담", "")}
            </span>
          );
        })}
      </div>
    ),
  },
  {
    key: "available",
    label: "예약 가능일",
    render: (e) =>
      e.availableThisWeek ? (
        <span className="font-semibold text-teal-700">
          이번 주 {e.openSlots}자리
        </span>
      ) : (
        <span className="text-navy-400">다음 주부터</span>
      ),
    best: (list) => {
      const open = list.filter((e) => e.availableThisWeek);
      if (open.length === 0) return null;
      return open.reduce((a, b) => (b.openSlots > a.openSlots ? b : a)).id;
    },
  },
  {
    key: "strengths",
    label: "주요 강점",
    render: (e) => (
      <ul className="space-y-1">
        {e.strengths.map((s) => (
          <li key={s} className="flex items-start gap-1.5 text-[13px] text-navy-600">
            <Check className="mt-[3px] h-3 w-3 shrink-0 text-teal-600" strokeWidth={3} />
            {s}
          </li>
        ))}
      </ul>
    ),
  },
];

export function CompareView({
  experts,
  onRemove,
  onNavigate,
}: {
  experts: Expert[];
  onRemove: (id: string) => void;
  onNavigate?: () => void;
}) {
  const bestMap: Record<string, string | null> = Object.fromEntries(
    ROWS.map((r) => [r.key, r.best && experts.length > 1 ? r.best(experts) : null]),
  );

  return (
    <div>
      {/* 데스크톱: 표 비교 */}
      <div className="scroll-slim hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-[128px] bg-white p-4 align-bottom text-[13px] font-semibold text-navy-400">
                비교 항목
              </th>
              {experts.map((e) => (
                <th key={e.id} className="border-l border-navy-100 p-4 align-bottom">
                  <div className="flex flex-col items-start gap-3">
                    <div className="flex w-full items-start justify-between gap-2">
                      <Portrait name={e.name} accent={e.accent} rounded="rounded-2xl" className="h-14 w-14" />
                      <button
                        type="button"
                        onClick={() => onRemove(e.id)}
                        aria-label={`${e.name} 비교에서 제외`}
                        className="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-navy-300 transition-colors hover:bg-navy-50 hover:text-navy-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/experts/${e.id}`}
                        onClick={onNavigate}
                        className="block text-[16px] font-bold text-navy-900 transition-colors hover:text-teal-700"
                      >
                        {e.name}
                      </Link>
                      <p className="mt-0.5 text-[12.5px] font-normal leading-snug text-navy-500">
                        {e.title}
                      </p>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.key} className={i % 2 === 1 ? "bg-navy-50/40" : undefined}>
                <th
                  scope="row"
                  className={`sticky left-0 z-10 p-4 align-top text-[13px] font-semibold text-navy-500 ${
                    i % 2 === 1 ? "bg-[#FAFBFD]" : "bg-white"
                  }`}
                >
                  {row.label}
                </th>
                {experts.map((e) => (
                  <td
                    key={e.id}
                    className="border-l border-navy-100 p-4 align-top text-[13.5px] text-navy-700"
                  >
                    <div className="flex items-start gap-1.5">
                      <div className="min-w-0">{row.render(e)}</div>
                      {bestMap[row.key] === e.id && (
                        <span className="mt-0.5 shrink-0 rounded-md bg-teal-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          BEST
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="sticky left-0 z-10 bg-white p-4" />
              {experts.map((e) => (
                <td key={e.id} className="border-l border-navy-100 p-4">
                  <Link
                    href={`/booking/${e.id}`}
                    onClick={onNavigate}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-teal-600 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-teal-700"
                  >
                    상담 예약
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
              <Portrait name={e.name} accent={e.accent} rounded="rounded-2xl" className="h-14 w-14" />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/experts/${e.id}`}
                  onClick={onNavigate}
                  className="text-[16px] font-bold text-navy-900"
                >
                  {e.name}
                </Link>
                <p className="mt-0.5 truncate text-[13px] text-navy-500">{e.title}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(e.id)}
                aria-label={`${e.name} 비교에서 제외`}
                className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-navy-300 hover:bg-navy-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <dl className="mt-3.5 divide-y divide-navy-100 border-t border-navy-100">
              {ROWS.map((row) => (
                <div key={row.key} className="flex gap-3 py-2.5">
                  <dt className="w-[84px] shrink-0 pt-0.5 text-[12.5px] font-semibold text-navy-400">
                    {row.label}
                  </dt>
                  <dd className="min-w-0 flex-1 text-[13.5px] text-navy-700">
                    <div className="flex items-start gap-1.5">
                      <div className="min-w-0">{row.render(e)}</div>
                      {bestMap[row.key] === e.id && (
                        <span className="mt-0.5 shrink-0 rounded-md bg-teal-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          BEST
                        </span>
                      )}
                    </div>
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href={`/booking/${e.id}`}
              onClick={onNavigate}
              className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-xl bg-teal-600 text-[15px] font-semibold text-white transition-colors hover:bg-teal-700"
            >
              {e.name} 전문가 예약하기
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
