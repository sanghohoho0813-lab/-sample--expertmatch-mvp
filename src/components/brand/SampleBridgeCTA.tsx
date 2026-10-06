import Link from "next/link";
import { ArrowRight, ArrowUpRight, LayoutGrid } from "lucide-react";
import {
  MIRAE_CTA_COPY,
  MIRAE_LINKS,
  isExternalHref,
} from "@/lib/mirae";
import { cx } from "@/lib/format";

export interface SampleBridgeCTAProps {
  /** 상담 요청 링크 (메인 CTA) */
  consultHref?: string;
  /** 다른 샘플 모아보기 링크 */
  samplesHref?: string;
  /** 미래AI랩 홈페이지 링크 */
  homeHref?: string;
  /** 페이지별로 헤드라인을 바꾸고 싶을 때 (줄바꿈은 \n) */
  headline?: string;
  /** 페이지별로 설명 문구를 바꾸고 싶을 때 */
  description?: string;
  className?: string;
}

/** 외부 링크면 새 탭으로 열리도록 속성을 붙인다 */
function externalProps(href: string) {
  return isExternalHref(href)
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};
}

/**
 * 샘플 페이지 하단 공통 브릿지 CTA.
 *
 * 1) 미래AI랩이 만든 샘플임을 밝히고
 * 2) "우리 회사도 만들어보기" 상담으로 연결하고
 * 3) 다른 샘플·홈페이지로 이동시킨다.
 *
 * 문구·링크 기본값은 `src/lib/mirae.ts` 에서 관리한다.
 */
export function SampleBridgeCTA({
  consultHref = MIRAE_LINKS.consult,
  samplesHref = MIRAE_LINKS.samples,
  homeHref = MIRAE_LINKS.home,
  headline = MIRAE_CTA_COPY.headline,
  description = MIRAE_CTA_COPY.description,
  className,
}: SampleBridgeCTAProps) {
  return (
    <section
      aria-labelledby="mirae-bridge-heading"
      className={cx("shell pb-4 pt-16 sm:pt-20", className)}
    >
      <div className="relative overflow-hidden rounded-[28px] border border-navy-100 bg-white px-6 py-12 shadow-card sm:px-10 sm:py-14 lg:px-14">
        {/* 브랜드 컬러를 아주 옅게 깔아 본문 섹션과 구분한다 */}
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-[360px] w-[360px] rounded-full bg-mirae-sky/[0.10] blur-[90px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-24 h-[320px] w-[320px] rounded-full bg-teal-600/[0.07] blur-[90px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-mirae-teal via-mirae-sky to-transparent"
          aria-hidden
        />

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-14">
          <div className="min-w-0">
            {/* 1. 미래AI랩 소개 */}
            <span className="relative inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-teal-600/[0.07] px-3.5 py-2">
              <span
                className="absolute inset-0 rounded-full bg-mirae-sky/20 blur-md motion-safe:animate-badge-glow motion-reduce:hidden"
                aria-hidden
              />
              <span className="relative h-2 w-2 rounded-full bg-gradient-to-br from-mirae-glow to-mirae-blue" />
              <span className="relative text-2xs font-bold uppercase tracking-[0.16em] text-mirae-deep">
                {MIRAE_CTA_COPY.badge}
              </span>
            </span>

            <p className="mt-5 text-base font-semibold text-teal-600">
              {MIRAE_CTA_COPY.eyebrow}
            </p>

            {/* 2. 메인 헤드라인 */}
            <h2
              id="mirae-bridge-heading"
              className="mt-2.5 whitespace-pre-line text-3xl font-extrabold leading-[1.3] tracking-[-0.025em] text-navy-900 sm:text-5xl"
            >
              {headline}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-500 sm:text-md">
              {description}
            </p>
          </div>

          {/* 3. 액션 영역 */}
          <div className="flex w-full flex-col gap-3.5 lg:w-[332px]">
            {/* 메인 CTA — 가장 눈에 띄되 과하지 않게 */}
            <Link
              href={consultHref}
              {...externalProps(consultHref)}
              className="group relative inline-flex min-h-[64px] items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-2xl bg-gradient-to-br from-mirae-lagoon via-teal-600 to-mirae-navy px-5 text-sm font-bold text-white sm:px-7 sm:text-lg shadow-[0_14px_32px_-16px_rgba(14,124,134,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-16px_rgba(14,124,134,0.95)] focus-visible:-translate-y-0.5 active:translate-y-0"
            >
              {/* 6.5초에 한 번 지나가는 아주 약한 빛 */}
              <span
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent motion-safe:animate-sheen motion-reduce:hidden"
                aria-hidden
              />
              <span className="relative">{MIRAE_CTA_COPY.consultLabel}</span>
              <ArrowRight
                className="relative h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.4}
              />
            </Link>

            <p className="text-center text-xs text-navy-400 lg:text-left">
              {MIRAE_CTA_COPY.consultHint}
            </p>

            {/* 서브 액션 — 메인보다 덜 튀게 */}
            <div className="mt-1 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
              <Link
                href={samplesHref}
                {...externalProps(samplesHref)}
                className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-2xl border border-navy-200 bg-white px-5 text-sm font-semibold text-navy-700 transition-colors duration-200 hover:border-navy-300 hover:bg-navy-50"
              >
                <LayoutGrid className="h-[18px] w-[18px] text-navy-400" strokeWidth={2.1} />
                {MIRAE_CTA_COPY.samplesLabel}
              </Link>

              <Link
                href={homeHref}
                {...externalProps(homeHref)}
                className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-1.5 rounded-2xl px-5 text-sm font-semibold text-navy-500 underline-offset-4 transition-colors duration-200 hover:text-teal-600 hover:underline"
              >
                {MIRAE_CTA_COPY.homeLabel}
                <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
