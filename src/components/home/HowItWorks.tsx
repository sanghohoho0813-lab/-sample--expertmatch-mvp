import { CalendarCheck, GitCompareArrows, ListChecks, RotateCcw } from "lucide-react";

const STEPS = [
  {
    icon: ListChecks,
    title: "고민 정리",
    body: "질문 5개로 분야·대상·방식·예산·시기를 정리하거나, 검색어로 바로 찾습니다.",
  },
  {
    icon: GitCompareArrows,
    title: "비교와 결정",
    body: "상담료·가장 빠른 예약·경력 차이와 '이런 경우엔 누가 맞는지'를 한 화면에서 봅니다.",
  },
  {
    icon: CalendarCheck,
    title: "예약과 준비",
    body: "상품별 결과물과 준비물을 확인해 예약하고, 체크리스트로 상담을 준비합니다.",
  },
  {
    icon: RotateCcw,
    title: "상담과 이어가기",
    body: "상담방에서 만나고, 후기를 남기거나 같은 전문가에게 이어서 상담합니다.",
  },
];

/**
 * 이용 흐름 — 밝은 바탕의 번호 타임라인.
 * 홈의 어두운 면은 첫 화면(히어로)과 마지막 CTA 두 곳만 남겨 리듬을 만든다.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-cream-200 bg-cream-50 py-12 sm:py-20">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="text-base font-semibold text-gold-700">이용 흐름</p>
          <h2 className="section-title mt-1.5">고민 정리부터 재상담까지 한 흐름으로</h2>
          <p className="section-sub">누구에게 물어야 할지 몰라도 괜찮아요. 고르는 일부터 도와 드려요.</p>
        </div>

        <ol className="relative mt-8 grid gap-0 sm:mt-12 lg:grid-cols-4 lg:gap-8">
          {/* 데스크톱: 번호를 잇는 가로선 */}
          <span className="absolute left-6 right-6 top-6 hidden h-px bg-gold-200 lg:block" aria-hidden />
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            const last = i === STEPS.length - 1;
            return (
              <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0 lg:block lg:pb-0">
                {/* 모바일: 번호를 잇는 세로선 */}
                {!last && <span className="absolute bottom-0 left-6 top-12 w-px bg-gold-200 lg:hidden" aria-hidden />}
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-200 bg-white text-navy-800 shadow-card">
                  <StepIcon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div className="min-w-0 pt-1 lg:mt-5 lg:pt-0">
                  <p className="text-sm font-semibold text-gold-700">STEP {i + 1}</p>
                  <h3 className="mt-0.5 text-2xl font-bold text-navy-900">{step.title}</h3>
                  <p className="mt-1.5 text-md leading-relaxed text-navy-500">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
