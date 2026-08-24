import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES, POPULAR_CATEGORY_IDS } from "@/lib/data/categories";
import { EXPERTS } from "@/lib/data/experts";

export function CategoryGrid() {
  const items = POPULAR_CATEGORY_IDS.map(
    (id) => CATEGORIES.find((c) => c.id === id)!,
  );

  return (
    <section className="shell py-14 sm:py-16 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="section-title">어떤 분야가 필요하신가요?</h2>
          <p className="section-sub">
            분야를 고르면 해당 전문가만 모아서 보여드려요.
          </p>
        </div>
        <Link
          href="/experts"
          className="inline-flex items-center gap-1 text-[14px] font-semibold text-teal-700 transition-colors hover:text-teal-800"
        >
          전체 분야 보기
          <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
        </Link>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {items.map((cat) => {
          const count = EXPERTS.filter((e) => e.categories.includes(cat.id)).length;
          return (
            <li key={cat.id}>
              <Link
                href={`/experts?category=${cat.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white p-4 shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:border-teal-200 hover:shadow-card-hover sm:p-5"
              >
                <span
                  className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-teal-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden
                />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-700 transition-colors duration-200 group-hover:bg-teal-600 group-hover:text-white sm:h-12 sm:w-12">
                  <Icon name={cat.icon} className="h-[22px] w-[22px]" />
                </span>
                <span className="relative mt-3.5 text-[16px] font-bold text-navy-900 sm:text-[17px]">
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
