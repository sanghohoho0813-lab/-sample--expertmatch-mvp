import Link from "next/link";
import { ArrowRight, BadgeCheck, ListChecks } from "lucide-react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { EXPERTS } from "@/lib/data/experts";
import { cx, formatCount } from "@/lib/format";

const STATS = [
  { value: `${EXPERTS.length}명`, label: "검증 전문가" },
  {
    value: `${formatCount(EXPERTS.reduce((s, e) => s + e.consultCount, 0))}회`,
    label: "누적 상담",
  },
  {
    value: `${(EXPERTS.reduce((s, e) => s + e.rating, 0) / EXPERTS.length).toFixed(1)}점`,
    label: "평균 평점",
  },
  {
    value: `${formatCount(EXPERTS.reduce((s, e) => s + e.reviewCount, 0))}개`,
    label: "누적 후기",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_110%_at_12%_-15%,#2A4E86_0%,#1A3059_38%,#101F3C_68%,#0A1730_100%)]"
        aria-hidden
      />
      <div className="shell relative pb-7 pt-7 sm:py-20 lg:py-[84px]">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
          <div className="min-w-0 animate-fade-up">
            {/* 모바일은 테두리 없이 한 줄 — 첫 화면에 검색까지 들어오도록 */}
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-200 sm:gap-2 sm:rounded-full sm:border sm:border-gold-300/25 sm:bg-gold-300/[0.08] sm:px-3.5 sm:py-2">
              <BadgeCheck className="h-4 w-4 shrink-0" strokeWidth={2.4} />
              경력·자격 검증을 마친 전문가만 등록됩니다
            </span>

            <h1 className="mt-3.5 sm:mt-5 text-6xl font-extrabold leading-[1.22] tracking-[-0.035em] text-white min-[390px]:text-7xl sm:text-9xl lg:text-9xl xl:text-display">
              당신의 고민,
              <br />
              {/* '전문가의 경험으로'가 좁은 화면에서 끊기지 않도록 한 덩어리로 묶는다 */}
              <span className="whitespace-nowrap">
                <span className="text-teal-300">전문가의 경험</span>
                으로
              </span>
              <br />
              해결하세요
            </h1>

            <p className="mt-6 hidden max-w-2xl text-2xl leading-relaxed text-navy-200 sm:block">
              검증된 전문가에게 1:1로 묻고,{" "}
              <br className="hidden sm:block" />
              원하는 시간에 바로 상담을 예약하세요.
            </p>

            <div className="mt-6 max-w-2xl sm:mt-8">
              <HeroSearch />
            </div>

            <Link
              href="/match"
              className="group mt-4 flex max-w-2xl items-center gap-3 rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-3 text-white transition-colors hover:border-teal-300/50 hover:bg-white/10 sm:mt-6 sm:px-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-200">
                <ListChecks className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-md font-bold sm:text-lg">
                  <span className="sm:hidden">질문 5개로 맞춤 찾기</span>
                  <span className="hidden sm:inline">어떤 전문가가 필요한지 모르겠다면</span>
                </span>
                <span className="block text-base leading-snug text-navy-200">고민·예산·일정에 맞는 분을 골라 드려요</span>
              </span>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-teal-300 transition-transform group-hover:translate-x-0.5 sm:hidden"
                strokeWidth={2.4}
              />
              <span className="hidden shrink-0 items-center gap-1 text-md font-bold text-teal-300 sm:inline-flex">
                맞춤 찾기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.4} />
              </span>
            </Link>

          </div>

          <div className="hidden w-full animate-fade-up justify-center lg:flex [animation-delay:140ms]">
            <HeroShowcase />
          </div>
        </div>

        {/* 신뢰 지표 — 모바일은 한 줄 3칸 (후기 수는 태블릿부터) */}
        <dl className="mt-7 grid grid-cols-3 border-t border-white/10 pt-5 sm:mt-16 sm:grid-cols-4 sm:gap-x-6 sm:pt-9">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={cx(i > 0 ? "border-l border-white/10 pl-4 sm:pl-5" : "pr-1 sm:pr-0", i === 3 && "hidden sm:block")}
            >
              <dt className="whitespace-nowrap text-xs text-navy-300 sm:text-base">{s.label}</dt>
              <dd className="mt-0.5 whitespace-nowrap text-3xl font-bold tracking-tight text-white sm:mt-1 sm:text-7xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
