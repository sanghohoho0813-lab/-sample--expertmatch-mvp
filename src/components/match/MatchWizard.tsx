"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import {
  AUDIENCE_HINT,
  AUDIENCE_LABEL,
  CATEGORIES,
  METHOD_HINT,
  METHOD_ICON,
  METHOD_LABEL,
} from "@/lib/data/categories";
import { cx } from "@/lib/format";
import {
  BUDGET_OPTIONS,
  TIMING_OPTIONS,
  needsFromParams,
  needsToParams,
  type Needs,
} from "@/lib/needs";
import { useAppStore } from "@/lib/store/AppStore";
import type { Audience, ConsultMethod } from "@/lib/types";

interface Option {
  /** 주소에 남길 값 ("" 이면 상관없음) */
  value: string;
  label: string;
  hint?: string;
  icon?: string;
}

interface Question {
  key: "topic" | "who" | "method" | "budget" | "when";
  title: string;
  sub: string;
  options: Option[];
  /** 분야처럼 선택지가 많으면 2열 */
  grid?: boolean;
}

const QUESTIONS: Question[] = [
  {
    key: "topic",
    title: "어떤 고민을 해결하고 싶으세요?",
    sub: "가장 가까운 분야 하나를 골라 주세요.",
    grid: true,
    options: [
      ...CATEGORIES.map((c) => ({ value: c.id, label: c.name, hint: c.tagline, icon: c.icon })),
      { value: "", label: "아직 잘 모르겠어요", hint: "다른 조건으로 먼저 좁혀 볼게요" },
    ],
  },
  {
    key: "who",
    title: "누구의 고민인가요?",
    sub: "상담 경험이 많은 대상이 전문가마다 달라요.",
    options: [
      ...(["individual", "founder", "business"] as Audience[]).map((a) => ({
        value: a,
        label: AUDIENCE_LABEL[a],
        hint: AUDIENCE_HINT[a],
      })),
      { value: "", label: "상관없어요" },
    ],
  },
  {
    key: "method",
    title: "어떻게 상담받고 싶으세요?",
    sub: "예약할 때 이 방식이 미리 선택돼요.",
    options: [
      ...(["video", "phone", "chat"] as ConsultMethod[]).map((m) => ({
        value: m,
        label: METHOD_LABEL[m],
        hint: METHOD_HINT[m],
        icon: METHOD_ICON[m],
      })),
      { value: "", label: "상관없어요" },
    ],
  },
  {
    key: "budget",
    title: "1회 상담 예산은 어느 정도인가요?",
    sub: "가장 짧은 상담 상품 가격을 기준으로 봐요.",
    options: BUDGET_OPTIONS.map((b) => ({ value: b.value ? String(b.value) : "", label: b.label })),
  },
  {
    key: "when",
    title: "언제 상담받고 싶으세요?",
    sub: "저장된 예약까지 반영한 실제 빈 시간으로 확인해요.",
    options: TIMING_OPTIONS.map((t) => ({ value: t.value === "any" ? "" : t.value, label: t.label, hint: t.hint })),
  },
];

/** 질문별 현재 답 (주소 기준) */
function currentValue(needs: Needs, key: Question["key"]): string | null {
  switch (key) {
    case "topic":
      return needs.topic;
    case "who":
      return needs.who;
    case "method":
      return needs.method;
    case "budget":
      return needs.budget ? String(needs.budget) : null;
    case "when":
      return needs.when === "any" ? null : needs.when;
  }
}

/**
 * 5개 질문 — 하나를 누르면 바로 다음으로 넘어간다.
 * 답과 현재 질문은 주소에 남겨, 휴대폰 '뒤로'가 이전 질문으로 가고 '조건 바꾸기'로 다시 열 수 있다.
 */
