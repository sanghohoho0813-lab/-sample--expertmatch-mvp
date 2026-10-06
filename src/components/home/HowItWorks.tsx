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
    <section
      id="how-it-works"
      className="relative scroll-mt-24 overflow-hidden bg-navy-900 py-12 sm:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_100%_at_80%_0%,#22406E_0%,#16294B_55%,#0C1B36_100%)]"
        aria-hidden
      />

      <div className="shell relative">
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-7xl">
            4단계로 끝나는 전문가 상담
          </h2>
          <p className="mt-2 text-lg leading-relaxed text-navy-200 sm:text-xl">
            고민을 고르는 순간부터 예약까지 한 흐름이에요.
          </p>
        </div>

        <ol className="mt-7 grid sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <li
                key={step.title}
                className="relative flex gap-4 border-b border-white/10 py-4 last:border-0 sm:block sm:overflow-hidden sm:rounded-2xl sm:border sm:bg-white/[0.05] sm:p-6 sm:last:border"
              >
                <span
                  className="pointer-events-none absolute -right-2 -top-5 hidden text-mega font-extrabold leading-none text-white/[0.06] sm:block"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white sm:h-[52px] sm:w-[52px]">
                  <StepIcon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
                </span>
                <div className="relative min-w-0 sm:mt-5">
                  <h3 className="text-lg font-bold text-white sm:text-2xl">
                    <span className="mr-1.5 text-teal-300 sm:hidden">{i + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-base leading-relaxed text-navy-200 sm:mt-2 sm:text-md">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
