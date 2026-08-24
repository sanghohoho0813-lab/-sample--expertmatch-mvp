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

/** 오늘부터 n일간의 예약 가능 현황 */
export function buildCalendar(
  expertId: string,
  from: Date,
  days: number,
): DayAvailability[] {
  const out: DayAvailability[] = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const dateKey = toDateKey(d);
    const slots = slotsFor(expertId, dateKey);
    out.push({ dateKey, slots, isClosed: slots.length === 0 });
  }
  return out;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
