import { intervalsOverlap, toMinutes } from "@/lib/availability";
import type { Booking } from "@/lib/types";

/** 두 예약의 시간이 겹치는가 (같은 날짜, 구간이 맞닿기만 하면 겹치지 않음) */
export function overlaps(
  a: Pick<Booking, "date" | "time" | "minutes">,
  b: Pick<Booking, "date" | "time" | "minutes">,
): boolean {
  return a.date === b.date && intervalsOverlap(toMinutes(a.time), a.minutes, toMinutes(b.time), b.minutes);
}

/**
 * 새 예약과 겹치는 기존 예약을 찾는다 (취소된 예약은 제외).
 * 사용자는 동시에 두 상담을 받을 수 없으므로 전문가가 달라도 겹치면 거절한다.
 */
export function findClash(bookings: Booking[], candidate: Booking): Booking | undefined {
  return bookings.find((b) => b.status !== "cancelled" && b.id !== candidate.id && overlaps(b, candidate));
}

/** 거절 사유 문구 */
export function clashMessage(clash: Booking, candidate: Booking): string {
  return clash.expertId === candidate.expertId
    ? "방금 다른 예약이 들어온 시간이에요. 다른 시간을 선택해 주세요."
    : `같은 시간에 ${clash.expertName} 전문가 상담이 예약되어 있어요.`;
}
