import { describe, expect, it } from "vitest";
import { EXPERT_MAP, EXPERTS } from "@/lib/data/experts";
import {
  EMPTY_NEEDS,
  evaluateFit,
  fitsAll,
  needsFromParams,
  needsToParams,
  recommend,
  relaxSuggestion,
  withoutCondition,
  type Needs,
} from "@/lib/needs";
import type { Expert } from "@/lib/types";

const NOW = new Date(2026, 9, 13, 9, 0); // 10월 13일(화) 09:00
const kim = EXPERT_MAP["kim-dohyun"];
const with_ = (over: Partial<Expert>): Expert => ({ ...kim, ...over });
const needs = (over: Partial<Needs>): Needs => ({ ...EMPTY_NEEDS, ...over });
const soon = { dateKey: "2026-10-14", time: "10:00" };
const late = { dateKey: "2026-10-25", time: "10:00" };

describe("needs ↔ 주소", () => {
  it("round-trips answers and ignores values that are not offered", () => {
    const n = needs({ topic: "tax", who: "individual", method: "phone", budget: 80000, when: "week" });
    expect(needsFromParams(new URLSearchParams(needsToParams(n)))).toEqual(n);
    const junk = needsFromParams(new URLSearchParams("topic=x&who=alien&method=fax&budget=12345&when=soon"));
    expect(junk).toEqual(EMPTY_NEEDS);
  });

  it("leaves unanswered conditions out of the query", () => {
    expect(needsToParams(EMPTY_NEEDS)).toBe("");
  });
});

describe("evaluateFit", () => {
  it("does not judge conditions the user skipped", () => {
    expect(evaluateFit(kim, EMPTY_NEEDS, soon, NOW).fits).toEqual([]);
  });

  it("separates a primary field from a secondary one", () => {
    const primary = evaluateFit(with_({ categories: ["startup", "management"] }), needs({ topic: "startup" }), null, NOW);
    const secondary = evaluateFit(with_({ categories: ["management", "startup"] }), needs({ topic: "startup" }), null, NOW);
    expect(primary.fits[0]).toMatchObject({ ok: true, short: "창업 주력" });
    expect(secondary.fits[0]).toMatchObject({ ok: true, short: "창업 상담 가능" });
    expect(primary.score).toBeGreaterThan(secondary.score);
  });

  it("shows how far over budget an expert is, and ranks a near miss above a far one", () => {
    const near = evaluateFit(with_({ priceFrom: 90000 }), needs({ budget: 80000 }), null, NOW);
    const far = evaluateFit(with_({ priceFrom: 150000 }), needs({ budget: 80000 }), null, NOW);
    expect(near.fits[0]).toMatchObject({ ok: false, short: "예산 +10,000원" });
    expect(near.score).toBeGreaterThan(far.score);
  });

  it("checks the timing against the real earliest slot", () => {
    expect(evaluateFit(kim, needs({ when: "week" }), soon, NOW).fits[0].ok).toBe(true);
    expect(evaluateFit(kim, needs({ when: "week" }), late, NOW).fits[0].ok).toBe(false);
    expect(evaluateFit(kim, needs({ when: "twoWeeks" }), late, NOW).fits[0].ok).toBe(true);
    expect(evaluateFit(kim, needs({ when: "week" }), null, NOW).fits[0]).toMatchObject({ ok: false });
  });

  it("never shows a made-up match percentage", () => {
    const n = needs({ topic: "startup", who: "founder", method: "chat", budget: 50000, when: "week" });
    for (const e of EXPERTS) {
      for (const f of evaluateFit(e, n, soon, NOW).fits) {
        expect(f.label).not.toMatch(/%|점수|매칭률/);
        expect(f.short).not.toMatch(/%/);
      }
    }
  });
});

describe("recommend", () => {
  it("keeps only experts who cover the chosen field and puts full matches first", () => {
    const n = needs({ topic: "startup", method: "video", budget: 120000 });
    const recs = recommend(n, () => soon, NOW);
    expect(recs.length).toBeGreaterThan(0);
    expect(recs.every((r) => r.expert.categories.includes("startup"))).toBe(true);
    const firstMiss = recs.findIndex((r) => !fitsAll(r));
    if (firstMiss > 0) expect(recs.slice(firstMiss).some(fitsAll)).toBe(false);
  });

  it("falls back to rating order when nothing was answered", () => {
    const recs = recommend(EMPTY_NEEDS, () => null, NOW);
    expect(recs).toHaveLength(EXPERTS.length);
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i - 1].expert.rating).toBeGreaterThanOrEqual(recs[i].expert.rating);
    }
  });
});

describe("relaxSuggestion", () => {
  it("names the one condition that would unlock the most full matches", () => {
    const n = needs({ topic: "startup", budget: 50000, method: "video" });
    const recs = recommend(n, () => soon, NOW);
    const s = relaxSuggestion(recs);
    if (s) {
      const relaxed = recommend(withoutCondition(n, s.key), () => soon, NOW).filter(fitsAll).length;
      expect(relaxed).toBeGreaterThanOrEqual(recs.filter(fitsAll).length + s.gain);
    }
  });

  it("returns nothing when every result already fits", () => {
    expect(relaxSuggestion(recommend(EMPTY_NEEDS, () => null, NOW))).toBeNull();
  });
});
