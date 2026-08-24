"use client";

import { useEffect, useState } from "react";
import { Stars } from "@/components/ui/Stars";
import { relativeDay } from "@/lib/format";
import type { Review } from "@/lib/types";

const PAGE = 4;

export function ReviewList({
  reviews,
  rating,
  reviewCount,
}: {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}) {
  const [shown, setShown] = useState(PAGE);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => setToday(new Date()), []);

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const total = reviews.length || 1;

  return (
    <section id="reviews" className="scroll-mt-24">
      <h2 className="text-[19px] font-bold text-navy-900 sm:text-[21px]">
        리뷰 <span className="text-teal-700">{reviewCount}</span>
      </h2>

      <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-navy-100 bg-white p-5 sm:flex-row sm:items-center sm:gap-8">
        <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-start">
          <div>
            <p className="text-[36px] font-extrabold leading-none tracking-tight text-navy-900">
              {rating.toFixed(1)}
            </p>
            <Stars value={rating} size={16} className="mt-2" />
          </div>
          <p className="text-[13px] text-navy-400 sm:mt-1">
            전체 {reviewCount}개의 평가
          </p>
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          {distribution.map((d) => (
            <div key={d.star} className="flex items-center gap-2.5">
              <span className="w-7 shrink-0 text-[12.5px] font-medium text-navy-500">
                {d.star}점
              </span>
              <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-navy-100">
                <span
                  className="block h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${(d.count / total) * 100}%` }}
                />
              </span>
              <span className="w-6 shrink-0 text-right text-[12.5px] text-navy-400">
                {d.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {reviews.slice(0, shown).map((r) => (
          <li
            key={r.id}
            className="rounded-2xl border border-navy-100 bg-white p-5 transition-colors hover:border-navy-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 text-[13px] font-bold text-navy-600">
                  {r.author.slice(0, 1)}
                </span>
                <div>
                  <p className="text-[14px] font-bold text-navy-900">{r.author}</p>
                  <p className="text-[12px] text-navy-400">{r.productName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Stars value={r.rating} size={13} />
                <span className="text-[12.5px] text-navy-400">
                  {today ? relativeDay(r.date, today) : r.date}
                </span>
              </div>
            </div>
            <p className="mt-3 text-[14.5px] leading-relaxed text-navy-700">{r.body}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-navy-50 px-2 py-1 text-[12px] font-medium text-navy-500"
                >
                  #{t}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {shown < reviews.length && (
        <button
          type="button"
          onClick={() => setShown((s) => s + PAGE)}
          className="mt-4 h-12 w-full rounded-xl border border-navy-200 bg-white text-[15px] font-semibold text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50"
        >
          리뷰 더보기 ({reviews.length - shown}개)
        </button>
      )}
    </section>
  );
}
