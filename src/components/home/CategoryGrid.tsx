import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import {
  CATEGORIES,
  CATEGORY_TONE,
  POPULAR_CATEGORY_IDS,
} from "@/lib/data/categories";
import { EXPERTS } from "@/lib/data/experts";
import { cx } from "@/lib/format";

export function CategoryGrid() {
  const items = POPULAR_CATEGORY_IDS.map(
    (id) => CATEGORIES.find((c) => c.id === id)!,
  );

  return (
    <section className="shell py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[18px] font-bold uppercase tracking-[0.14em] text-teal-700">
            <span className="h-px w-6 bg-teal-500" aria-hidden />
            Categories
          </span>
          <h2 className="section-title mt-2.5">어떤 분야가 필요하신가요?</h2>
          <p className="section-sub">
            분야를 고르면 해당 전문가만 모아서 보여드려요.
          </p>
        </div>
        <Link
          href="/experts?panel=categories"
          className="inline-flex items-center gap-1.5 text-[20.5px] font-semibold text-teal-700 transition-colors hover:text-teal-800"
        >
          전체 분야 보기
          <ArrowRight className="h-5 w-5" strokeWidth={2.4} />
        </Link>
      </div>

      {/* 모바일: 원형 아이콘 그리드 */}
      <ul className="mt-8 grid grid-cols-4 gap-x-2 gap-y-6 sm:hidden">
        {items.map((cat) => {
          const tone = CATEGORY_TONE[cat.id];
          return (
            <li key={cat.id}>
              <Link
                href={`/experts?category=${cat.id}`}
                className="flex flex-col items-center gap-2.5"
              >
                <span
                  className={cx(
                    "flex h-[68px] w-[68px] items-center justify-center rounded-full border border-white shadow-card transition-transform duration-200 active:scale-95",
                    tone.tile,
                  )}
                >
                  <Icon name={cat.icon} className="h-7 w-7" />
                </span>
                <span className="text-center text-[19px] font-semibold text-navy-800">
                  {cat.name}
                </span>
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/experts?panel=categories"
            className="flex flex-col items-center gap-2.5"
          >
            <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-white bg-cream-100 text-navy-500 shadow-card">
              <LayoutGrid className="h-7 w-7" strokeWidth={1.9} />
            </span>
            <span className="text-center text-[19px] font-semibold text-navy-800">
              전체
            </span>
          </Link>
        </li>
      </ul>

      {/* 태블릿 이상: 설명이 포함된 카드 */}
      <ul className="mt-8 hidden gap-4 sm:grid sm:grid-cols-4">
        {items.map((cat) => {
          const count = EXPERTS.filter((e) => e.categories.includes(cat.id)).length;
          const tone = CATEGORY_TONE[cat.id];
          return (
            <li key={cat.id}>
              <Link
                href={`/experts?category=${cat.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-card-hover"
              >
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-teal-600 transition-transform duration-300 group-hover:scale-x-100"
                  aria-hidden
                />
                <span
                  className={cx(
                    "relative flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200 group-hover:text-white",
                    tone.tile,
                    tone.hover,
                  )}
                >
                  <Icon name={cat.icon} className="h-7 w-7" />
                </span>
                <span className="relative mt-4 text-[25px] font-bold text-navy-900">
                  {cat.name}
                </span>
                <span className="relative mt-1.5 line-clamp-2 text-[19px] leading-snug text-navy-500">
                  {cat.tagline}
                </span>
                <span className="relative mt-4 inline-flex items-center gap-1 text-[18px] font-semibold text-navy-400">
                  전문가 {count}명
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    strokeWidth={2.4}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
