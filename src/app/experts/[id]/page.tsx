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
import { BookingPanel } from "@/components/expert/BookingPanel";
import { ProductList } from "@/components/expert/ProductList";
import { AvailabilityPreview } from "@/components/expert/AvailabilityPreview";
import { ReviewList } from "@/components/expert/ReviewList";
import { MobileBookingBar } from "@/components/expert/MobileBookingBar";
import { TrackView } from "@/components/expert/TrackView";
import { RecentExperts } from "@/components/experts/RecentExperts";
import { CATEGORY_MAP } from "@/lib/data/categories";
import { EXPERTS, getExpert } from "@/lib/data/experts";
import { reviewsForExpert } from "@/lib/data/reviews";
import { formatCount } from "@/lib/format";

/** 목록에 없는 전문가 주소는 빌드된 404 로 */
export const dynamicParams = false;

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
  const title = `${expert.name} · ${expert.title}`;
  return {
    title,
    description: expert.headline,
    alternates: { canonical: `/experts/${expert.id}` },
    // 공유 시 전문가 사진이 미리보기로 보이도록
    openGraph: { title, description: expert.headline, images: expert.photo ? [expert.photo] : undefined },
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
  const primary = CATEGORY_MAP[expert.categories[0]];

  return (
    <div className="pb-32 lg:pb-0">
      {/*
        데스크톱: 왼쪽은 프로필·본문, 오른쪽은 히어로부터 시작해 따라 내려오는 예약 패널 하나.
        히어로 배경은 그리드 칸을 넘어 화면 끝까지 칠한다(box-shadow + clip-path).
      */}
      <div className="shell lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-10">
        {/* ── 누구인지 · 무엇을 잘하는지 · 신뢰 지표 ── */}
        <section className="relative bg-navy-900 py-6 shadow-[0_0_0_100vmax_#16294B] [clip-path:inset(0_-100vmax)] sm:py-10 lg:col-start-1 lg:row-start-1">
          <nav
            aria-label="현재 위치"
            className="flex flex-wrap items-center gap-1 text-[18px] text-navy-300"
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

          <div className="mt-5 flex items-start gap-4 sm:mt-6 sm:gap-6">
            <Portrait
              name={expert.name}
              accent={expert.accent}
              photo={expert.photo}
              rounded="rounded-2xl"
              priority
              sizes="(max-width: 640px) 104px, 168px"
              className="h-[104px] w-[104px] shrink-0 ring-1 ring-white/15 sm:h-[168px] sm:w-[168px]"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/15 px-2 py-1 text-[18px] font-semibold text-teal-200">
                  <Icon name={primary.icon} className="h-4 w-4" />
                  {primary.name}
                </span>
                {expert.badge && (
                  <span className="inline-flex items-center gap-1 text-[18px] font-semibold text-gold-300">
                    <BadgeCheck className="h-4 w-4" strokeWidth={2.4} />
                    {expert.badge}
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-[36px] font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-[46px]">
                {expert.name}
              </h1>
              <p className="mt-0.5 text-[21px] font-semibold leading-snug text-teal-200 sm:text-[24px]">
                {expert.title}
              </p>
              <p className="mt-1 hidden text-[19.5px] text-navy-300 sm:block">{expert.affiliation}</p>
            </div>
          </div>

          <p className="mt-3 text-[19px] text-navy-300 sm:hidden">{expert.affiliation}</p>

          {/* 신뢰 지표 */}
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[20.5px] text-navy-200 sm:mt-5">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-400" fill="currentColor" strokeWidth={0} />
              <span className="font-bold text-white">{expert.rating.toFixed(1)}</span>
              <a href="#reviews" className="underline-offset-2 hover:underline">
                후기 {formatCount(expert.reviewCount)}
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
          <p className="mt-3 max-w-2xl text-[22px] leading-relaxed text-white sm:text-[24px]">
            {expert.headline}
          </p>

          <div className="mt-3">
            <ExpertActions expert={expert} />
          </div>
        </section>

        {/* 섹션 바로가기 */}
        <nav
          aria-label="상세 정보 바로가기"
          className="-mx-5 border-b border-navy-100 bg-white sm:-mx-6 lg:col-start-1 lg:row-start-2 lg:mx-0"
        >
          <ul className="no-scrollbar flex gap-1 overflow-x-auto px-3 sm:px-4 lg:px-0">
            {SECTIONS.map((sec) => (
              <li key={sec.id} className="shrink-0">
                <a
                  href={`#${sec.id}`}
                  className="inline-flex min-h-[52px] items-center px-2.5 text-[19.5px] font-semibold text-navy-500 transition-colors hover:text-navy-900 lg:first:pl-0"
                >
                  {sec.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── 판단을 뒷받침하는 상세 정보 ── */}
        <div className="min-w-0 space-y-12 py-8 lg:col-start-1 lg:row-start-3 lg:py-10">
          <section id="intro" className="scroll-mt-28">
            <h2 className="text-[30px] font-bold text-navy-900 sm:text-[34px]">전문가 소개</h2>
            <p className="mt-3 whitespace-pre-line text-[21.5px] leading-[1.75] text-navy-600">
              {expert.intro}
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-[19.5px] text-navy-500">
              <Globe2 className="h-4 w-4 text-navy-400" strokeWidth={2.2} />
              상담 언어 · {expert.languages.join(", ")}
            </p>
          </section>

          <section id="specialties" className="scroll-mt-28">
            <h2 className="text-[30px] font-bold text-navy-900 sm:text-[34px]">주요 전문분야</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {expert.specialties.map((sp) => (
                <li key={sp.title} className="rounded-2xl border border-navy-100 bg-white p-5">
                  <h3 className="text-[23px] font-bold text-navy-900">{sp.title}</h3>
                  <p className="mt-1 text-[20px] leading-relaxed text-navy-500">{sp.description}</p>
                </li>
              ))}
            </ul>
            {/* 목록 카드에서 뺀 세부 키워드 — 누르면 같은 주제의 전문가를 찾는다 */}
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="관련 키워드">
              {expert.skills.map((k) => (
                <li key={k}>
                  <Link
                    href={`/experts?q=${encodeURIComponent(k)}`}
                    className="inline-flex min-h-[38px] items-center rounded-lg bg-navy-50 px-2.5 text-[18.5px] text-navy-600 transition-colors hover:bg-navy-100 hover:text-navy-900"
                  >
                    #{k}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <AvailabilityPreview expert={expert} />

          {/* 모바일: 상품을 누르면 그 상품으로 바로 예약 시작 */}
          <section id="products" className="scroll-mt-28 lg:hidden">
            <h2 className="text-[30px] font-bold text-navy-900 sm:text-[34px]">상담 상품</h2>
            <div className="mt-4">
              <ProductList expert={expert} />
            </div>
          </section>

          <ReviewList
            expertId={expert.id}
            reviews={reviews}
            rating={expert.rating}
            reviewCount={expert.reviewCount}
          />

          <section id="career" className="scroll-mt-28">
            <h2 className="text-[30px] font-bold text-navy-900 sm:text-[34px]">경력</h2>
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
                    <p className="text-[18.5px] font-semibold text-teal-700">{c.period}</p>
                    <p className="mt-0.5 text-[23px] font-bold text-navy-900">{c.org}</p>
                    <p className="mt-0.5 text-[20px] text-navy-600">{c.role}</p>
                    {c.note && <p className="mt-0.5 text-[19px] text-navy-400">{c.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-navy-100 bg-white p-5">
            <h2 className="text-[23px] font-bold text-navy-900">상담 전 알아두세요</h2>
            <ul className="mt-3 space-y-2 text-[20px] leading-relaxed text-navy-600">
              <li className="flex gap-2">
                <Clock3 className="mt-1.5 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
                예약할 때 남긴 질문은 상담 전에 전문가에게 전달돼요.
              </li>
              <li className="flex gap-2">
                <MessagesSquare className="mt-1.5 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
                일정 변경·취소는 마이페이지에서 할 수 있어요.
              </li>
              <li className="flex gap-2">
                <BadgeCheck className="mt-1.5 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
                데모 서비스로, 실제 결제와 상담은 진행되지 않아요.
              </li>
            </ul>
          </section>

          <RecentExperts exclude={expert.id} />
        </div>

        {/* ── 데스크톱 예약 패널: 히어로에서 시작해 스크롤을 따라온다 ── */}
        <aside className="relative z-10 hidden pt-8 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:block">
          <div className="sticky top-24">
            <BookingPanel expert={expert} />
          </div>
        </aside>
      </div>

      <TrackView expertId={expert.id} />
      <MobileBookingBar expert={expert} />
    </div>
  );
}
