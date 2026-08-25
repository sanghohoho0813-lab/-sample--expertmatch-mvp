import Link from "next/link";
import { ArrowRight, Cpu, LayoutDashboard, Workflow } from "lucide-react";
import { MiraeLogo } from "@/components/brand/MiraeLogo";

const CAPABILITIES = [
  {
    icon: LayoutDashboard,
    title: "서비스 · 제품 UI/UX",
    body: "기획부터 화면 설계, 프로토타입까지 실제 동작하는 형태로 만듭니다.",
  },
  {
    icon: Workflow,
    title: "업무 자동화 · AX",
    body: "반복 업무를 걷어내는 자동화 흐름을 설계하고 현장에 붙입니다.",
  },
  {
    icon: Cpu,
    title: "AI 기능 통합",
    body: "검색·추천·요약 등 AI 기능을 제품에 자연스럽게 녹여냅니다.",
  },
];

/** 홈 하단 제작사 소개 밴드 */
export function MiraeBand() {
  return (
    <section className="border-y border-[#0d2b35] bg-[#071a22] py-16 sm:py-20">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#19c6f4]/25 bg-[#19c6f4]/10 px-3.5 py-2 text-[18px] font-semibold text-[#19c6f4]">
              Built by
            </span>
            <div className="mt-6">
              <MiraeLogo plate className="h-[58px] sm:h-[70px]" priority />
            </div>
            <p className="mt-6 text-[21px] leading-relaxed text-[#c9d6dc]">
              이 서비스는{" "}
              <span className="font-bold text-white">미래에이아이랩</span>이 직접
              기획하고 개발한 레퍼런스 데모입니다. 아이디어를 실제로 만져볼 수 있는
              제품으로 만드는 일을 합니다.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#19c6f4] px-6 py-4 text-[19px] font-bold text-[#071a22] transition-all duration-200 hover:bg-[#3ad4ff] active:scale-[0.98]"
            >
              제작 사례 자세히 보기
              <ArrowRight className="h-5 w-5" strokeWidth={2.4} />
            </Link>
          </div>

          <ul className="grid gap-4 sm:grid-cols-3 lg:gap-5">
            {CAPABILITIES.map((c) => {
              const CapIcon = c.icon;
              return (
                <li
                  key={c.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors duration-200 hover:border-[#19c6f4]/30 hover:bg-white/[0.07]"
                >
                  <span className="flex h-[54px] w-[54px] items-center justify-center rounded-xl bg-gradient-to-br from-[#00a3a3] to-[#1478ff] text-white">
                    <CapIcon className="h-7 w-7" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-5 text-[21px] font-bold text-white">{c.title}</h3>
                  <p className="mt-2.5 text-[18px] leading-relaxed text-[#a9bcc4]">
                    {c.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
