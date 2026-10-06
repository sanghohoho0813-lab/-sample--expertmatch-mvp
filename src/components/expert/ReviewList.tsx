"use client";

import { useEffect, useState } from "react";
import { Stars } from "@/components/ui/Stars";
import { useAppStore } from "@/lib/store/AppStore";
import { DEMO_USER } from "@/lib/data/demoUser";
import { formatCount, relativeDay } from "@/lib/format";
import { ratingDistribution } from "@/lib/ratings";
import type { Review } from "@/lib/types";

const PAGE = 4;

export function ReviewList({
  expertId,
  reviews,
  rating,
  reviewCount,
}: {
  expertId: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
}) {
  const [shown, setShown] = useState(PAGE);
  const { myReviews, ready } = useAppStore();
  const mine = ready ? myReviews.filter((r) => r.expertId === expertId) : [];
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => setToday(new Date()), []);

  const distribution = ratingDistribution(rating, reviewCount);
  const total = reviewCount || 1;

  return (
    <section id="reviews" className="scroll-mt-24">
      <h2 className="text-[30px] font-bold text-navy-900 sm:text-[34px]">
        후기 <span className="text-teal-700">{formatCount(reviewCount)}</span>
      </h2>

      <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-navy-100 bg-white p-5 sm:flex-row sm:items-center sm:gap-8">
        <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-start">
          <div>
            <p className="text-[55px] font-extrabold leading-none tracking-tight text-navy-900">
              {rating.toFixed(1)}
            </p>
            <Stars value={rating} size={16} className="mt-2" />
          </div>
          <p className="text-[21px] text-navy-400 sm:mt-1">
            전체 {formatCount(reviewCount)}개 평가
          </p>
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          {distribution.map((d) => (
            <div key={d.star} className="flex items-center gap-2.5">
              <span className="w-7 shrink-0 text-[20.5px] font-medium text-navy-500">
                {d.star}점
              </span>
              <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-navy-100">
                <span
                  className="block h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${(d.count / total) * 100}%` }}
                />
              </span>
              <span className="w-12 shrink-0 text-right text-[19px] tabular-nums text-navy-400">
                {formatCount(d.count)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 내가 완료된 상담에 남긴 후기 — 마이페이지에서 작성한 내용이 바로 반영된다 */}
      {mine.length > 0 && (
        <ul className="mt-4 space-y-3" aria-label="내가 남긴 후기">
          {mine.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-md bg-teal-600 px-2 py-1 text-[17.5px] font-bold text-white">
                    내 후기
                  </span>
                  <p className="text-[23px] font-bold text-navy-900">
                    {DEMO_USER.displayName}
                  </p>
                </div>
                <Stars value={r.rating} size={16} />
              </div>
              <p className="mt-1 text-[20px] text-navy-400">{r.productName}</p>
              <p className="mt-3 whitespace-pre-line text-[23.5px] leading-relaxed text-navy-700">
                {r.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-[20px] font-bold text-navy-700">최근 후기</p>
      <ul className="mt-3 space-y-3">
        {reviews.slice(0, shown).map((r) => (
          <li
            key={r.id}
            className="rounded-2xl border border-navy-100 bg-white p-5 transition-colors hover:border-navy-200"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-100 text-[21px] font-bold text-navy-600">
                  {r.author.slice(0, 1)}
                </span>
                <div>
                  <p className="text-[23px] font-bold text-navy-900">{r.author}</p>
                  <p className="text-[19px] text-navy-400">{r.productName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Stars value={r.rating} size={13} />
                <span className="text-[20.5px] text-navy-400">
                  {today ? relativeDay(r.date, today) : r.date}
                </span>
              </div>
            </div>
            <p className="mt-3 text-[23.5px] leading-relaxed text-navy-700">{r.body}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-navy-50 px-2 py-1 text-[19px] font-medium text-navy-500"
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
          className="mt-4 h-12 w-full rounded-xl border border-navy-200 bg-white text-[24px] font-semibold text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50"
        >
          후기 더보기
        </button>
      )}
    </section>
  );
}
