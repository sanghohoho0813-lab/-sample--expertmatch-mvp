import { describe, expect, it } from "vitest";
import { INITIAL_STATE, MAX_COMPARE, parsePersisted } from "@/lib/store/persist";

const validBooking = {
  id: "1",
  code: "EM-20261006-1234",
  expertId: "kim-dohyun",
  expertName: "김도현",
  productId: "p1",
  productName: "30분 Quick 상담",
  minutes: 30,
  price: 50000,
  method: "video",
  date: "2026-10-07",
  time: "10:00",
};

describe("parsePersisted", () => {
  it("falls back to the initial state for empty or broken data", () => {
    expect(parsePersisted(null)).toEqual(INITIAL_STATE);
    expect(parsePersisted("{not json")).toEqual(INITIAL_STATE);
    expect(parsePersisted("[]")).toEqual(INITIAL_STATE);
  });

  it("drops unknown expert ids, duplicates and caps the compare list", () => {
    const state = parsePersisted(
      JSON.stringify({
        favorites: ["kim-dohyun", "nobody", "kim-dohyun"],
        compare: ["kim-dohyun", "jung-mina", "park-jaehyung", "choi-junho"],
      }),
    );
    expect(state.favorites).toEqual(["kim-dohyun"]);
    expect(state.compare).toHaveLength(MAX_COMPARE);
  });

  it("keeps valid bookings, repairs legacy ones and discards malformed ones", () => {
    const state = parsePersisted(
      JSON.stringify({
        bookings: [
          validBooking, // 예전 버전: status 없음
          { ...validBooking, id: "2", time: "10 o'clock" },
          { ...validBooking, id: "3", method: "fax" },
          "garbage",
        ],
      }),
    );
    expect(state.bookings).toHaveLength(1);
    expect(state.bookings[0]).toMatchObject({ id: "1", status: "upcoming", note: "" });
  });

  it("rejects reviews with an out-of-range rating", () => {
    const review = { id: "r", bookingId: "1", expertId: "kim-dohyun", body: "좋았어요 정말로요", productName: "" };
    const state = parsePersisted(JSON.stringify({ myReviews: [{ ...review, rating: 5 }, { ...review, id: "r2", rating: 9 }] }));
    expect(state.myReviews.map((r) => r.id)).toEqual(["r"]);
  });
});
