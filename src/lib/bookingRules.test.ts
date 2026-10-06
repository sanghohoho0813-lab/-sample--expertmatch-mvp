import { describe, expect, it } from "vitest";
import { clashMessage, findClash, overlaps } from "@/lib/bookingRules";
import type { Booking } from "@/lib/types";

const b = (over: Partial<Booking>): Booking => ({
  id: "x",
  code: "EM-1",
  expertId: "kim-dohyun",
  expertName: "김도현",
  expertTitle: "",
  expertAccent: 0,
  categoryName: "",
  productId: "p1",
  productName: "",
  minutes: 60,
  price: 1,
  method: "video",
  date: "2026-10-07",
  time: "10:00",
  note: "",
  createdAt: "",
  status: "upcoming",
  ...over,
});

describe("overlaps", () => {
  it("only compares bookings on the same date", () => {
    expect(overlaps(b({}), b({ date: "2026-10-08" }))).toBe(false);
  });
  it("detects partial overlap but not back-to-back sessions", () => {
    expect(overlaps(b({ time: "10:00" }), b({ time: "10:30", minutes: 30 }))).toBe(true);
    expect(overlaps(b({ time: "10:00" }), b({ time: "11:00" }))).toBe(false);
  });
});

describe("findClash", () => {
  const existing = b({ id: "a", expertId: "jung-mina", expertName: "정민아" });

  it("rejects a booking that overlaps another expert's session", () => {
    const candidate = b({ id: "new" });
    const clash = findClash([existing], candidate);
    expect(clash?.id).toBe("a");
    expect(clashMessage(clash!, candidate)).toContain("정민아");
  });

  it("ignores cancelled bookings", () => {
    expect(findClash([{ ...existing, status: "cancelled" }], b({ id: "new" }))).toBeUndefined();
  });

  it("explains a same-expert clash as a just-taken slot", () => {
    const same = b({ id: "a" });
    expect(clashMessage(same, b({ id: "new" }))).toContain("방금");
  });
});
