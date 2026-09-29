export function formatPrice(value: number): string {
  return value.toLocaleString("ko-KR");
}

export function formatPriceWon(value: number): string {
  return `${formatPrice(value)}원`;
}

export function formatCount(value: number): string {
  return value.toLocaleString("ko-KR");
}

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function weekdayOf(key: string): string {
  return WEEKDAY[parseDateKey(key).getDay()];
}

/** 2026-08-24 → 8월 24일 (월) */
export function formatDateKorean(key: string): string {
  const d = parseDateKey(key);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAY[d.getDay()]})`;
}

/** 2026-08-24 → 2026년 8월 24일 (월) */
export function formatDateFull(key: string): string {
  const d = parseDateKey(key);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAY[d.getDay()]})`;
}

/** 14:30 → 오후 2:30 */
export function formatTimeKorean(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const meridiem = h < 12 ? "오전" : "오후";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${meridiem} ${hour12}:${`${m}`.padStart(2, "0")}`;
}

/** 상대 시간: 2026-08-12 → 12일 전 */
export function relativeDay(dateKey: string, today: Date): string {
  const diff = Math.round(
    (today.getTime() - parseDateKey(dateKey).getTime()) / 86400000,
  );
  if (diff <= 0) return "오늘";
  if (diff === 1) return "어제";
  if (diff < 7) return `${diff}일 전`;
  if (diff < 30) return `${Math.floor(diff / 7)}주 전`;
  if (diff < 365) return `${Math.floor(diff / 30)}개월 전`;
  return `${Math.floor(diff / 365)}년 전`;
}

export function responseLabel(minutes: number): string {
  if (minutes < 60) return `평균 ${minutes}분 내 응답`;
  return `평균 ${Math.round(minutes / 60)}시간 내 응답`;
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * 예약 시간을 사람이 읽기 쉽게: 오늘 오후 3:00 / 내일 오전 10:00 / 10월 2일 (목) 오후 2:00
 */
export function formatSlotLabel(
  dateKey: string,
  time: string,
  now: Date,
): string {
  const today = toDateKey(now);
  const t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const tomorrow = toDateKey(t);
  const clock = formatTimeKorean(time);
  if (dateKey === today) return `오늘 ${clock}`;
  if (dateKey === tomorrow) return `내일 ${clock}`;
  return `${formatDateKorean(dateKey)} ${clock}`;
}

/** 상담일까지 남은 날짜: D-DAY / D-3 */
export function dDay(dateKey: string, now: Date): string {
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round(
    (parseDateKey(dateKey).getTime() - base.getTime()) / 86400000,
  );
  if (diff <= 0) return "D-DAY";
  return `D-${diff}`;
}
