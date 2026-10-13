import { AUDIENCE_LABEL, CATEGORY_MAP, METHOD_LABEL } from "@/lib/data/categories";
import type { EarliestSlot } from "@/lib/availability";
import { formatCount, formatPrice, formatSlotLabel, parseDateKey } from "@/lib/format";
import { josa } from "@/lib/josa";
import type { Audience, ConsultMethod, Expert } from "@/lib/types";

/**
 * 비교 화면의 '한눈에 보는 차이'와 '이런 경우에는 이 전문가'.
 *
 * 모든 문장은 비교 중인 전문가들의 실제 값(상담료·경력·예약 가능 시간·방식·대상)을
 * 서로 견줘서 만든다. 값이 같으면 우열을 만들지 않는다.
 */

export type Earliest = Record<string, EarliestSlot | null | undefined>;

export interface Difference {
  key: string;
  label: string;
  text: string;
}

export interface Case {
  /** 이런 경우에는 */
  when: string;
  /** 근거가 된 실제 값 */
  because: string;
}

export interface Verdict {
  expert: Expert;
  cases: Case[];
}

/** 날짜·시간을 비교 가능한 숫자로 (작을수록 빠름) */
export function slotScore(s: EarliestSlot | null | undefined): number | null {
  if (!s) return null;
  return Number(s.dateKey.replace(/-/g, "")) * 10000 + Number(s.time.replace(":", ""));
}

const leadProduct = (e: Expert) => e.products.reduce((a, b) => (b.price < a.price ? b : a));

/** 혼자 가장 높은(낮은) 값을 가진 전문가 — 공동 1위면 null */
function soleBest(
  experts: Expert[],
  value: (e: Expert) => number | null,
  better: "high" | "low",
): { expert: Expert; value: number; others: number[] } | null {
  const scored = experts
    .map((e) => ({ e, v: value(e) }))
    .filter((x): x is { e: Expert; v: number } => x.v !== null);
  if (scored.length < 2) return null;
  scored.sort((a, b) => (better === "high" ? b.v - a.v : a.v - b.v));
  if (scored[0].v === scored[1].v) return null;
  return { expert: scored[0].e, value: scored[0].v, others: scored.slice(1).map((x) => x.v) };
}

function dayGap(a: EarliestSlot, b: EarliestSlot): number {
  return Math.round((parseDateKey(b.dateKey).getTime() - parseDateKey(a.dateKey).getTime()) / 86_400_000);
}

const METHODS: ConsultMethod[] = ["video", "phone", "chat"];
const AUDIENCES: Audience[] = ["individual", "founder", "business"];

export function compareDifferences(experts: Expert[], earliest: Earliest, now: Date | null): Difference[] {
  if (experts.length < 2) return [];
  const out: Difference[] = [];

  // 1) 가장 빠른 예약
  if (now && experts.every((e) => earliest[e.id] !== undefined)) {
    const order = experts
      .filter((e) => earliest[e.id])
      .sort((a, b) => slotScore(earliest[a.id])! - slotScore(earliest[b.id])!);
    if (order.length >= 2) {
      const [first, second] = order;
      const s1 = earliest[first.id]!;
      const s2 = earliest[second.id]!;
      const gap = dayGap(s1, s2);
      const when = formatSlotLabel(s1.dateKey, s1.time, now);
      out.push({
        key: "earliest",
        label: "가장 빠른 예약",
        text:
          slotScore(s1) === slotScore(s2)
            ? `${first.name}·${second.name} 전문가 모두 ${when}부터 가능해요`
            : gap > 0
              ? `${first.name} 전문가가 ${when}로 가장 빨라요 · 다음으로 빠른 ${second.name} 전문가보다 ${gap}일 먼저`
              : `${first.name} 전문가가 ${when}로 가장 빨라요 · ${second.name} 전문가도 같은 날 가능`,
      });
    } else if (order.length === 1) {
      out.push({
        key: "earliest",
        label: "가장 빠른 예약",
        text: `지금 예약할 수 있는 분은 ${order[0].name} 전문가뿐이에요`,
      });
    }
  }

  // 2) 상담료
  const prices = experts.map((e) => ({ e, p: leadProduct(e) }));
  const low = [...prices].sort((a, b) => a.p.price - b.p.price)[0];
  const high = [...prices].sort((a, b) => b.p.price - a.p.price)[0];
  out.push({
    key: "price",
    label: "상담료",
    text:
      low.p.price === high.p.price
        ? `모두 ${formatPrice(low.p.price)}원부터 시작해요`
        : `최대 ${formatPrice(high.p.price - low.p.price)}원 차이 · 가장 낮은 곳은 ${low.e.name} 전문가 ${formatPrice(low.p.price)}원 / ${low.p.minutes}분`,
  });

  // 3) 경력
  const years = experts.map((e) => e.yearsOfExperience);
  const maxY = Math.max(...years);
  const minY = Math.min(...years);
  const senior = experts.filter((e) => e.yearsOfExperience === maxY);
  out.push({
    key: "years",
    label: "경력",
    text:
      maxY === minY
        ? `모두 경력 ${maxY}년이에요`
        : `${minY}년 ~ ${maxY}년 · ${senior.map((e) => e.name).join("·")} 전문가가 가장 오래 일했어요`,
  });

  // 4) 상담 방식 — 한 명만 하는 방식, 또는 모두 가능한 방식
  const only = METHODS.map((m) => ({ m, who: experts.filter((e) => e.methods.includes(m)) }));
  const unique = only.filter((x) => x.who.length === 1);
  const common = only.filter((x) => x.who.length === experts.length).map((x) => METHOD_LABEL[x.m]);
  const parts: string[] = [];
  if (common.length > 0) parts.push(`${common.join("·")}은 모두 가능`);
  for (const u of unique) parts.push(`${METHOD_LABEL[u.m]}은 ${u.who[0].name} 전문가만 가능`);
  if (parts.length > 0) out.push({ key: "methods", label: "상담 방식", text: parts.join(" · ") });

  // 5) 후기
  const reviews = soleBest(experts, (e) => e.reviewCount, "high");
  if (reviews) {
    out.push({
      key: "reviews",
      label: "후기",
      text: `${reviews.expert.name} 전문가가 후기 ${formatCount(reviews.value)}개로 가장 많아요 · 평점 ${reviews.expert.rating.toFixed(1)}`,
    });
  }

  return out;
}

