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
      className="relative scroll-mt-24 overflow-hidden bg-navy-900 py-16 sm:py-20"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_100%_at_80%_0%,#22406E_0%,#16294B_55%,#0C1B36_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-gold-400/10 blur-[100px]"
        aria-hidden
      />

      <div className="shell relative">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-[15px] font-bold uppercase tracking-[0.14em] text-gold-300">
            <span className="h-px w-6 bg-gold-400" aria-hidden />
            How it works
          </span>
          <h2 className="mt-2.5 text-[30px] font-bold tracking-[-0.02em] text-white sm:text-[36px]">
            4단계로 끝나는 전문가 상담
          </h2>
          <p className="mt-2.5 text-[19px] leading-relaxed text-navy-200 sm:text-[20px]">
            복잡한 절차 없이, 고민을 고르는 순간부터 예약까지 한 흐름으로 이어집니다.
          </p>
        </div>

        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <li
                key={step.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition-colors duration-200 hover:border-gold-300/30 hover:bg-white/[0.09]"
              >
                <span
                  className="pointer-events-none absolute -right-2 -top-5 text-[78px] font-extrabold leading-none text-white/[0.06]"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 p-3 text-white shadow-[0_8px_20px_-10px_rgba(21,156,168,0.9)]">
                  <StepIcon className="h-6 w-6" strokeWidth={2} />
                </span>
                <h3 className="relative mt-5 text-[21px] font-bold text-white">
                  {step.title}
                </h3>
                <p className="relative mt-2 text-[16.5px] leading-relaxed text-navy-200">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
