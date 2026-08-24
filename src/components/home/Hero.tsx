import Link from "next/link";
import { BadgeCheck, PlayCircle } from "lucide-react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { HeroIllustration } from "@/components/home/HeroIllustration";
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
    <section className="relative overflow-hidden bg-navy-900">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_105%_at_18%_-10%,#22406E_0%,#16294B_48%,#0C1B36_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-[460px] w-[460px] rounded-full bg-teal-500/16 blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(80%_58%_at_45%_0%,black,transparent)]"
        aria-hidden
      />

      <div className="shell relative py-12 sm:py-16 lg:py-[72px]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1.5 text-[12.5px] font-semibold text-teal-300">
              <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
              경력·자격 검증을 마친 전문가만 등록됩니다
            </span>

            <h1 className="mt-5 text-[32px] font-extrabold leading-[1.2] tracking-[-0.035em] text-white sm:text-[44px] lg:text-[50px]">
              당신의 고민,
              <br />
              <span className="bg-gradient-to-r from-teal-300 to-sky-300 bg-clip-text text-transparent">
                전문가의 경험
              </span>
              으로 해결하세요
            </h1>

            <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-navy-200 sm:text-[17px]">
              검증된 전문가에게 1:1 상담으로 명확한 솔루션을 만나보세요.{" "}
              <br className="hidden sm:block" />
              분야를 고르고 30초 만에 예약까지 끝납니다.
            </p>

            <div className="mt-7 max-w-2xl">
              <HeroSearch />
            </div>

            <div className="mt-7">
              <Link
                href="/experts?demo=1"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 px-4 text-[14px] font-semibold text-white transition-all duration-200 hover:border-teal-400/60 hover:bg-white/10"
              >
                <PlayCircle className="h-4 w-4 text-teal-300" strokeWidth={2.2} />
                데모 둘러보기
              </Link>
            </div>
          </div>

          <div className="hidden justify-center lg:flex">
            <HeroIllustration className="h-auto w-full max-w-[420px] animate-fade-up [animation-delay:140ms]" />
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-white/10 pt-8 sm:mt-12 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="text-[13px] text-navy-300">{s.label}</dt>
              <dd className="mt-1 text-[22px] font-extrabold tracking-tight text-white sm:text-[26px]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
