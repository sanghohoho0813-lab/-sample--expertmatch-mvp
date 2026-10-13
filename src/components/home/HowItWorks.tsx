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
            고민 정리부터 재상담까지 한 흐름으로
          </h2>
          <p className="mt-2 text-lg leading-relaxed text-navy-200 sm:text-xl">
            누구에게 물어야 할지 몰라도 괜찮아요. 고르는 일부터 도와 드려요.
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
