import Link from "next/link";
import { BadgeCheck, PlayCircle } from "lucide-react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { HeroShowcase } from "@/components/home/HeroShowcase";
import { Portrait } from "@/components/ui/Portrait";
import { EXPERTS } from "@/lib/data/experts";
import { REVIEWS } from "@/lib/data/reviews";
import { formatCount } from "@/lib/format";

const STATS = [
  { value: `${EXPERTS.length}명`, label: "검증된 전문가" },
  {
    value: `${formatCount(EXPERTS.reduce((s, e) => s + e.consultCount, 0))}회`,
    label: "누적 상담",
  },
  {
    value: `${(EXPERTS.reduce((s, e) => s + e.rating, 0) / EXPERTS.length).toFixed(1)}점`,
    label: "평균 만족도",
  },
  { value: `${REVIEWS.length}개`, label: "실제 후기" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_110%_at_12%_-15%,#2A4E86_0%,#1A3059_38%,#101F3C_68%,#0A1730_100%)]"
        aria-hidden
      />
      <div className="shell relative py-14 sm:py-20 lg:py-[92px]">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-300/25 bg-gold-300/[0.08] px-3.5 py-2 text-[18px] font-semibold text-gold-200">
              <BadgeCheck className="h-4 w-4" strokeWidth={2.4} />
              경력·자격 검증을 마친 전문가만 등록됩니다
            </span>

            <h1 className="mt-6 text-[37px] font-extrabold leading-[1.22] tracking-[-0.035em] text-white xs:text-[42px] sm:text-[64px] lg:text-[78px]">
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

            <p className="mt-6 max-w-2xl text-[23px] leading-relaxed text-navy-200 sm:text-[25px]">
              검증된 전문가에게 1:1 상담으로 명확한 솔루션을 만나보세요.{" "}
              <br className="hidden sm:block" />
              분야를 고르고 30초 만에 예약까지 끝납니다.
            </p>

            <div className="mt-8 max-w-2xl">
              <HeroSearch />
            </div>

            {/* 모바일: 전문가 얼굴을 먼저 보여줘 신뢰감을 준다 */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 lg:hidden">
              <div className="flex -space-x-3.5">
                {EXPERTS.slice(0, 4).map((e) => (
                  <Portrait
                    key={e.id}
                    name={e.name}
                    accent={e.accent}
                    photo={e.photo}
                    rounded="rounded-full"
                    sizes="48px"
                    className="h-12 w-12 ring-2 ring-navy-900"
                  />
                ))}
              </div>
              <p className="min-w-0 flex-1 text-[19px] leading-snug text-navy-200">
                <span className="font-bold text-white">지금 {EXPERTS.length}명</span>의
                전문가가 상담을 기다리고 있어요
              </p>
            </div>

            <div className="mt-5">
              <Link
                href="/experts?demo=1"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 text-[20.5px] font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10"
              >
                <PlayCircle className="h-5 w-5 text-teal-300" strokeWidth={2.2} />
                데모 둘러보기
              </Link>
            </div>
          </div>

          <div className="hidden w-full animate-fade-up justify-center lg:flex [animation-delay:140ms]">
            <HeroShowcase />
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-9 sm:mt-16 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="relative pl-4">
              <span
                className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[3px] rounded-full bg-white/15"
                aria-hidden
              />
              <dt className="text-[19px] text-navy-300">{s.label}</dt>
              <dd className="mt-1.5 text-[35px] font-extrabold tracking-tight text-white sm:text-[41px]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
