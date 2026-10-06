import { BadgeCheck } from "lucide-react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { EXPERTS } from "@/lib/data/experts";
import { formatCount } from "@/lib/format";

const STATS = [
  { value: `${EXPERTS.length}명`, label: "검증된 전문가" },
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
      <div className="shell relative py-10 sm:py-20 lg:py-[84px]">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
          <div className="min-w-0 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-300/25 bg-gold-300/[0.08] px-3.5 py-2 text-sm font-semibold text-gold-200">
              <BadgeCheck className="h-4 w-4" strokeWidth={2.4} />
              경력·자격 검증을 마친 전문가만 등록됩니다
            </span>

            <h1 className="mt-5 text-5xl font-extrabold leading-[1.22] tracking-[-0.035em] text-white xs:text-6xl min-[390px]:text-6xl sm:text-9xl lg:text-9xl xl:text-display">
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

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-200 sm:mt-6 sm:text-2xl">
              검증된 전문가에게 1:1로 묻고,{" "}
              <br className="hidden sm:block" />
              원하는 시간에 바로 상담을 예약하세요.
            </p>

            <div className="mt-7 max-w-2xl sm:mt-8">
              <HeroSearch />
            </div>

          </div>

          <div className="hidden w-full animate-fade-up justify-center lg:flex [animation-delay:140ms]">
            <HeroShowcase />
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-7 sm:mt-16 sm:grid-cols-4 sm:pt-9">
          {STATS.map((s) => (
            <div key={s.label} className="relative pl-4">
              <span
                className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[3px] rounded-full bg-white/15"
                aria-hidden
              />
              <dt className="text-sm text-navy-300 sm:text-base">{s.label}</dt>
              <dd className="mt-1 text-4xl font-extrabold tracking-tight text-white sm:text-7xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
