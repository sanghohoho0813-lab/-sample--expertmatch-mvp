import { describe, expect, it } from "vitest";
import {
  bookableSlots,
  earliestSlot,
  intervalsOverlap,
  openSlotCount,
  openSlots,
  slotStates,
  slotsFor,
} from "@/lib/availability";
import { toDateKey } from "@/lib/format";
import type { Booking } from "@/lib/types";

// 2026-10-06 (화) 10:20 — 화요일 오전으로 고정해 결과를 재현 가능하게
const NOW = new Date(2026, 9, 6, 10, 20);
const day = (offset: number) => toDateKey(new Date(2026, 9, 6 + offset));

const booking = (over: Partial<Booking>): Booking => ({
  id: "b1",
  code: "EM-TEST",
  expertId: "kim-dohyun",
  expertName: "김도현",
  expertTitle: "",
  expertAccent: 0,
  categoryName: "창업",
  productId: "p1",
  productName: "30분",
  minutes: 60,
  price: 50000,
  method: "video",
  date: day(1),
  time: "10:00",
  note: "",
  createdAt: NOW.toISOString(),
  status: "upcoming",
  ...over,
});

/** 오늘 이후 처음으로 운영 시간이 2개 이상인 날 */
function firstBusyDay(expertId: string) {
  for (let i = 1; i < 30; i += 1) {
    const slots = bookableSlots(expertId, day(i), NOW);
    if (slots.length >= 2) return { dateKey: day(i), slots };
  }
  throw new Error("no open day");
}

describe("slotsFor", () => {
  it("is deterministic for the same expert and date", () => {
    expect(slotsFor("kim-dohyun", day(3))).toEqual(slotsFor("kim-dohyun", day(3)));
  });

  it("closes on Sundays", () => {
    // 2026-10-11 은 일요일
    expect(slotsFor("kim-dohyun", "2026-10-11")).toEqual([]);
  });
});

describe("bookableSlots", () => {
  it("drops past dates and dates beyond the booking horizon", () => {
    expect(bookableSlots("kim-dohyun", day(-1), NOW)).toEqual([]);
    expect(bookableSlots("kim-dohyun", day(60), NOW)).toEqual([]);
  });

  it("hides today's slots that start within the next hour", () => {
    const today = bookableSlots("kim-dohyun", day(0), NOW);
    // 10:20 + 60분 = 11:20 이전 시간은 예약 불가
    expect(today.every((t) => t >= "11:20")).toBe(true);
  });

  it("keeps experts who are closed this week closed for 7 days", () => {
    // 이서연·오태경 전문가는 이번 주 예약을 받지 않는다
    for (let i = 0; i < 7; i += 1) expect(bookableSlots("lee-seoyeon", day(i), NOW)).toEqual([]);
  });
});

describe("slotStates", () => {
  it("marks the expert's booked slot as taken and frees it again when cancelled", () => {
    const { dateKey, slots } = firstBusyDay("kim-dohyun");
    const b = booking({ date: dateKey, time: slots[0] });

    const taken = slotStates("kim-dohyun", dateKey, NOW, [b], 60).find((s) => s.time === slots[0]);
    expect(taken?.state).toBe("taken");

    const freed = openSlots("kim-dohyun", dateKey, NOW, [{ ...b, status: "cancelled" }], 60);
    expect(freed).toContain(slots[0]);
  });

  it("marks another expert's overlapping slot as mine (user can't be in two consults)", () => {
    const { dateKey, slots } = firstBusyDay("jung-mina");
    const mine = booking({ expertId: "kim-dohyun", date: dateKey, time: slots[0] });
    const state = slotStates("jung-mina", dateKey, NOW, [mine], 60).find((s) => s.time === slots[0]);
    expect(state?.state).toBe("mine");
  });
});

describe("earliestSlot / openSlotCount", () => {
  it("moves past a booked slot", () => {
    const first = earliestSlot("kim-dohyun", NOW, [], 30)!;
    const b = booking({ date: first.dateKey, time: first.time, minutes: 30 });
    const next = earliestSlot("kim-dohyun", NOW, [b], 30)!;
    expect(`${next.dateKey} ${next.time}`).not.toBe(`${first.dateKey} ${first.time}`);
    expect(openSlotCount("kim-dohyun", NOW, [b], 30)).toBe(openSlotCount("kim-dohyun", NOW, [], 30) - 1);
  });
});

describe("intervalsOverlap", () => {
  it("treats touching intervals as free", () => {
    expect(intervalsOverlap(600, 60, 660, 30)).toBe(false); // 10:00–11:00 vs 11:00–11:30
    expect(intervalsOverlap(600, 60, 630, 30)).toBe(true); // 10:00–11:00 vs 10:30–11:00
  });
});
