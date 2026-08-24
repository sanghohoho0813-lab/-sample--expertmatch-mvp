import Link from "next/link";
import { ArrowRight, BadgeCheck, PlayCircle } from "lucide-react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { EXPERTS } from "@/lib/data/experts";
import { REVIEWS } from "@/lib/data/reviews";
import { Avatar } from "@/components/ui/Avatar";
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
  const faces = EXPERTS.slice(0, 5);

  return (
    <section className="relative overflow-hidden bg-navy-900">
      {/* 배경 레이어 */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_15%_-10%,#1B3050_0%,#0B1A33_45%,#060F20_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-teal-500/18 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-[10%] h-[360px] w-[360px] rounded-full bg-sky-500/12 blur-[110px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent)]"
        aria-hidden
      />

      <div className="shell relative py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1.5 text-[12.5px] font-semibold text-teal-300">
              <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
              경력·자격 검증을 마친 전문가만 등록됩니다
            </span>

            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.18] tracking-[-0.035em] text-white sm:text-[46px] lg:text-[54px]">
              당신의 고민,
              <br />
              <span className="bg-gradient-to-r from-teal-300 to-sky-300 bg-clip-text text-transparent">
                전문가의 경험
              </span>
              으로 해결하세요
            </h1>

            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-navy-200 sm:text-[17px]">
              검증된 전문가에게 필요한 순간 바로 상담받아보세요.
              <br className="hidden sm:block" />
              분야를 고르고 30초 만에 예약까지 끝납니다.
            </p>

            <div className="mt-7 max-w-2xl">
              <HeroSearch />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {faces.map((e) => (
                    <span
                      key={e.id}
                      className="rounded-2xl ring-2 ring-navy-900"
                    >
                      <Avatar name={e.name} accent={e.accent} size="sm" ring={false} />
                    </span>
                  ))}
                </div>
                <p className="text-[13.5px] leading-snug text-navy-200">
                  <span className="font-bold text-white">지금 12명</span>의 전문가가
                  <br className="sm:hidden" /> 상담을 기다리고 있어요
                </p>
              </div>

              <Link
                href="/experts?demo=1"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 px-4 text-[14px] font-semibold text-white transition-all duration-200 hover:border-teal-400/60 hover:bg-white/10"
              >
                <PlayCircle className="h-4 w-4 text-teal-300" strokeWidth={2.2} />
                데모 둘러보기
              </Link>
            </div>
          </div>

          {/* 우측 프리뷰 카드 (데스크톱) */}
          <div className="hidden animate-fade-up lg:block [animation-delay:120ms]">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-teal-400/20 to-transparent blur-xl" aria-hidden />
              <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md">
                <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-teal-300">
                  Today&apos;s Match
                </p>
                <div className="mt-4 space-y-3">
                  {EXPERTS.slice(0, 3).map((e) => (
                    <Link
                      key={e.id}
                      href={`/experts/${e.id}`}
                      className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3 transition-all duration-200 hover:bg-white/[0.14]"
                    >
                      <Avatar name={e.name} accent={e.accent} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14.5px] font-bold text-white">
                          {e.name}
                        </p>
                        <p className="truncate text-[12.5px] text-navy-300">
                          {e.title}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-lg bg-teal-400/15 px-2 py-1 text-[12px] font-bold text-teal-300">
                        ★ {e.rating.toFixed(1)}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/experts"
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/15 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  전체 전문가 보기
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-white/10 pt-8 sm:mt-14 sm:grid-cols-4">
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
