import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Check, ChevronRight, Globe2, Star } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Icon } from "@/components/ui/Icon";
import { ExpertActions } from "@/components/expert/ExpertActions";
import { BookingPanel } from "@/components/expert/BookingPanel";
import { ProductGuide } from "@/components/expert/ProductGuide";
import { AvailabilityPreview } from "@/components/expert/AvailabilityPreview";
import { ReviewList } from "@/components/expert/ReviewList";
import { MobileBookingBar } from "@/components/expert/MobileBookingBar";
import { TrackView } from "@/components/expert/TrackView";
import { SectionNav } from "@/components/expert/SectionNav";
import { RecentExperts } from "@/components/experts/RecentExperts";
import { CHANGE_POLICY, ROOM_OPENS_MINUTES } from "@/lib/bookingRules";
import { AUDIENCE_LABEL, CATEGORY_MAP, METHOD_LABEL } from "@/lib/data/categories";
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
  { id: "fit", label: "이런 분께" },
  { id: "products", label: "상담 상품" },
  { id: "availability", label: "예약 가능 시간" },
  { id: "reviews", label: "후기" },
  { id: "about", label: "소개·경력" },
];

/** 대표 경력으로 먼저 보여 줄 개수 — 나머지는 접어 둔다 */
const CAREER_LEAD = 3;

/** 분야 · 인증 · 이름 · 직함 · 소속 — 사진 위(모바일)와 사진 옆(데스크톱)에서 함께 쓴다 */
function ExpertIdentity({ expert }: { expert: NonNullable<ReturnType<typeof getExpert>> }) {
  const primary = CATEGORY_MAP[expert.categories[0]];
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900/60 px-2 py-1 text-sm font-semibold text-teal-200 ring-1 ring-white/10 backdrop-blur-sm lg:bg-teal-500/15 lg:ring-0">
          <Icon name={primary.icon} className="h-4 w-4" />
          {primary.name}
        </span>
        {expert.badge && (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold-300">
            <BadgeCheck className="h-4 w-4" strokeWidth={2.4} />
            {expert.badge}
          </span>
        )}
      </div>
      <h1 className="mt-2 text-7xl font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-8xl">
        {expert.name}
      </h1>
      <p className="mt-0.5 text-xl font-semibold leading-snug text-teal-200 sm:text-2xl">{expert.title}</p>
      <p className="mt-1 text-base text-navy-200">{expert.affiliation}</p>
    </>
  );
}