/** 전문가마다 '이런 경우에는 이 분' — 최대 3개 */
export function compareVerdicts(experts: Expert[], earliest: Earliest, now: Date | null): Verdict[] {
  const cases = new Map<string, Case[]>(experts.map((e) => [e.id, []]));
  const add = (e: Expert, c: Case) => cases.get(e.id)!.push(c);
  if (experts.length < 2) return experts.map((e) => ({ expert: e, cases: [] }));

  // 질적인 차이를 먼저: 상담 대상 → 주력 분야 → 상담 방식
  for (const a of AUDIENCES) {
    const who = experts.filter((e) => e.audiences.includes(a));
    if (who.length === 1) {
      add(who[0], {
        when: `${AUDIENCE_LABEL[a]}의 고민이라면`,
        because: `비교한 분 중 ${josa(AUDIENCE_LABEL[a], "을", "를")} 주로 상담하는 유일한 전문가`,
      });
    }
  }

  const primaries = new Set(experts.map((e) => e.categories[0]));
  if (primaries.size > 1) {
    for (const e of experts) {
      const cat = CATEGORY_MAP[e.categories[0]];
      if (experts.filter((x) => x.categories[0] === e.categories[0]).length === 1) {
        add(e, {
          when: `${cat.name} 쪽 고민이 중심이라면`,
          because: `${cat.name} 주력 · ${e.specialties[0]?.title ?? cat.tagline}`,
        });
      }
    }
  }

  for (const m of METHODS) {
    const who = experts.filter((e) => e.methods.includes(m));
    if (who.length === 1) {
      add(who[0], {
        when: `${METHOD_LABEL[m]}으로 받고 싶다면`,
        because: `${METHOD_LABEL[m]}은 이 분만 가능`,
      });
    }
  }

  // 객관적인 수치
  if (now) {
    const fastest = soleBest(experts, (e) => slotScore(earliest[e.id]), "low");
    const s = fastest && earliest[fastest.expert.id];
    if (fastest && s) {
      add(fastest.expert, {
        when: "가장 빨리 상담받고 싶다면",
        because: `${formatSlotLabel(s.dateKey, s.time, now)} 예약 가능`,
      });
    }
  }

  const cheapest = soleBest(experts, (e) => leadProduct(e).price, "low");
  if (cheapest) {
    const diff = Math.max(...cheapest.others) - cheapest.value;
    add(cheapest.expert, {
      when: "상담료 부담을 줄이고 싶다면",
      because: `${formatPrice(cheapest.value)}원부터 · 가장 높은 곳보다 ${formatPrice(diff)}원 낮아요`,
    });
  }

  const senior = soleBest(experts, (e) => e.yearsOfExperience, "high");
  if (senior) {
    add(senior.expert, {
      when: "오래 일한 전문가의 판단이 필요하다면",
      because: `경력 ${senior.value}년 · 다른 분보다 ${senior.value - Math.max(...senior.others)}년 이상 길어요`,
    });
  }

  const reviewed = soleBest(experts, (e) => e.reviewCount, "high");
  if (reviewed) {
    add(reviewed.expert, {
      when: "후기가 많은 전문가가 안심된다면",
      because: `후기 ${formatCount(reviewed.value)}개 · 평점 ${reviewed.expert.rating.toFixed(1)}`,
    });
  }

  return experts.map((e) => {
    const list = cases.get(e.id)!.slice(0, 3);
    // 수치로 앞서는 항목이 없어도, 프로필에 적힌 주요 상담 대상은 보여 준다
    if (list.length === 0 && e.bestFor[0]) {
      list.push({ when: `${josa(e.bestFor[0], "이라면", "라면")}`, because: "전문가가 밝힌 주요 상담 대상" });
    }
    return { expert: e, cases: list };
  });
}
