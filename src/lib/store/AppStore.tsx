"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Booking, MyReview } from "@/lib/types";

const STORAGE_KEY = "expertmatch:v1";
export const MAX_COMPARE = 3;
const MAX_RECENT = 8;

interface PersistedState {
  favorites: string[];
  compare: string[];
  bookings: Booking[];
  /** 최근 본 전문가 id (최신순) */
  recent: string[];
  /** 내가 남긴 후기 (데모) */
  myReviews: MyReview[];
}

const INITIAL: PersistedState = {
  favorites: [],
  compare: [],
  bookings: [],
  recent: [],
  myReviews: [],
};

export interface Toast {
  id: number;
  message: string;
  tone: "default" | "success" | "warn";
  action?: { label: string; href: string };
}

export type AddBookingResult = { ok: true } | { ok: false; reason: string };

interface AppStoreValue extends PersistedState {
  /** localStorage 로딩 완료 여부 (하이드레이션 안전) */
  ready: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string, name: string) => void;
  isComparing: (id: string) => boolean;
  toggleCompare: (id: string, name: string) => void;
  clearCompare: () => void;
  removeCompare: (id: string) => void;
  /** 같은 전문가·시간 중복 예약은 거부한다 */
  addBooking: (booking: Booking) => AddBookingResult;
  cancelBooking: (id: string) => void;
  /** 데모: 예정된 상담을 완료 처리 */
  completeBooking: (id: string) => void;
  addReview: (review: MyReview) => void;
  reviewFor: (bookingId: string) => MyReview | undefined;
  markViewed: (id: string) => void;
  clearRecent: () => void;
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function readStorage(): PersistedState {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      favorites: arr<string>(parsed.favorites),
      compare: arr<string>(parsed.compare).slice(0, MAX_COMPARE),
      // 이전 버전 데이터(status 없음)는 예정 상담으로 본다
      bookings: arr<Booking>(parsed.bookings).map((b) =>
        b.status === "upcoming" || b.status === "done" || b.status === "cancelled"
          ? b
          : { ...b, status: "upcoming" },
      ),
      recent: arr<string>(parsed.recent).slice(0, MAX_RECENT),
      myReviews: arr<MyReview>(parsed.myReviews),
    };
  } catch {
    return INITIAL;
  }
}

