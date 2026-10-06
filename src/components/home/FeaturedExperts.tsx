import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ExpertMiniCard } from "@/components/experts/ExpertMiniCard";
import { EXPERTS } from "@/lib/data/experts";
import { cx } from "@/lib/format";

export function FeaturedExperts() {
  const featured = [...EXPERTS]
    .sort((a, b) => a.featuredRank - b.featuredRank)
    .slice(0, 6);

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="shell">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="section-title">이번 주 추천 전문가</h2>
            <p className="section-sub">평점과 상담 만족도가 높은 전문가예요.</p>
          </div>
          <Link
            href="/experts"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1 text-[20px] font-semibold text-teal-700 transition-colors hover:text-teal-800"
          >
            전체보기
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </Link>
        </div>

        {/* 모바일·태블릿: 옆으로 넘겨 보기 / 데스크톱: 4명 그리드 */}
        <ul className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {featured.map((expert, i) => (
            <li
              key={expert.id}
              className={cx("w-[72%] max-w-[280px] shrink-0 snap-start lg:w-auto lg:max-w-none", i >= 4 && "lg:hidden")}
            >
              <ExpertMiniCard expert={expert} className="h-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
