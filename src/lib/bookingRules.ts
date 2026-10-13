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

/* ── 예약 이후: 변경·취소 · 상담방 입장 ── */

/** 상담 시작 몇 분 전까지 일정을 바꾸거나 취소할 수 있는지 (예약은 최소 1시간 뒤부터 받는다) */
export const CHANGE_CUTOFF_MINUTES = 30;
/** 상담방이 열리는 시점 (시작 전 분) */
export const ROOM_OPENS_MINUTES = 10;

export const CHANGE_POLICY = `상담 시작 ${CHANGE_CUTOFF_MINUTES}분 전까지는 일정 변경·취소가 무료예요`;

/** 상담 시작 시각 */
export function startsAt(b: Pick<Booking, "date" | "time">): Date {
  const [y, m, d] = b.date.split("-").map(Number);
  return new Date(y, m - 1, d, 0, toMinutes(b.time));
}

/** 시작까지 남은 분 (지났으면 음수) */
export function minutesUntil(b: Pick<Booking, "date" | "time">, now: Date): number {
  return Math.floor((startsAt(b).getTime() - now.getTime()) / 60_000);
}

/** 지금 일정 변경·취소가 가능한가 */
export function canChange(b: Booking, now: Date): boolean {
  return b.status === "upcoming" && minutesUntil(b, now) >= CHANGE_CUTOFF_MINUTES;
}

export type RoomState = "before" | "open" | "ended";

/** 상담방 상태 — 시작 10분 전부터 종료 시각까지 열린다 */
export function roomState(b: Booking, now: Date): RoomState {
  if (b.status === "done") return "ended";
  const until = minutesUntil(b, now);
  if (until > ROOM_OPENS_MINUTES) return "before";
  if (until + b.minutes > 0) return "open";
  return "ended";
}
