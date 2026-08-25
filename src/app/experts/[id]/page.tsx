import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  ChevronRight,
  Clock3,
  Globe2,
  MessagesSquare,
  Star,
} from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Icon } from "@/components/ui/Icon";
import { ExpertActions } from "@/components/expert/ExpertActions";
import { BookingCard } from "@/components/expert/BookingCard";
import { AvailabilityPreview } from "@/components/expert/AvailabilityPreview";
import { ReviewList } from "@/components/expert/ReviewList";
import { MobileBookingBar } from "@/components/expert/MobileBookingBar";
import { TrackView } from "@/components/expert/TrackView";
import { RecentExperts } from "@/components/experts/RecentExperts";
import { CATEGORY_MAP, METHOD_LABEL } from "@/lib/data/categories";
import { EXPERTS, getExpert } from "@/lib/data/experts";
import { reviewsForExpert } from "@/lib/data/reviews";
import { formatCount, responseLabel } from "@/lib/format";

export function generateStaticParams() {
  return EXPERTS.map((e) => ({ id: e.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const expert = getExpert(params.id);
  if (!expert) return { title: "전문가를 찾을 수 없습니다" };
  return {
    title: `${expert.name} · ${expert.title}`,
    description: expert.headline,
  };
}

export default function ExpertDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const expert = getExpert(params.id);
  if (!expert) notFound();

  const reviews = reviewsForExpert(expert.id);
  const primaryCategory = CATEGORY_MAP[expert.categories[0]];
  const lowest = expert.products.reduce((a, b) => (b.price < a.price ? b : a));

  return (
    <div className="pb-28 lg:pb-0">
      {/* 프로필 상단 */}
      <section className="relative overflow-hidden bg-navy-900">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_100%_at_20%_0%,#1B3050_0%,#0B1A33_55%,#060F20_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-teal-500/15 blur-[90px]"
          aria-hidden
        />

        <div className="shell relative py-6 sm:py-10">
          <nav
            aria-label="현재 위치"
            className="flex flex-wrap items-center gap-1 text-[21px] text-navy-300"
          >
            <Link href="/" className="transition-colors hover:text-white">
              홈
            </Link>
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            <Link href="/experts" className="transition-colors hover:text-white">
              전문가 찾기
            </Link>
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            <Link
              href={`/experts?category=${primaryCategory.id}`}
              className="transition-colors hover:text-white"
            >
              {primaryCategory.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            <span className="text-white">{expert.name}</span>
          </nav>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
            <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <Portrait
              name={expert.name}
              accent={expert.accent}
              photo={expert.photo}
              rounded="rounded-3xl"
              priority
              sizes="(max-width: 640px) 132px, 168px"
              className="h-[132px] w-[132px] shrink-0 shadow-pop ring-1 ring-white/15 sm:h-[168px] sm:w-[168px]"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {expert.categories.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[20.5px] font-semibold text-teal-200"
                  >
                    <Icon name={CATEGORY_MAP[id].icon} className="h-3.5 w-3.5" />
                    {CATEGORY_MAP[id].name}
                  </span>
                ))}
                {expert.badge && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-teal-500/20 px-2 py-1 text-[20.5px] font-bold text-teal-200">
                    <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
                    {expert.badge}
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-[44px] font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-[53px]">
                {expert.name}
              </h1>
              <p className="mt-1.5 text-[25px] font-semibold text-teal-200">
                {expert.title}
              </p>
              <p className="mt-1 text-[23px] text-navy-300">{expert.affiliation}</p>

              <p className="mt-4 max-w-2xl text-[24px] leading-relaxed text-navy-100">
                {expert.headline}
              </p>

              <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                <div>
                  <dt className="text-[19px] text-navy-300">평점</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <Star
                      className="h-4 w-4 text-amber-400"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                    <span className="text-[27.5px] font-extrabold text-white">
                      {expert.rating.toFixed(1)}
                    </span>
                    <span className="text-[21px] text-navy-300">
                      ({formatCount(expert.reviewCount)})
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[19px] text-navy-300">상담 건수</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-[27.5px] font-extrabold text-white">
                    <MessagesSquare className="h-4 w-4 text-teal-300" strokeWidth={2.2} />
                    {formatCount(expert.consultCount)}회
                  </dd>
                </div>
                <div>
                  <dt className="text-[19px] text-navy-300">경력</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-[27.5px] font-extrabold text-white">
                    <Briefcase className="h-4 w-4 text-teal-300" strokeWidth={2.2} />
                    {expert.yearsOfExperience}년
                  </dd>
                </div>
                <div>
                  <dt className="text-[19px] text-navy-300">사용 언어</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-[24px] font-semibold text-white">
                    <Globe2 className="h-4 w-4 text-teal-300" strokeWidth={2.2} />
                    {expert.languages.join(" · ")}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <ExpertActions expert={expert} />
              </div>
              </div>
            </div>

            {/* 데스크톱 히어로 우측 요약 */}
            <div className="hidden w-[316px] shrink-0 rounded-2xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm lg:block">
              <p className="text-[20.5px] text-navy-300">최저 상담료</p>
              <p className="mt-1 text-[41px] font-extrabold tracking-tight text-white">
                {formatCount(lowest.price)}
                <span className="ml-0.5 text-[21px] font-semibold text-navy-300">
                  원 / {lowest.minutes}분
                </span>
              </p>

              <dl className="mt-4 space-y-2.5 border-t border-white/10 pt-4 text-[21.5px]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-navy-300">이번 주 예약</dt>
                  <dd className="font-semibold text-white">
                    {expert.availableThisWeek
                      ? `${expert.openSlots}자리 가능`
                      : "다음 주부터"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-navy-300">응답 속도</dt>
                  <dd className="font-semibold text-white">
                    {responseLabel(expert.responseMinutes).replace("평균 ", "")}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-navy-300">상담 방식</dt>
                  <dd className="font-semibold text-white">
                    {expert.methods.map((m) => METHOD_LABEL[m].replace("상담", "")).join(" · ")}
                  </dd>
                </div>
              </dl>

              <Link
                href={`/booking/${expert.id}`}
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-teal-500 text-[24px] font-bold text-navy-950 transition-all duration-200 hover:bg-teal-400 active:scale-[0.98]"
              >
                상담 예약하기
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Link>
              <p className="mt-2.5 text-center text-[19px] text-navy-300">
                예약 확정 시 알림을 보내드립니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <div className="shell py-8 lg:py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
          <div className="min-w-0 flex-1 space-y-12">
            <section id="intro" className="scroll-mt-24">
              <h2 className="text-[30px] font-bold text-navy-900 sm:text-[34px]">
                전문가 소개
              </h2>
              <p className="mt-3 whitespace-pre-line text-[24px] leading-[1.75] text-navy-600">
                {expert.intro}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {expert.strengths.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-teal-100 bg-teal-50 px-3 py-2 text-[21.5px] font-semibold text-teal-800"
                  >
                    <BadgeCheck className="h-4 w-4" strokeWidth={2.2} />
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <section id="specialties" className="scroll-mt-24">
              <h2 className="text-[30px] font-bold text-navy-900 sm:text-[34px]">
                주요 전문분야
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {expert.specialties.map((s, i) => (
                  <li
                    key={s.title}
                    className="rounded-2xl border border-navy-100 bg-white p-4 transition-colors hover:border-navy-200"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-navy-900 text-[20.5px] font-bold text-white">
                      {i + 1}
                    </span>
                    <h3 className="mt-2.5 text-[25px] font-bold text-navy-900">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-[21.5px] leading-relaxed text-navy-500">
                      {s.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section id="career" className="scroll-mt-24">
              <h2 className="text-[30px] font-bold text-navy-900 sm:text-[34px]">
                경력
              </h2>
              <ol className="mt-4 space-y-0">
                {expert.career.map((c, i) => (
                  <li key={`${c.org}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
                    <div className="relative flex flex-col items-center">
                      <span
                        className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ${
                          i === 0
                            ? "bg-teal-600 ring-teal-100"
                            : "bg-navy-200 ring-navy-50"
                        }`}
                      />
                      {i < expert.career.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-navy-100" aria-hidden />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <p className="text-[20.5px] font-semibold text-teal-700">
                        {c.period}
                      </p>
                      <p className="mt-1 text-[25px] font-bold text-navy-900">
                        {c.org}
                      </p>
                      <p className="mt-0.5 text-[23px] text-navy-600">{c.role}</p>
                      {c.note && (
                        <p className="mt-1 text-[21px] text-navy-400">{c.note}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* 모바일에서는 상담 상품을 본문 흐름에 노출 */}
            <section id="products" className="scroll-mt-24 lg:hidden">
              <h2 className="text-[30px] font-bold text-navy-900 sm:text-[34px]">
                상담 상품
              </h2>
              <div className="mt-4">
                <BookingCard expert={expert} />
              </div>
            </section>

            <AvailabilityPreview expertId={expert.id} />

            <ReviewList
              reviews={reviews}
              rating={expert.rating}
              reviewCount={expert.reviewCount}
            />

            <section className="rounded-2xl border border-navy-100 bg-white p-5">
              <h2 className="text-[25px] font-bold text-navy-900">
                상담 전 알아두세요
              </h2>
              <ul className="mt-3 space-y-2.5 text-[23px] leading-relaxed text-navy-600">
                <li className="flex gap-2">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
                  예약 시 남긴 질문은 상담 전에 전문가에게 전달됩니다.
                </li>
                <li className="flex gap-2">
                  <MessagesSquare className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
                  1:1 채팅은 상담 예약 후 이용할 수 있습니다.
                </li>
                <li className="flex gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
                  이 페이지는 데모입니다. 실제 결제와 상담은 진행되지 않습니다.
                </li>
              </ul>
            </section>
          </div>

          {/* 데스크톱 우측 Sticky 예약 카드 */}
          <aside className="hidden w-[384px] shrink-0 lg:block">
            <div className="sticky top-24">
              <BookingCard expert={expert} />
            </div>
          </aside>
        </div>
      </div>

      <div className="shell pb-4">
        <RecentExperts exclude={expert.id} />
      </div>

      <TrackView expertId={expert.id} />
      <MobileBookingBar expert={expert} />
    </div>
  );
}
