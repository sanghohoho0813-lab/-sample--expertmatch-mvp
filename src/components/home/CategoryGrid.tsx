import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES, POPULAR_CATEGORY_IDS } from "@/lib/data/categories";
import { EXPERTS } from "@/lib/data/experts";

export function CategoryGrid() {
  const items = POPULAR_CATEGORY_IDS.map(
    (id) => CATEGORIES.find((c) => c.id === id)!,
  );

  return (
    <section className="shell py-12 sm:py-14 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="section-title">어떤 분야가 필요하신가요?</h2>
          <p className="section-sub">
            분야를 고르면 해당 전문가만 모아서 보여드려요.
          </p>
        </div>
        <Link
          href="/experts?panel=categories"
          className="inline-flex items-center gap-1 text-[14px] font-semibold text-teal-700 transition-colors hover:text-teal-800"
        >
          전체 분야 보기
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
        </Link>
      </div>

      {/* 모바일: 원형 아이콘 그리드 */}
      <ul className="mt-6 grid grid-cols-4 gap-x-2 gap-y-5 sm:hidden">
        {items.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/experts?category=${cat.id}`}
              className="flex flex-col items-center gap-2"
            >
              <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full border border-navy-100 bg-white text-navy-700 shadow-card transition-colors duration-200 active:bg-teal-50 active:text-teal-700">
                <Icon name={cat.icon} className="h-6 w-6" />
              </span>
              <span className="text-center text-[13px] font-semibold text-navy-800">
                {cat.name}
              </span>
            </Link>
          </li>
        ))}
        <li>
          <Link href="/experts?panel=categories" className="flex flex-col items-center gap-2">
            <span className="flex h-[62px] w-[62px] items-center justify-center rounded-full border border-navy-100 bg-navy-50 text-navy-500 transition-colors duration-200 active:bg-teal-50 active:text-teal-700">
              <LayoutGrid className="h-6 w-6" strokeWidth={1.9} />
            </span>
            <span className="text-center text-[13px] font-semibold text-navy-800">
              전체
            </span>
          </Link>
        </li>
      </ul>

      {/* 태블릿 이상: 설명이 포함된 카드 */}
      <ul className="mt-6 hidden gap-4 sm:grid sm:grid-cols-4">
        {items.map((cat) => {
          const count = EXPERTS.filter((e) => e.categories.includes(cat.id)).length;
          return (
            <li key={cat.id}>
              <Link
                href={`/experts?category=${cat.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:border-teal-200 hover:shadow-card-hover"
              >
                <span
                  className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-teal-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-700 transition-colors duration-200 group-hover:bg-teal-600 group-hover:text-white">
                  <Icon name={cat.icon} className="h-[22px] w-[22px]" />
                </span>
                <span className="relative mt-3.5 text-[17px] font-bold text-navy-900">
                  {cat.name}
                </span>
                <span className="relative mt-1 line-clamp-2 text-[13px] leading-snug text-navy-500">
                  {cat.tagline}
                </span>
                <span className="relative mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-navy-400">
                  전문가 {count}명
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
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