export function MatchWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const { needs: saved, setNeeds } = useAppStore();

  const step = Math.min(Math.max(Number(params.get("q") ?? "1") || 1, 1), QUESTIONS.length) - 1;
  const question = QUESTIONS[step];
  const answers = needsFromParams(params);
  const selected = currentValue(answers, question.key);
  // 한 번이라도 답한 질문은 '상관없어요'를 고른 것과 구분해 표시
  const answered = params.has(`a${step + 1}`);

  const choose = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(question.key, value);
    else next.delete(question.key);
    next.set(`a${step + 1}`, "1");

    // 지금 질문의 기록에도 답을 남겨, '뒤로'로 돌아왔을 때 고른 답이 보이게 한다
    const here = new URLSearchParams(next.toString());
    here.set("q", String(step + 1));
    window.history.replaceState(window.history.state, "", `/match?${here.toString()}`);

    if (step === QUESTIONS.length - 1) {
      const needs = { ...needsFromParams(next), memo: saved?.memo };
      setNeeds(needs);
      router.push(`/match/result?${needsToParams(needs)}`);
      return;
    }
    next.set("q", String(step + 2));
    router.push(`/match?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="shell max-w-2xl py-8 pb-32 sm:py-12">
      <div className="flex items-center gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="이전 질문"
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-xl text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
          </button>
        ) : (
          <Link
            href="/"
            aria-label="홈으로"
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-xl text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
          </Link>
        )}
        <p className="text-base font-semibold text-teal-700">맞춤 찾기</p>
        <p className="ml-auto text-base text-navy-400" aria-live="polite">
          {step + 1} / {QUESTIONS.length}
        </p>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-navy-100"
        role="progressbar"
        aria-label="맞춤 찾기 진행"
        aria-valuemin={1}
        aria-valuemax={QUESTIONS.length}
        aria-valuenow={step + 1}
      >
        <div
          className="h-full rounded-full bg-teal-600 transition-[width] duration-300"
          style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <section key={question.key} className="mt-8 animate-fade-up" aria-labelledby="match-question">
        <h1 id="match-question" className="text-5xl font-bold leading-tight text-navy-900 sm:text-6xl">
          {question.title}
        </h1>
        <p className="mt-2 text-lg text-navy-500">{question.sub}</p>

        <ul className={cx("mt-7", question.grid ? "grid grid-cols-2 gap-2.5 sm:gap-3" : "space-y-2.5")} role="list">
          {question.options.map((o) => {
            const active = o.value ? selected === o.value : answered && selected === null;
            const wide = question.grid && !o.icon;
            return (
              <li key={o.value || "any"} className={cx(wide && "col-span-2")}>
                <button
                  type="button"
                  onClick={() => choose(o.value)}
                  aria-pressed={active}
                  className={cx(
                    "relative flex w-full rounded-2xl border text-left transition-colors duration-150",
                    question.grid && o.icon
                      ? "h-full min-h-[96px] flex-col items-start gap-2 p-3.5 sm:p-4"
                      : "min-h-[64px] items-center gap-3.5 px-5 py-4",
                    active
                      ? "border-teal-600 bg-teal-50/70 ring-1 ring-teal-600"
                      : "border-navy-200 bg-white hover:border-navy-300 hover:bg-canvas",
                  )}
                >
                  {question.grid && o.icon ? (
                    <>
                      {/* 상자 안 상자 대신 아이콘만 — 좁은 두 칸에서도 분야 이름이 한 줄에 */}
                      <span className="flex items-center gap-1.5 pr-6">
                        <Icon
                          name={o.icon}
                          className={cx("h-5 w-5 shrink-0", active ? "text-teal-700" : "text-navy-500")}
                        />
                        <span className="text-xl font-bold leading-snug text-navy-900">{o.label}</span>
                      </span>
                      {o.hint && <span className="text-base leading-snug text-navy-500">{o.hint}</span>}
                    </>
                  ) : (
                    <>
                      {o.icon && (
                        <span
                          className={cx(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                            active ? "bg-teal-600 text-white" : "bg-navy-50 text-navy-600",
                          )}
                        >
                          <Icon name={o.icon} className="h-5 w-5" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-xl font-bold leading-snug text-navy-900">{o.label}</span>
                        {o.hint && (
                          <span className="mt-0.5 block text-base leading-snug text-navy-500">{o.hint}</span>
                        )}
                      </span>
                    </>
                  )}
                  {active && (
                    <Check
                      className={cx(
                        "h-5 w-5 shrink-0 text-teal-600",
                        question.grid && o.icon && "absolute right-3.5 top-3.5",
                      )}
                      strokeWidth={2.6}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
