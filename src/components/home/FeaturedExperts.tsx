import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { EXPERTS } from "@/lib/data/experts";

export function FeaturedExperts() {
  const featured = [...EXPERTS]
    .sort((a, b) => a.featuredRank - b.featuredRank)
    .slice(0, 6);

  return (
    <section className="border-y border-navy-100 bg-white py-14 sm:py-16 lg:py-20">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">이번 주 추천 전문가</h2>
            <p className="section-sub">
              평점과 상담 만족도를 기준으로 선별했습니다.
            </p>
          </div>
          <Link
            href="/experts"
            className="inline-flex items-center gap-1 text-[14px] font-semibold text-teal-700 transition-colors hover:text-teal-800"
          >
            전문가 전체보기
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </div>
    </section>
  );
}
