import { AUDIENCE_LABEL, CATEGORY_MAP, METHOD_LABEL } from "@/lib/data/categories";
import { EXPERTS } from "@/lib/data/experts";
import type { EarliestSlot } from "@/lib/availability";
import { formatPrice, formatSlotLabel, parseDateKey } from "@/lib/format";
import type { Audience, CategoryId, ConsultMethod, Expert } from "@/lib/types";

/**
 * 맞춤 찾기 — 몇 가지 답으로 전문가를 좁힌다.
 *
 * '매칭률 92%' 같은 근거 없는 숫자 대신, 각 조건을 실제 데이터와 맞춰 본
 * 결과(맞음 / 아님)를 그대로 보여 준다. 점수는 정렬에만 쓰고 화면에 노출하지 않는다.
 */

export type Timing = "week" | "twoWeeks" | "any";

export interface Needs {
  /** 고민 분야 — null 이면 '아직 잘 모르겠어요' */
  topic: CategoryId | null;
  who: Audience | null;
  method: ConsultMethod | null;
  /** 1회 상담 희망 예산(원) — null 이면 상관없음 */
  budget: number | null;
  when: Timing;
  /** 전문가에게 전할 고민 한 줄 (예약할 때 '상담 내용'에 채워진다) */
  memo?: string;
}

export const EMPTY_NEEDS: Needs = { topic: null, who: null, method: null, budget: null, when: "any" };

export const BUDGET_OPTIONS: { value: number | null; label: string }[] = [
  { value: 50000, label: "5만 원 이하" },
  { value: 80000, label: "8만 원 이하" },
  { value: 120000, label: "12만 원 이하" },
  { value: null, label: "상관없어요" },
];

export const TIMING_OPTIONS: { value: Timing; label: string; hint: string; days: number | null }[] = [
  { value: "week", label: "이번 주 안에", hint: "7일 이내 예약 가능한 전문가", days: 7 },
  { value: "twoWeeks", label: "2주 안에", hint: "14일 이내", days: 14 },
  { value: "any", label: "날짜는 상관없어요", hint: "일정보다 적합도가 중요해요", days: null },
];

export type FitKey = "topic" | "who" | "method" | "budget" | "when";

export interface Fit {
  key: FitKey;
  ok: boolean;
  /** 문장형 근거 (비교 화면·스크린리더) */
  label: string;
  /** 카드용 짧은 표기 — 가격·예약 시간은 카드에 따로 보이므로 판정만 */
  short: string;
}

const AUDIENCE_SHORT: Record<Audience, string> = { individual: "개인", founder: "창업자", business: "사업자" };
const methodShort = (m: ConsultMethod) => METHOD_LABEL[m].replace("상담", "");

export interface Recommendation {
  expert: Expert;
  fits: Fit[];
  /** 정렬용 내부 점수 (화면에 표시하지 않음) */
  score: number;
}

/** 오늘 0시 기준 며칠 뒤인지 */
function daysFrom(now: Date, dateKey: string): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((parseDateKey(dateKey).getTime() - today.getTime()) / 86_400_000);
}

const WEIGHT: Record<FitKey, number> = { topic: 40, who: 15, method: 15, budget: 15, when: 15 };

/**
 * 한 전문가가 각 조건을 만족하는지.
 * 답하지 않은('상관없어요') 조건은 판단하지 않는다.
 */
export function evaluateFit(
  expert: Expert,
  needs: Needs,
  earliest: EarliestSlot | null,
  now: Date | null,
): Recommendation {
  const fits: Fit[] = [];
  let score = 0;

  if (needs.topic) {
    const name = CATEGORY_MAP[needs.topic].name;
    const index = expert.categories.indexOf(needs.topic);
    if (index === 0) {
      fits.push({ key: "topic", ok: true, label: `요청한 '${name}' 분야가 주력`, short: `${name} 주력` });
      score += WEIGHT.topic;
    } else if (index > 0) {
      fits.push({ key: "topic", ok: true, label: `'${name}' 분야 상담 가능`, short: `${name} 상담 가능` });
      score += WEIGHT.topic * 0.7;
    } else {
      fits.push({ key: "topic", ok: false, label: `'${name}' 분야 전문가는 아니에요`, short: `${name} 분야 아님` });
    }
  }

  if (needs.who) {
    const ok = expert.audiences.includes(needs.who);
    fits.push({
      key: "who",
      ok,
      label: ok ? `${AUDIENCE_LABEL[needs.who]} 상담을 주로 해요` : `${AUDIENCE_LABEL[needs.who]} 상담은 많지 않아요`,
      short: `${AUDIENCE_SHORT[needs.who]} 상담 ${ok ? "많음" : "적음"}`,
    });
    if (ok) score += WEIGHT.who;
  }

  if (needs.method) {
    const ok = expert.methods.includes(needs.method);
    fits.push({
      key: "method",
      ok,
      label: ok ? `${METHOD_LABEL[needs.method]} 가능` : `${METHOD_LABEL[needs.method]}은 하지 않아요`,
      short: `${methodShort(needs.method)} ${ok ? "가능" : "불가"}`,
    });
    if (ok) score += WEIGHT.method;
  }

  if (needs.budget) {
    const diff = expert.priceFrom - needs.budget;
    const ok = diff <= 0;
    fits.push({
      key: "budget",
      ok,
      label: ok
        ? `예산 안 · ${formatPrice(expert.priceFrom)}원부터`
        : `예산보다 ${formatPrice(diff)}원 높아요`,
      short: ok ? "예산 안" : `예산 +${formatPrice(diff)}원`,
    });
    if (ok) score += WEIGHT.budget;
    // 조금 넘는 정도면 아예 배제하지 않고 순위만 낮춘다
    else if (diff <= needs.budget * 0.2) score += WEIGHT.budget * 0.3;
  }

  const days = TIMING_OPTIONS.find((t) => t.value === needs.when)?.days ?? null;
  if (days !== null) {
    if (earliest && now) {
      const ok = daysFrom(now, earliest.dateKey) < days;
      const label = formatSlotLabel(earliest.dateKey, earliest.time, now);
      fits.push({
        key: "when",
        ok,
        label: ok
          ? `${needs.when === "week" ? "이번 주" : "2주 안에"} 예약 가능 · ${label}`
          : `가장 빠른 예약은 ${label}`,
        short: `${needs.when === "week" ? "이번 주" : "2주 안"} ${ok ? "예약 가능" : "어려움"}`,
      });
      if (ok) score += WEIGHT.when;
    } else if (now) {
      fits.push({ key: "when", ok: false, label: "예약 가능한 시간이 없어요", short: "예약 가능 시간 없음" });
    }
  }

  return { expert, fits, score };
}