function CareerList({ items, muted = false }: { items: { period: string; org: string; role: string; note?: string }[]; muted?: boolean }) {
  return (
    <ol className="mt-4">
      {items.map((c, i) => (
        <li key={`${c.org}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
          <div className="relative flex flex-col items-center">
            <span
              className={`mt-2 h-3 w-3 shrink-0 rounded-full ring-4 ${
                i === 0 && !muted ? "bg-teal-600 ring-teal-100" : "bg-navy-200 ring-navy-50"
              }`}
            />
            {i < items.length - 1 && <span className="mt-1 w-px flex-1 bg-navy-100" aria-hidden />}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <p className="text-sm font-semibold text-teal-700">{c.period}</p>
            <p className="mt-0.5 text-xl font-bold text-navy-900">{c.org}</p>
            <p className="mt-0.5 text-md text-navy-600">{c.role}</p>
            {c.note && <p className="mt-0.5 text-base text-navy-400">{c.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

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
        <section className="relative bg-navy-900 pb-6 shadow-[0_0_0_100vmax_#16294B] [clip-path:inset(0_-100vmax)] sm:pb-10 lg:col-start-1 lg:row-start-1 lg:py-10">
          {/* 모바일·태블릿: 사진이 화면을 여는 프로필 */}
          <div className="relative -mx-5 sm:-mx-6 lg:hidden">
            <Portrait
              name={expert.name}
              accent={expert.accent}
              photo={expert.photo}
              rounded="rounded-none"
              priority
              sizes="100vw"
              className="aspect-square w-full sm:aspect-[16/10]"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-900 via-navy-900/70 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 px-5 pb-1 sm:px-6">
              <ExpertIdentity expert={expert} />
            </div>
          </div>

          <nav
            aria-label="현재 위치"
            className="hidden flex-wrap items-center gap-1 text-sm text-navy-300 lg:flex"
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

          {/* 데스크톱: 사진 + 이름 나란히 */}
          <div className="mt-6 hidden items-end gap-6 lg:flex">
            <Portrait
              name={expert.name}
              accent={expert.accent}
              photo={expert.photo}
              rounded="rounded-2xl"
              priority
              sizes="184px"
              className="h-[184px] w-[184px] shrink-0 ring-1 ring-white/15"
            />
            <div className="min-w-0 flex-1 pb-1">
              <ExpertIdentity expert={expert} />
            </div>
          </div>

          {/* 신뢰 지표 — 세 칸으로 나란히 */}
          <dl className="mt-5 grid grid-cols-3 rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 sm:mt-6">
            <div className="px-4">
              <dt className="text-sm text-navy-300">평점</dt>
              <dd className="mt-0.5 flex items-center gap-1 text-2xl font-bold text-white">
                <Star className="h-4 w-4 text-amber-400" fill="currentColor" strokeWidth={0} />
                {expert.rating.toFixed(1)}
                <a href="#reviews" className="ml-0.5 text-base font-medium text-navy-200 underline-offset-2 hover:underline">
                  ({formatCount(expert.reviewCount)})
                </a>
              </dd>
            </div>
            <div className="border-l border-white/10 px-4">
              <dt className="text-sm text-navy-300">상담</dt>
              <dd className="mt-0.5 text-2xl font-bold text-white">
                {formatCount(expert.consultCount)}
                <span className="ml-0.5 text-base font-medium text-navy-200">회</span>
              </dd>
            </div>
            <div className="border-l border-white/10 px-4">
              <dt className="text-sm text-navy-300">경력</dt>
              <dd className="mt-0.5 text-2xl font-bold text-white">
                {expert.yearsOfExperience}
                <span className="ml-0.5 text-base font-medium text-navy-200">년</span>
              </dd>
            </div>
          </dl>

          {/* 어떤 문제를 잘 해결하는지 */}
          <p className="mt-4 max-w-2xl text-xl leading-relaxed text-white sm:mt-5 sm:text-2xl">
            {expert.headline}
          </p>

          <div className="mt-3">
            <ExpertActions expert={expert} />
          </div>
        </section>

        {/* 섹션 바로가기 — 위에 붙어 지금 보는 섹션을 표시 */}
        <SectionNav sections={SECTIONS} />

        {/* ── 판단을 뒷받침하는 상세 정보 ── */}
        <div className="min-w-0 space-y-12 py-8 lg:col-start-1 lg:row-start-3 lg:py-10">
          {/* 1. 나에게 맞는 전문가인가 */}
          <section id="fit" className="scroll-mt-32" aria-labelledby="fit-title">
            <h2 id="fit-title" className="text-4xl font-bold text-navy-900 sm:text-5xl">
              이런 고민이라면 도움이 돼요
            </h2>
            <div className="mt-5 grid grid-cols-1 overflow-hidden rounded-2xl border border-navy-100 bg-white md:grid-cols-2">
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-bold text-navy-500">이런 분께 맞아요</h3>
                <ul className="mt-3 space-y-2.5">
                  {expert.bestFor.map((b) => (
                    <li key={b} className="flex gap-2.5 text-lg leading-snug text-navy-800">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-teal-600" strokeWidth={3} />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-base text-navy-500">
                  주로 상담하는 대상 ·{" "}
                  <span className="font-semibold text-navy-700">
                    {expert.audiences.map((a) => AUDIENCE_LABEL[a]).join(", ")}
                  </span>
                </p>
              </div>
              <div className="border-t border-navy-100 bg-canvas/60 p-5 sm:p-6 md:border-l md:border-t-0">
                <h3 className="text-lg font-bold text-navy-500">상담 후 얻는 것</h3>
                <ol className="mt-3 space-y-2.5">
                  {expert.outcomes.map((o, i) => (
                    <li key={o} className="flex gap-3 text-lg leading-snug text-navy-800">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-900 text-3xs font-bold text-white">
                        {i + 1}
                      </span>
                      {o}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* 2. 무엇을 해결해 왔나 */}
          <section id="specialties" className="scroll-mt-32" aria-labelledby="solves-title">
            <h2 id="solves-title" className="text-4xl font-bold text-navy-900 sm:text-5xl">
              해결해 온 문제
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {expert.specialties.map((sp) => (
                <li key={sp.title} className="border-t border-navy-100 py-4">
                  <h3 className="text-xl font-bold text-navy-900">{sp.title}</h3>
                  <p className="mt-1 text-md leading-relaxed text-navy-500">{sp.description}</p>
                </li>
              ))}
            </ul>
            {/* 목록 카드에서 뺀 세부 키워드 — 누르면 같은 주제의 전문가를 찾는다 */}
            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="관련 키워드">
              {expert.skills.map((k) => (
                <li key={k}>
                  <Link
                    href={`/experts?q=${encodeURIComponent(k)}`}
                    className="inline-flex min-h-[38px] items-center rounded-lg bg-navy-50 px-2.5 text-sm text-navy-600 transition-colors hover:bg-navy-100 hover:text-navy-900"
                  >
                    #{k}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. 어떤 상담을 고를까 */}
          <ProductGuide expert={expert} />

          {/* 4. 언제 받을 수 있나 */}
          <AvailabilityPreview expert={expert} />

          {/* 5. 받아 본 사람들은 */}
          <ReviewList
            expertId={expert.id}
            reviews={reviews}
            rating={expert.rating}
            reviewCount={expert.reviewCount}
          />

          {/* 6. 어떤 사람인가 */}
          <section id="about" className="scroll-mt-32" aria-labelledby="about-title">
            <h2 id="about-title" className="text-4xl font-bold text-navy-900 sm:text-5xl">
              전문가 소개
            </h2>
            <p className="mt-3 whitespace-pre-line text-lg leading-[1.75] text-navy-600">{expert.intro}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-base text-navy-500">
              <Globe2 className="h-4 w-4 text-navy-400" strokeWidth={2.2} />
              상담 언어 · {expert.languages.join(", ")}
            </p>

            <h3 id="career" className="mt-8 scroll-mt-32 text-2xl font-bold text-navy-900">
              대표 경력
            </h3>
            <CareerList items={expert.career.slice(0, CAREER_LEAD)} />
            {expert.career.length > CAREER_LEAD && (
              <details className="group mt-2">
                <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-1 text-md font-semibold text-teal-700 hover:text-teal-800 [&::-webkit-details-marker]:hidden">
                  이전 경력 {expert.career.length - CAREER_LEAD}개 더 보기
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" strokeWidth={2.4} />
                </summary>
                <CareerList items={expert.career.slice(CAREER_LEAD)} muted />
              </details>
            )}
          </section>

          {/* 7. 예약하면 어떻게 진행되나 */}
          <section aria-labelledby="process-title" className="rounded-2xl border border-navy-100 bg-white p-5 sm:p-6">
            <h2 id="process-title" className="text-2xl font-bold text-navy-900">
              상담은 이렇게 진행돼요
            </h2>
            <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
              {[
                { t: "예약·질문 전달", d: "날짜와 시간을 고르고 궁금한 점을 남겨요" },
                { t: "상담 전 준비", d: "상품별 준비물을 체크리스트로 확인해요" },
                {
                  t: "상담방 입장",
                  d: `시작 ${ROOM_OPENS_MINUTES}분 전부터 ${expert.methods.map((m) => METHOD_LABEL[m].replace("상담", "")).join("·")}으로 만나요`,
                },
                { t: "정리·후기", d: "상담 결과를 받고 후기와 재상담을 이어가요" },
              ].map((step, i) => (
                <li key={step.t} className="flex gap-3 sm:block">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-navy-200 text-3xs font-bold text-navy-600">
                    {i + 1}
                  </span>
                  <span className="block sm:mt-2">
                    <span className="block text-lg font-bold text-navy-900">{step.t}</span>
                    <span className="mt-0.5 block text-md leading-snug text-navy-500">{step.d}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 border-t border-navy-100 pt-4 text-base leading-relaxed text-navy-500">
              {CHANGE_POLICY}. 데모 서비스로 실제 결제와 상담은 진행되지 않아요.
            </p>
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
