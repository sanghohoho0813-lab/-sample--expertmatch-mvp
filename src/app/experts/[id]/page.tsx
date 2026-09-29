import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
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
import {
  BookingSummaryPanel,
  QuickFacts,
} from "@/components/expert/BookingSummaryPanel";
import { TrackView } from "@/components/expert/TrackView";
import { RecentExperts } from "@/components/experts/RecentExperts";
import { CATEGORY_MAP } from "@/lib/data/categories";
import { EXPERTS, getExpert } from "@/lib/data/experts";
import { reviewsForExpert } from "@/lib/data/reviews";
import { formatCount } from "@/lib/format";

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

const SECTIONS = [
  { id: "intro", label: "소개" },
  { id: "specialties", label: "전문분야" },
  { id: "availability", label: "상담 가능 시간" },
  { id: "reviews", label: "후기" },
  { id: "career", label: "경력" },
];

export default function ExpertDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const expert = getExpert(params.id);
  if (!expert) notFound();

  const reviews = reviewsForExpert(expert.id);
  const [primaryId, ...otherIds] = expert.categories;
  const primary = CATEGORY_MAP[primaryId];

  return (
    <div className="pb-32 lg:pb-0">
      {/* ── Above the fold: 누구인지 · 무엇을 잘하는지 · 얼마인지 · 언제 가능한지 · 예약 ── */}
      <section className="bg-navy-900 bg-[linear-gradient(180deg,#1B3563_0%,#16294B_100%)]">
        <div className="shell py-6 sm:py-10">
          <nav
            aria-label="현재 위치"
            className="flex flex-wrap items-center gap-1 text-[19.5px] text-navy-300"
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
              href={`/experts?category=${primary.id}`}
              className="transition-colors hover:text-white"
            >
              {primary.name}
            </Link>
          </nav>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            <div className="flex min-w-0 flex-1 flex-col gap-6 sm:flex-row sm:items-start">
              <Portrait
                name={expert.name}
                accent={expert.accent}
                photo={expert.photo}
                rounded="rounded-2xl"
                priority
                sizes="(max-width: 640px) 128px, 176px"
                className="h-32 w-32 shrink-0 ring-1 ring-white/15 sm:h-44 sm:w-44"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/15 px-2.5 py-1.5 text-[19.5px] font-semibold text-teal-200">
                    <Icon name={primary.icon} className="h-4 w-4" />
                    {primary.name}
                  </span>
                  {otherIds.map((id) => (
                    <span key={id} className="text-[19.5px] text-navy-300">
                      {CATEGORY_MAP[id].name}
                    </span>
                  ))}
                  {expert.badge && (
                    <span className="inline-flex items-center gap-1 text-[19.5px] font-semibold text-gold-300">
                      <BadgeCheck className="h-4 w-4" strokeWidth={2.4} />
                      {expert.badge}
                    </span>
                  )}
                </div>

                <h1 className="mt-3 text-[42px] font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-[48.5px]">
                  {expert.name}
                </h1>
                <p className="mt-1 text-[24.5px] font-semibold text-teal-200">
                  {expert.title}
                </p>
                <p className="mt-1 text-[20.5px] text-navy-300">{expert.affiliation}</p>

                {/* 신뢰 지표 */}
                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[22px] text-navy-200">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400" fill="currentColor" strokeWidth={0} />
                    <span className="font-bold text-white">{expert.rating.toFixed(1)}</span>
                    <a href="#reviews" className="underline-offset-2 hover:underline">
                      후기 {formatCount(expert.reviewCount)}개
                    </a>
                  </span>
                  <span>
                    상담 <span className="font-bold text-white">{formatCount(expert.consultCount)}</span>회
                  </span>
                  <span>
                    경력 <span className="font-bold text-white">{expert.yearsOfExperience}</span>년
                  </span>
                </p>

                {/* 어떤 문제를 잘 해결하는지 */}
                <p className="mt-4 max-w-2xl text-[24.5px] leading-relaxed text-white">
                  {expert.headline}
                </p>

                <div className="mt-5">
                  <QuickFacts expert={expert} />
                </div>

                <div className="mt-4">
                  <ExpertActions expert={expert} />
                </div>
              </div>
            </div>

            <div className="hidden w-[340px] shrink-0 lg:block">
              <BookingSummaryPanel expert={expert} />
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 바로가기 */}
      <nav
        aria-label="상세 정보 바로가기"
        className="border-b border-navy-100 bg-white"
      >
        <ul className="shell no-scrollbar flex gap-1 overflow-x-auto">
          {SECTIONS.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className="inline-flex min-h-[52px] items-center px-3 text-[20.5px] font-semibold text-navy-500 transition-colors hover:text-navy-900"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Below the fold: 판단을 뒷받침하는 상세 정보 ── */}
      <div className="shell py-8 lg:py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
          <div className="min-w-0 flex-1 space-y-14">
            <section id="intro" className="scroll-mt-28">
              <h2 className="text-[33px] font-bold text-navy-900 sm:text-[37.5px]">
                전문가 소개
              </h2>
              <p className="mt-3 whitespace-pre-line text-[23px] leading-[1.75] text-navy-600">
                {expert.intro}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {expert.strengths.map((s) => (
                  <li
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-navy-100 bg-white px-3 py-2 text-[20.5px] font-semibold text-navy-700"
                  >
                    <BadgeCheck className="h-4 w-4 text-teal-600" strokeWidth={2.2} />
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-4 inline-flex items-center gap-1.5 text-[20.5px] text-navy-500">
                <Globe2 className="h-4 w-4 text-navy-400" strokeWidth={2.2} />
                상담 언어 · {expert.languages.join(", ")}
              </p>
            </section>

            <section id="specialties" className="scroll-mt-28">
              <h2 className="text-[33px] font-bold text-navy-900 sm:text-[37.5px]">
                주요 전문분야
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {expert.specialties.map((s) => (
                  <li
                    key={s.title}
                    className="rounded-2xl border border-navy-100 bg-white p-5"
                  >
                    <h3 className="text-[25.5px] font-bold text-navy-900">{s.title}</h3>
                    <p className="mt-1.5 text-[22px] leading-relaxed text-navy-500">
                      {s.description}
                    </p>
                  </li>
                ))}
              </ul>
              {/* 목록 카드에서 뺀 세부 키워드는 여기서 보여 준다 */}
              <div className="mt-5">
                <p className="text-[19.5px] font-semibold text-navy-400">관련 키워드</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {expert.skills.map((k) => (
                    <li key={k}>
                      <Link
                        href={`/experts?q=${encodeURIComponent(k)}`}
                        className="inline-flex min-h-[36px] items-center rounded-lg bg-navy-50 px-2.5 text-[19.5px] text-navy-600 transition-colors hover:bg-navy-100 hover:text-navy-900"
                      >
                        {k}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <AvailabilityPreview expert={expert} />

            {/* 모바일에서는 상담 상품을 본문 흐름에 노출 */}
            <section id="products" className="scroll-mt-28 lg:hidden">
              <h2 className="text-[33px] font-bold text-navy-900 sm:text-[37.5px]">
                상담 상품
              </h2>
              <div className="mt-4">
                <BookingCard expert={expert} />
              </div>
            </section>

            <ReviewList
              expertId={expert.id}
              reviews={reviews}
              rating={expert.rating}
              reviewCount={expert.reviewCount}
            />

            <section id="career" className="scroll-mt-28">
              <h2 className="text-[33px] font-bold text-navy-900 sm:text-[37.5px]">
                경력
              </h2>
              <ol className="mt-4">
                {expert.career.map((c, i) => (
                  <li key={`${c.org}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
                    <div className="relative flex flex-col items-center">
                      <span
                        className={`mt-2 h-3 w-3 shrink-0 rounded-full ring-4 ${
                          i === 0 ? "bg-teal-600 ring-teal-100" : "bg-navy-200 ring-navy-50"
                        }`}
                      />
                      {i < expert.career.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-navy-100" aria-hidden />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <p className="text-[20px] font-semibold text-teal-700">{c.period}</p>
                      <p className="mt-1 text-[25.5px] font-bold text-navy-900">{c.org}</p>
                      <p className="mt-0.5 text-[22px] text-navy-600">{c.role}</p>
                      {c.note && <p className="mt-1 text-[20.5px] text-navy-400">{c.note}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-navy-100 bg-white p-5">
              <h2 className="text-[25.5px] font-bold text-navy-900">상담 전 알아두세요</h2>
              <ul className="mt-3 space-y-2.5 text-[22px] leading-relaxed text-navy-600">
                <li className="flex gap-2">
                  <Clock3 className="mt-1 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
                  예약 시 남긴 질문은 상담 전에 전문가에게 전달됩니다.
                </li>
                <li className="flex gap-2">
                  <MessagesSquare className="mt-1 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
                  1:1 채팅은 상담 예약 후 이용할 수 있습니다.
                </li>
                <li className="flex gap-2">
                  <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
                  이 페이지는 데모입니다. 실제 결제와 상담은 진행되지 않습니다.
                </li>
              </ul>
            </section>
          </div>

          {/* 데스크톱 우측 Sticky 예약 요약 */}
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
