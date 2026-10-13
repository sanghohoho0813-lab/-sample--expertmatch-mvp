import { describe, expect, it } from "vitest";
import { compareDifferences, compareVerdicts, slotScore } from "@/lib/compareInsights";
import { EXPERT_MAP } from "@/lib/data/experts";
import { josa } from "@/lib/josa";
import type { Expert } from "@/lib/types";

const NOW = new Date(2026, 9, 13, 9, 0);
const base = EXPERT_MAP["kim-dohyun"];
const mk = (id: string, name: string, over: Partial<Expert>): Expert => ({
  ...base,
  id,
  name,
  ...over,
  products: over.products ?? base.products,
});

const a = mk("a", "가", { categories: ["startup"], yearsOfExperience: 10, reviewCount: 50, methods: ["video", "chat"], audiences: ["founder"] });
const b = mk("b", "나", { categories: ["tax"], yearsOfExperience: 18, reviewCount: 200, methods: ["video"], audiences: ["founder", "individual"] });
const cheap = { ...base.products[0], price: 30000 };

describe("slotScore", () => {
  it("orders by date then time", () => {
    expect(slotScore({ dateKey: "2026-10-13", time: "18:00" })!).toBeLessThan(
      slotScore({ dateKey: "2026-10-14", time: "09:00" })!,
    );
    expect(slotScore(null)).toBeNull();
  });
});

describe("compareDifferences", () => {
  it("states the fastest booking with the gap in days", () => {
    const d = compareDifferences(
      [a, b],
      { a: { dateKey: "2026-10-13", time: "15:00" }, b: { dateKey: "2026-10-16", time: "10:00" } },
      NOW,
    );
    expect(d.find((x) => x.key === "earliest")?.text).toContain("3일 먼저");
  });

  it("says when prices are equal instead of inventing a winner", () => {
    const d = compareDifferences([a, b], {}, null);
    expect(d.find((x) => x.key === "price")?.text).toMatch(/^모두/);
  });

  it("calls out a method only one expert offers", () => {
    const d = compareDifferences([a, b], {}, null);
    expect(d.find((x) => x.key === "methods")?.text).toContain("채팅상담은 가 전문가만 가능");
  });
});

describe("compareVerdicts", () => {
  it("builds 'if this, then that expert' cases from real differences", () => {
    const v = compareVerdicts(
      [{ ...a, products: [cheap] }, b],
      { a: { dateKey: "2026-10-13", time: "15:00" }, b: { dateKey: "2026-10-14", time: "15:00" } },
      NOW,
    );
    const ofA = v.find((x) => x.expert.id === "a")!.cases.map((c) => c.when);
    const ofB = v.find((x) => x.expert.id === "b")!.cases.map((c) => c.when);
    expect(ofA).toContain("채팅상담으로 받고 싶다면");
    expect(ofB).toContain("개인의 고민이라면");
    expect(ofB.some((w) => w.includes("오래 일한"))).toBe(true);
    // 최대 3개
    expect(ofA.length).toBeLessThanOrEqual(3);
  });

  it("does not crown anyone on a tie, but still gives every expert a reason", () => {
    const twin = mk("c", "다", {});
    const v = compareVerdicts([mk("d", "라", {}), twin], {}, NOW);
    for (const x of v) {
      expect(x.cases.length).toBeGreaterThan(0);
      expect(x.cases.map((c) => c.when)).not.toContain("가장 빨리 상담받고 싶다면");
    }
  });
});

describe("josa", () => {
  it("picks the particle by the final consonant", () => {
    expect(josa("팀", "이라면", "라면")).toBe("팀이라면");
    expect(josa("대표", "이라면", "라면")).toBe("대표라면");
  });
});
