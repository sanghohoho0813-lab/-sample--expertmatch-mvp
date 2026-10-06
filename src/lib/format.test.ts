import { describe, expect, it } from "vitest";
import { dDay, formatSlotLabel, formatTimeKorean } from "@/lib/format";

const NOW = new Date(2026, 9, 6, 9, 0); // 10월 6일 (화)

describe("format", () => {
  it("formats 24h times in Korean", () => {
    expect(formatTimeKorean("09:00")).toBe("오전 9:00");
    expect(formatTimeKorean("16:30")).toBe("오후 4:30");
  });

  it("labels today and tomorrow relatively", () => {
    expect(formatSlotLabel("2026-10-06", "16:00", NOW)).toBe("오늘 오후 4:00");
    expect(formatSlotLabel("2026-10-07", "10:00", NOW)).toBe("내일 오전 10:00");
    expect(formatSlotLabel("2026-10-09", "10:00", NOW)).toContain("10월 9일 (금)");
  });

  it("counts down to the consultation day", () => {
    expect(dDay("2026-10-06", NOW)).toBe("D-DAY");
    expect(dDay("2026-10-09", NOW)).toBe("D-3");
  });
});