/**
 * 조건에 맞는 순서로 정렬.
 * 분야를 고른 경우 그 분야 전문가만 남긴다 (분야가 다르면 추천 의미가 없으므로).
 */
export function recommend(
  needs: Needs,
  earliestOf: (expert: Expert) => EarliestSlot | null,
  now: Date | null,
  experts: Expert[] = EXPERTS,
): Recommendation[] {
  return experts
    .filter((e) => !needs.topic || e.categories.includes(needs.topic))
    .map((e) => evaluateFit(e, needs, earliestOf(e), now))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.expert.rating - a.expert.rating ||
        b.expert.reviewCount - a.expert.reviewCount ||
        a.expert.featuredRank - b.expert.featuredRank,
    );
}

/** 모든 조건을 만족하는가 */
export const fitsAll = (r: Recommendation) => r.fits.every((f) => f.ok);

/* ── 주소(쿼리)와 주고받기 — 결과를 새로고침·공유해도 그대로 ── */

const TOPICS = Object.keys(CATEGORY_MAP) as CategoryId[];
const WHO: Audience[] = ["individual", "founder", "business"];
const METHODS: ConsultMethod[] = ["video", "phone", "chat"];
const TIMINGS: Timing[] = ["week", "twoWeeks", "any"];

export function needsFromParams(params: URLSearchParams): Needs {
  const pick = <T extends string>(key: string, list: readonly T[]) => {
    const v = params.get(key);
    return v && (list as readonly string[]).includes(v) ? (v as T) : null;
  };
  const budget = Number(params.get("budget"));
  return {
    topic: pick("topic", TOPICS),
    who: pick("who", WHO),
    method: pick("method", METHODS),
    budget: BUDGET_OPTIONS.some((b) => b.value === budget) ? budget : null,
    when: pick("when", TIMINGS) ?? "any",
  };
}

export function needsToParams(needs: Needs): string {
  const p = new URLSearchParams();
  if (needs.topic) p.set("topic", needs.topic);
  if (needs.who) p.set("who", needs.who);
  if (needs.method) p.set("method", needs.method);
  if (needs.budget) p.set("budget", String(needs.budget));
  if (needs.when !== "any") p.set("when", needs.when);
  return p.toString();
}

/** 화면 상단에 보여 줄 조건 요약 */
export function needsSummary(needs: Needs): string[] {
  const out: string[] = [];
  out.push(needs.topic ? CATEGORY_MAP[needs.topic].name : "분야 무관");
  if (needs.who) out.push(AUDIENCE_LABEL[needs.who]);
  if (needs.method) out.push(METHOD_LABEL[needs.method]);
  if (needs.budget) out.push(BUDGET_OPTIONS.find((b) => b.value === needs.budget)!.label);
  if (needs.when !== "any") out.push(TIMING_OPTIONS.find((t) => t.value === needs.when)!.label);
  return out;
}

/** 조건 하나를 '상관없어요'로 바꾼 답 */
export function withoutCondition(needs: Needs, key: FitKey): Needs {
  if (key === "when") return { ...needs, when: "any" };
  return { ...needs, [key]: null };
}

/**
 * 모든 조건을 만족하는 전문가가 적을 때 — 어떤 조건 하나를 빼면 몇 명이 더 맞는지.
 * 가장 많이 늘어나는 조건 하나를 돌려준다 (분야는 제외: 고민 자체를 바꾸라고 할 수는 없다).
 */
export function relaxSuggestion(
  recs: Recommendation[],
): { key: Exclude<FitKey, "topic">; gain: number } | null {
  const keys: Exclude<FitKey, "topic">[] = ["budget", "when", "method", "who"];
  let best: { key: Exclude<FitKey, "topic">; gain: number } | null = null;
  for (const key of keys) {
    const gain = recs.filter((r) => {
      const others = r.fits.filter((f) => f.key !== key);
      const target = r.fits.find((f) => f.key === key);
      return target && !target.ok && others.every((f) => f.ok);
    }).length;
    if (gain > 0 && (!best || gain > best.gain)) best = { key, gain };
  }
  return best;
}

/** 조건 이름 (요약 문구용) */
export function conditionLabel(needs: Needs, key: FitKey): string {
  switch (key) {
    case "topic":
      return needs.topic ? CATEGORY_MAP[needs.topic].name : "분야";
    case "who":
      return needs.who ? AUDIENCE_LABEL[needs.who] : "상담 대상";
    case "method":
      return needs.method ? METHOD_LABEL[needs.method] : "상담 방식";
    case "budget":
      return BUDGET_OPTIONS.find((b) => b.value === needs.budget)?.label ?? "예산";
    case "when":
      return TIMING_OPTIONS.find((t) => t.value === needs.when)?.label ?? "희망 시기";
  }
}