function toMin(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

let toastSeq = 0;

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(INITIAL);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // 콜백이 최신 상태를 읽을 수 있도록 — 부수효과(토스트)를 updater 밖에서 처리하기 위함
  const stateRef = useRef(state);
  stateRef.current = state;

  // 마운트 이후에만 localStorage를 읽어 서버/클라이언트 마크업 불일치를 방지
  useEffect(() => {
    const loaded = readStorage();
    stateRef.current = loaded;
    setState(loaded);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* 저장 실패는 데모 동작에 영향 없음 */
    }
  }, [state, ready]);

  const commit = useCallback((next: PersistedState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      toastSeq += 1;
      const id = toastSeq;
      setToasts((prev) => [...prev.slice(-2), { ...toast, id }]);
      window.setTimeout(() => dismissToast(id), 2800);
    },
    [dismissToast],
  );

  const toggleFavorite = useCallback(
    (id: string, name: string) => {
      const prev = stateRef.current;
      const has = prev.favorites.includes(id);
      commit({
        ...prev,
        favorites: has
          ? prev.favorites.filter((f) => f !== id)
          : [...prev.favorites, id],
      });
      pushToast({
        message: has
          ? `${name} 전문가를 찜 목록에서 제외했어요`
          : `${name} 전문가를 찜했어요`,
        tone: has ? "default" : "success",
        action: has ? undefined : { label: "찜 목록", href: "/mypage?tab=favorites" },
      });
    },
    [commit, pushToast],
  );

  const toggleCompare = useCallback(
    (id: string, name: string) => {
      const prev = stateRef.current;
      if (prev.compare.includes(id)) {
        commit({ ...prev, compare: prev.compare.filter((c) => c !== id) });
        return;
      }
      if (prev.compare.length >= MAX_COMPARE) {
        pushToast({
          message: `비교는 최대 ${MAX_COMPARE}명까지 가능해요`,
          tone: "warn",
        });
        return;
      }
      commit({ ...prev, compare: [...prev.compare, id] });
      pushToast({ message: `${name} 전문가를 비교에 담았어요`, tone: "success" });
    },
    [commit, pushToast],
  );

  const clearCompare = useCallback(() => {
    commit({ ...stateRef.current, compare: [] });
  }, [commit]);

  const removeCompare = useCallback(
    (id: string) => {
      const prev = stateRef.current;
      commit({ ...prev, compare: prev.compare.filter((c) => c !== id) });
    },
    [commit],
  );

  const markViewed = useCallback(
    (id: string) => {
      const prev = stateRef.current;
      if (prev.recent[0] === id) return;
      commit({
        ...prev,
        recent: [id, ...prev.recent.filter((r) => r !== id)].slice(0, MAX_RECENT),
      });
    },
    [commit],
  );

  const clearRecent = useCallback(() => {
    commit({ ...stateRef.current, recent: [] });
  }, [commit]);

  const addBooking = useCallback(
    (booking: Booking): AddBookingResult => {
      const prev = stateRef.current;
      const start = toMin(booking.time);
      const clash = prev.bookings.find(
        (b) =>
          b.status !== "cancelled" &&
          b.date === booking.date &&
          start < toMin(b.time) + b.minutes &&
          toMin(b.time) < start + booking.minutes,
      );
      if (clash) {
        return {
          ok: false,
          reason:
            clash.expertId === booking.expertId
              ? "방금 다른 예약이 들어온 시간이에요. 다른 시간을 선택해 주세요."
              : `같은 시간에 ${clash.expertName} 전문가 상담이 예약되어 있어요.`,
        };
      }
      commit({ ...prev, bookings: [booking, ...prev.bookings] });
      return { ok: true };
    },
    [commit],
  );

  const cancelBooking = useCallback(
    (id: string) => {
      const prev = stateRef.current;
      commit({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === id
            ? { ...b, status: "cancelled", cancelledAt: new Date().toISOString() }
            : b,
        ),
      });
      pushToast({
        message: "예약을 취소했어요. 해당 시간은 다시 예약할 수 있어요",
        tone: "default",
        action: { label: "취소 내역", href: "/mypage?tab=cancelled" },
      });
    },
    [commit, pushToast],
  );

  const completeBooking = useCallback(
    (id: string) => {
      const prev = stateRef.current;
      commit({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === id
            ? { ...b, status: "done", completedAt: new Date().toISOString() }
            : b,
        ),
      });
      pushToast({
        message: "상담을 완료 처리했어요. 후기를 남겨 보세요",
        tone: "success",
        action: { label: "완료된 상담", href: "/mypage?tab=done" },
      });
    },
    [commit, pushToast],
  );

  const addReview = useCallback(
    (review: MyReview) => {
      const prev = stateRef.current;
      commit({
        ...prev,
        myReviews: [
          review,
          ...prev.myReviews.filter((r) => r.bookingId !== review.bookingId),
        ],
      });
      pushToast({ message: "후기를 등록했어요. 감사합니다", tone: "success" });
    },
    [commit, pushToast],
  );

  const value = useMemo<AppStoreValue>(
    () => ({
      ...state,
      ready,
      isFavorite: (id) => state.favorites.includes(id),
      toggleFavorite,
      isComparing: (id) => state.compare.includes(id),
      toggleCompare,
      clearCompare,
      removeCompare,
      addBooking,
      cancelBooking,
      completeBooking,
      addReview,
      reviewFor: (bookingId) =>
        state.myReviews.find((r) => r.bookingId === bookingId),
      markViewed,
      clearRecent,
      toasts,
      pushToast,
      dismissToast,
    }),
    [
      state,
      ready,
      toggleFavorite,
      toggleCompare,
      clearCompare,
      removeCompare,
      addBooking,
      cancelBooking,
      completeBooking,
      addReview,
      markViewed,
      clearRecent,
      toasts,
      pushToast,
      dismissToast,
    ],
  );

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}

/** EM-YYYYMMDD-XXXX 형태의 예약번호 (클릭 시점에만 생성) */
export function createBookingCode(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, "0");
  const d = `${now.getDate()}`.padStart(2, "0");
  const tail = `${Math.floor(1000 + Math.random() * 9000)}`;
  return `EM-${y}${m}${d}-${tail}`;
}
