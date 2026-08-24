import { CalendarCheck, MessageSquareQuote, Search, Target } from "lucide-react";

const STEPS = [
  {
    icon: Target,
    title: "고민 선택",
    body: "지금 해결하고 싶은 분야를 고르거나 검색어를 입력합니다.",
  },
  {
    icon: Search,
    title: "전문가 탐색",
    body: "경력·평점·상담료를 나란히 비교하며 나에게 맞는 전문가를 찾습니다.",
  },
  {
    icon: CalendarCheck,
    title: "상담 예약",
    body: "상담 방식과 날짜·시간을 고르고 미리 질문을 남겨둡니다.",
  },
  {
    icon: MessageSquareQuote,
    title: "문제 해결",
    body: "예약한 시간에 상담을 진행하고 다음 실행 계획을 받아갑니다.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="shell scroll-mt-24 py-14 sm:py-16 lg:py-20">
      <div className="max-w-xl">
        <h2 className="section-title">4단계로 끝나는 전문가 상담</h2>
        <p className="section-sub">
          복잡한 절차 없이, 고민을 고르는 순간부터 예약까지 한 흐름으로 이어집니다.
        </p>
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => {
          const StepIcon = step.icon;
          return (
            <li
              key={step.title}
              className="relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-5 shadow-card"
            >
              <span
                className="pointer-events-none absolute -right-2 -top-3 text-[64px] font-extrabold leading-none text-navy-50"
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 to-teal-700 text-white">
                <StepIcon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="relative mt-4 text-[17px] font-bold text-navy-900">
                {step.title}
              </h3>
              <p className="relative mt-1.5 text-[14px] leading-relaxed text-navy-500">
                {step.body}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
