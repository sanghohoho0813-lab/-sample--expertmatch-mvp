import { describe, expect, it } from "vitest";
import { ratingDistribution } from "@/lib/ratings";

describe("ratingDistribution", () => {
  it.each([
    [4.9, 218],
    [4.6, 104],
    [4.7, 89],
  ])("adds up to the review count and matches the average (%s, %s)", (rating, total) => {
    const dist = ratingDistribution(rating, total);
    expect(dist.reduce((s, d) => s + d.count, 0)).toBe(total);
    expect(dist.every((d) => d.count >= 0)).toBe(true);
    const mean = dist.reduce((s, d) => s + d.star * d.count, 0) / total;
    expect(Math.abs(mean - rating)).toBeLessThan(0.05);
  });
});
