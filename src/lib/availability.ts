import { EXPERT_MAP } from "@/lib/data/experts";
import { parseDateKey, toDateKey } from "@/lib/format";
import type { Booking } from "@/lib/types";

/**
 * 예약 가능 시간의 단일 출처.
 *
 * 카드의 "가장 빠른 예약", 상세의 일정 미리보기, 예약 달력, 비교표가
 * 모두 이 파일의 함수를 거치므로 화면마다 숫자가 달라지지 않는다.
 */

const ALL_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

/** 예약 가능 기간 (오늘부터 n일) */
export const BOOKING_HORIZON_DAYS = 42;

/** availableThisWeek=false 인 전문가가 예약을 받지 않는 기간 */
const CLOSED_WINDOW_DAYS = 7;

/** 전문가 id + 날짜로 항상 같은 결과를 내는 결정적 해시 */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** 해당 날짜의 운영 시간표 (결정적, 예약 여부와 무관) */
export function slotsFor(expertId: string, dateKey: string): string[] {
  const day = parseDateKey(dateKey).getDay();
  // 일요일 휴무
  if (day === 0) return [];
  const base = hash(`${expertId}:${dateKey}`);
  // 토요일은 오전 위주로 축소 운영
  const pool = day === 6 ? ALL_SLOTS.slice(0, 5) : ALL_SLOTS;
  const slots = pool.filter((_, i) => ((base >> i) & 1) === 1);
  // 최소 2개는 열어두되, 특정 날짜(해시 기준 12%)는 마감 처리
  if (base % 100 < 12) return [];
  if (slots.length < 2) return pool.slice(0, 3);
  return slots;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function daysBetween(from: Date, dateKey: string): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((parseDateKey(dateKey).getTime() - a.getTime()) / 86400000);
}

/**
 * 시간 흐름만 반영한 예약 가능 시간.
 * - 지난 날짜, 예약 가능 기간 밖은 제외
 * - 오늘은 이미 지난 시간과 1시간 이내 임박한 시간을 제외
 * - availableThisWeek=false 전문가는 오늘부터 7일간 제외
 */
export function bookableSlots(
  expertId: string,
  dateKey: string,
  now: Date,
): string[] {
  const offset = daysBetween(now, dateKey);
  if (offset < 0 || offset > BOOKING_HORIZON_DAYS) return [];

  const expert = EXPERT_MAP[expertId];
  if (expert && !expert.availableThisWeek && offset < CLOSED_WINDOW_DAYS) {
    return [];
  }

  const slots = slotsFor(expertId, dateKey);
  if (slots.length === 0 || dateKey !== toDateKey(now)) return slots;
  const cutoff = now.getHours() * 60 + now.getMinutes() + 60;
  return slots.filter((s) => toMinutes(s) >= cutoff);
}

/** 취소되지 않은 예약만 일정을 점유한다 */
function activeBookings(bookings: Booking[]): Booking[] {
  return bookings.filter((b) => b.status !== "cancelled");
}

function overlaps(
  startA: number,
  lenA: number,
  startB: number,
  lenB: number,
): boolean {
  return startA < startB + lenB && startB < startA + lenA;
}

export type SlotState = "open" | "taken" | "mine";

/**
 * 시간대별 상태.
 * - taken: 이 전문가에게 이미 겹치는 예약이 있음 (중복 예약 방지)
 * - mine:  내가 같은 시간대에 다른 상담을 예약해 둠
 */
export function slotStates(
  expertId: string,
  dateKey: string,
  now: Date,
  bookings: Booking[],
  minutes: number,
): { time: string; state: SlotState }[] {
  const active = activeBookings(bookings).filter((b) => b.date === dateKey);
  return bookableSlots(expertId, dateKey, now).map((time) => {
    const start = toMinutes(time);
    const expertBusy = active.some(
      (b) =>
        b.expertId === expertId &&
        overlaps(start, minutes, toMinutes(b.time), b.minutes),
    );
    if (expertBusy) return { time, state: "taken" as const };
    const mine = active.some((b) =>
      overlaps(start, minutes, toMinutes(b.time), b.minutes),
    );
    return { time, state: mine ? ("mine" as const) : ("open" as const) };
  });
}

/** 실제로 예약할 수 있는 시간만 */
export function openSlots(
  expertId: string,
  dateKey: string,
  now: Date,
  bookings: Booking[],
  minutes: number,
): string[] {
  return slotStates(expertId, dateKey, now, bookings, minutes)
    .filter((s) => s.state === "open")
    .map((s) => s.time);
}

export interface EarliestSlot {
  dateKey: string;
  time: string;
}

/** 가장 빠른 예약 가능 시간 */
export function earliestSlot(
  expertId: string,
  now: Date,
  bookings: Booking[],
  minutes: number,
): EarliestSlot | null {
  for (let i = 0; i <= BOOKING_HORIZON_DAYS; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const dateKey = toDateKey(d);
    const slots = openSlots(expertId, dateKey, now, bookings, minutes);
    if (slots.length > 0) return { dateKey, time: slots[0] };
  }
  return null;
}

/** 오늘부터 n일 동안 예약 가능한 시간 수 */
export function openSlotCount(
  expertId: string,
  now: Date,
  bookings: Booking[],
  minutes: number,
  days = 7,
): number {
  let total = 0;
  for (let i = 0; i < days; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    total += openSlots(expertId, toDateKey(d), now, bookings, minutes).length;
  }
  return total;
}

/** 상담 종료 시각이 지났는지 */
export function hasEnded(b: Booking, now: Date): boolean {
  const end = parseDateKey(b.date);
  end.setMinutes(toMinutes(b.time) + b.minutes);
  return end.getTime() <= now.getTime();
}

/** 화면에 보여줄 실제 상태 — 시간이 지난 예정 상담은 완료로 본다 */
export function effectiveStatus(b: Booking, now: Date | null) {
  if (b.status !== "upcoming") return b.status;
  if (now && hasEnded(b, now)) return "done" as const;
  return "upcoming" as const;
}
