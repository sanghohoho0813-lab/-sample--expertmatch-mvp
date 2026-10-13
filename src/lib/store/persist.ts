import { EXPERT_MAP } from "@/lib/data/experts";
import { needsFromParams, type Needs } from "@/lib/needs";
import type { Booking, BookingStatus, ConsultMethod, MyReview } from "@/lib/types";

export const STORAGE_KEY = "expertmatch:v1";
export const MAX_COMPARE = 3;
export const MAX_RECENT = 8;

export interface PersistedState {
  favorites: string[];
  compare: string[];
  bookings: Booking[];
  /** 최근 본 전문가 id (최신순) */
  recent: string[];
  /** 내가 남긴 후기 (데모) */
  myReviews: MyReview[];
  /** 마지막 맞춤 찾기 답변 — 예약할 때 상담 방식·고민 메모를 미리 채운다 */
  needs: Needs | null;
}

export const INITIAL_STATE: PersistedState = {
  favorites: [],
  compare: [],
  bookings: [],
  recent: [],
  myReviews: [],
  needs: null,
};

const METHODS: ConsultMethod[] = ["video", "phone", "chat"];
const STATUSES: BookingStatus[] = ["upcoming", "done", "cancelled"];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string" && v.length > 0;
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** 존재하는 전문가 id 만, 중복 없이 */
function expertIds(v: unknown, max = Infinity): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const id of v) {
    if (isStr(id) && EXPERT_MAP[id] && !out.includes(id)) out.push(id);
    if (out.length >= max) break;
  }
  return out;
}

/** 손상되었거나 예전 형식인 예약은 고치거나 버린다 */
export function toBooking(v: unknown): Booking | null {
  if (!isObj(v)) return null;
  const required = ["id", "code", "expertId", "expertName", "productId", "productName", "date", "time"];
  if (!required.every((k) => isStr(v[k]))) return null;
  if (!DATE_RE.test(v.date as string) || !TIME_RE.test(v.time as string)) return null;
  if (!isNum(v.minutes) || !isNum(v.price)) return null;
  if (!METHODS.includes(v.method as ConsultMethod)) return null;
  return {
    ...(v as unknown as Booking),
    expertTitle: typeof v.expertTitle === "string" ? v.expertTitle : "",
    expertAccent: isNum(v.expertAccent) ? v.expertAccent : 0,
    categoryName: typeof v.categoryName === "string" ? v.categoryName : "",
    note: typeof v.note === "string" ? v.note : "",
    createdAt: isStr(v.createdAt) ? v.createdAt : new Date(0).toISOString(),
    // 상태가 없던 이전 버전 데이터는 예정 상담으로 본다
    status: STATUSES.includes(v.status as BookingStatus) ? (v.status as BookingStatus) : "upcoming",
    prepDone: Array.isArray(v.prepDone) ? v.prepDone.filter(isStr) : undefined,
    rescheduledFrom:
      isObj(v.rescheduledFrom) &&
      isStr(v.rescheduledFrom.date) &&
      isStr(v.rescheduledFrom.time) &&
      DATE_RE.test(v.rescheduledFrom.date) &&
      TIME_RE.test(v.rescheduledFrom.time)
        ? { date: v.rescheduledFrom.date, time: v.rescheduledFrom.time }
        : undefined,
    rebookOf: isStr(v.rebookOf) ? v.rebookOf : undefined,
  };
}

function toReview(v: unknown): MyReview | null {
  if (!isObj(v)) return null;
  if (!isStr(v.id) || !isStr(v.bookingId) || !isStr(v.expertId) || !isStr(v.body)) return null;
  if (!isNum(v.rating) || v.rating < 1 || v.rating > 5) return null;
  return v as unknown as MyReview;
}

function toNeeds(v: unknown): Needs | null {
  if (!isObj(v)) return null;
  const params = new URLSearchParams();
  for (const k of ["topic", "who", "method", "budget", "when"]) {
    if (typeof v[k] === "string" || typeof v[k] === "number") params.set(k, String(v[k]));
  }
  const needs = needsFromParams(params);
  return { ...needs, memo: typeof v.memo === "string" ? v.memo.slice(0, 300) : undefined };
}

/**
 * localStorage 문자열 → 안전한 상태.
 * 직접 수정되었거나 다른 버전의 데이터가 들어와도 화면이 깨지지 않도록 항목 단위로 검증한다.
 */
export function parsePersisted(raw: string | null): PersistedState {
  if (!raw) return INITIAL_STATE;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return INITIAL_STATE;
  }
  if (!isObj(parsed)) return INITIAL_STATE;
  const list = <T,>(v: unknown, fn: (x: unknown) => T | null): T[] =>
    Array.isArray(v) ? v.map(fn).filter((x): x is T => x !== null) : [];
  return {
    favorites: expertIds(parsed.favorites),
    compare: expertIds(parsed.compare, MAX_COMPARE),
    recent: expertIds(parsed.recent, MAX_RECENT),
    bookings: list(parsed.bookings, toBooking),
    myReviews: list(parsed.myReviews, toReview),
    needs: toNeeds(parsed.needs),
  };
}
