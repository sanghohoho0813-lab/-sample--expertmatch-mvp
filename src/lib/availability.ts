import { parseDateKey, toDateKey } from "@/lib/format";

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

/** 전문가 id + 날짜로 항상 같은 결과를 내는 결정적 해시 */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export interface DayAvailability {
  dateKey: string;
  slots: string[];
  isClosed: boolean;
}

/** 해당 날짜에 예약 가능한 시간대 (결정적) */
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

/** 이번 주 요일별(월~금) 예약 가능 여부 — 날짜에 의존하지 않는 결정적 값 */
export const WEEK_LABELS = ["월", "화", "수", "목", "금"];

export function weekdayAvailability(
  expertId: string,
  availableThisWeek: boolean,
): boolean[] {
  if (!availableThisWeek) return WEEK_LABELS.map(() => false);
  const base = hash(`week:${expertId}`);
  const days = WEEK_LABELS.map((_, i) => ((base >> (i * 2)) & 3) !== 0);
  // 최소 2일은 열어둔다
  if (days.filter(Boolean).length < 2) {
    days[0] = true;
    days[2] = true;
  }
  return days;
}

/**
 * 실제로 예약 가능한 시간대.
 * 오늘 날짜는 이미 지난 시간과 임박한 시간(1시간 이내)을 제외한다.
 */
export function bookableSlots(
  expertId: string,
  dateKey: string,
  now: Date,
): string[] {
  const slots = slotsFor(expertId, dateKey);
  if (slots.length === 0 || dateKey !== toDateKey(now)) return slots;
  const cutoff = now.getHours() * 60 + now.getMinutes() + 60;
  return slots.filter((s) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m >= cutoff;
  });
}
