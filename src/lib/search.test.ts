import { describe, expect, it } from "vitest";
import { matchReasons } from "@/lib/matchReasons";
import { EMPTY_FILTERS, activeFilterCount, searchExperts } from "@/lib/search";

describe("searchExperts", () => {
  it("returns every expert for an empty query", () => {
    expect(searchExperts({ query: "", filters: EMPTY_FILTERS, sort: "recommended" })).toHaveLength(12);
  });

  it("matches by skill keyword", () => {
    const ids = searchExperts({ query: "투자", filters: EMPTY_FILTERS, sort: "recommended" }).map((e) => e.id);
    expect(ids).toContain("park-jaehyung");
  });

  it("applies the price ceiling and sorts by price", () => {
    const list = searchExperts({ query: "", filters: { ...EMPTY_FILTERS, priceMax: 50000 }, sort: "priceAsc" });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((e) => e.priceFrom <= 50000)).toBe(true);
    expect(list.map((e) => e.priceFrom)).toEqual([...list.map((e) => e.priceFrom)].sort((a, b) => a - b));
  });

  it("returns nothing for gibberish instead of throwing", () => {
    expect(searchExperts({ query: "zzzqqq", filters: EMPTY_FILTERS, sort: "rating" })).toEqual([]);
  });
});

describe("activeFilterCount", () => {
  it("counts each active condition once", () => {
    expect(activeFilterCount(EMPTY_FILTERS)).toBe(0);
    expect(activeFilterCount({ ...EMPTY_FILTERS, categories: ["startup", "tax"], availableOnly: true })).toBe(3);
  });
});

describe("matchReasons", () => {
  it("explains a category filter match without AI-sounding copy", () => {
    const [expert] = searchExperts({ query: "", filters: { ...EMPTY_FILTERS, categories: ["marketing"] }, sort: "recommended" });
    const reasons = matchReasons(expert, { query: "", filters: { ...EMPTY_FILTERS, categories: ["marketing"] }, sort: "recommended" });
    expect(reasons.join(" ")).toMatch(/마케팅/);
  });
});
