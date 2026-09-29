import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { EXPERTS } from "@/lib/data/experts";

export function FeaturedExperts() {
  const featured = [...EXPERTS]
    .sort((a, b) => a.featuredRank - b.featuredRank)
    .slice(0, 6);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[18px] font-bold uppercase tracking-[0.14em] text-teal-700">
              <span className="h-px w-6 bg-teal-500" aria-hidden />
              Featured
            </span>
            <h2 className="section-title mt-2.5">이번 주 추천 전문가</h2>
            <p className="section-sub">
              평점과 상담 만족도를 기준으로 선별했습니다.
            </p>
          </div>
          <Link
            href="/experts"
            className="inline-flex items-center gap-1.5 text-[20.5px] font-semibold text-teal-700 transition-colors hover:text-teal-800"
          >
            전문가 전체보기
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </div>
    </section>
  );
}
