import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ClipboardCheck,
  Cpu,
  LayoutDashboard,
  LayoutGrid,
  Sparkles,
  Workflow,
} from "lucide-react";
import { MIRAE_LINKS } from "@/lib/mirae";
import { MiraeLogo } from "@/components/brand/MiraeLogo";

export const metadata: Metadata = {
  title: "제작사 소개 — 미래에이아이랩",
  description:
    "이 서비스는 미래에이아이랩(MIRAE AI LAB)이 기획·디자인·개발한 레퍼런스 데모입니다.",
};

const CAPABILITIES = [
  {
    icon: LayoutDashboard,
    title: "서비스 · 제품 UI/UX",
    body: "화면 기획부터 디자인 시스템, 반응형 구현까지 실제 동작하는 제품 형태로 만듭니다.",
  },
  {
    icon: Workflow,
    title: "업무 자동화 · AX",
    body: "반복 업무를 걷어내는 자동화 흐름을 설계하고 현장 프로세스에 붙입니다.",
  },
  {
    icon: Cpu,
    title: "AI 기능 통합",
    body: "검색·추천·요약처럼 체감되는 AI 기능을 제품 흐름 안에 자연스럽게 녹여냅니다.",
  },
  {
    icon: Sparkles,
    title: "MVP 빠른 검증",
    body: "아이디어 단계의 서비스를 짧은 주기로 만들어 실제로 써보며 검증합니다.",
  },
];

const SPECS = [
  { label: "프로젝트", value: "(sample) ExpertMatch" },
  { label: "유형", value: "전문가 상담·매칭 플랫폼 MVP" },
  { label: "범위", value: "기획 · UI/UX 디자인 · 프론트엔드 개발" },
  { label: "기술", value: "Next.js · TypeScript · Tailwind CSS" },
  { label: "제작", value: "미래에이아이랩 (MIRAE AI LAB)" },
];

const SITE_LINKS = [
  {
    icon: ClipboardCheck,
    label: "우리 회사도 만들어보기",
    desc: "무료 비즈니스 진단 신청",
    href: MIRAE_LINKS.consult,
  },
  {
    icon: LayoutGrid,
    label: "다른 샘플 보기",
    desc: "미래AI랩이 만든 작업들",
    href: MIRAE_LINKS.samples,
  },
] as const;

export default function AboutPage() {
  return (
    <div className="pb-24 lg:pb-0">
      <section className="relative overflow-hidden bg-mirae-ink py-16 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_100%_at_20%_-10%,#0d4652_0%,#071a22_58%,#04121a_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 -top-16 h-[420px] w-[420px] rounded-full bg-mirae-sky/12 blur-[110px]"
          aria-hidden
        />

        <div className="shell relative">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-mirae-haze transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.4} />
            서비스로 돌아가기
          </Link>

          <div className="mt-8 max-w-3xl">
            <MiraeLogo plate className="h-[62px] sm:h-[78px]" priority />
            <h1 className="mt-8 text-6xl font-extrabold leading-[1.2] tracking-[-0.03em] text-white sm:text-8xl">
              아이디어를 만져볼 수 있는
              <br />
              <span className="text-mirae-sky">제품</span>으로 만듭니다
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-mirae-mist">
              미래에이아이랩은 서비스 기획, UI/UX 디자인, 개발을 한 팀에서 진행합니다.
              문서로만 끝나는 제안이 아니라, 실제로 클릭하고 사용할 수 있는 결과물을
              만들어 검증합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <h2 className="section-title">이런 일을 합니다</h2>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2">
          {CAPABILITIES.map((c) => {
            const CapIcon = c.icon;
            return (
              <li
                key={c.title}
                className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="flex h-[54px] w-[54px] items-center justify-center rounded-xl bg-gradient-to-br from-mirae-teal to-mirae-blue text-white">
                  <CapIcon className="h-7 w-7" strokeWidth={1.9} />
                </span>
                <h3 className="mt-5 text-xl font-bold text-navy-900">{c.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-navy-500">
                  {c.body}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-y border-navy-100 bg-white py-16 sm:py-20">
        <div className="shell">
          <h2 className="section-title">이 데모에 대하여</h2>
          <p className="section-sub">
            지금 보고 계신 서비스의 제작 정보입니다.
          </p>

          <dl className="mt-8 max-w-3xl divide-y divide-navy-100 rounded-2xl border border-navy-100">
            {SPECS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:items-center sm:gap-6"
              >
                <dt className="w-[120px] shrink-0 text-sm font-semibold text-navy-400">
                  {s.label}
                </dt>
                <dd className="text-md font-semibold text-navy-900">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-navy-900 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-navy-800"
            >
              데모 홈으로
            </Link>
            <Link
              href="/experts"
              className="inline-flex items-center justify-center rounded-xl border border-navy-200 bg-white px-7 py-4 text-base font-semibold text-navy-700 transition-colors hover:bg-navy-50"
            >
              전문가 둘러보기
            </Link>
            <a
              href={MIRAE_LINKS.home}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white px-7 py-4 text-base font-semibold text-navy-700 transition-colors hover:bg-navy-50"
            >
              미래AI랩 홈페이지
              <ArrowUpRight className="h-5 w-5 text-navy-400" strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <div className="max-w-3xl">
          <h2 className="section-title">더 알아보기</h2>
          <p className="section-sub">
            미래AI랩이 진행한 다른 작업과 진단 프로그램을 홈페이지에서 확인하실 수 있습니다.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {SITE_LINKS.map((l) => {
              const LinkIcon = l.icon;
              return (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full items-center gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-teal-600/40 hover:shadow-card-hover"
                  >
                    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-mirae-teal to-mirae-blue text-white">
                      <LinkIcon className="h-6 w-6" strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-bold text-navy-900">
                        {l.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-navy-400">
                        {l.desc}
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-navy-300" strokeWidth={2.2} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
