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
import { clashMessage, findClash } from "@/lib/bookingRules";
import {
  INITIAL_STATE,
  MAX_COMPARE,
  MAX_RECENT,
  STORAGE_KEY,
  parsePersisted,
  type PersistedState,
} from "@/lib/store/persist";

export { MAX_COMPARE } from "@/lib/store/persist";
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

function readStorage(): PersistedState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    return parsePersisted(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // 사파리 개인정보 보호 모드 등 저장소 접근 자체가 막힌 경우
    return INITIAL_STATE;
  }
}

let toastSeq = 0;

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(INITIAL_STATE);
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

  // 다른 탭에서 예약·찜을 바꾸면 이 탭에도 반영한다 (같은 시간 중복 예약 방지)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = parsePersisted(e.newValue);
      stateRef.current = next;
      setState(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const warnedRef = useRef(false);
  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 저장 공간이 없거나 막힌 경우 — 이 탭에서는 계속 동작하지만 새로고침하면 사라짐을 한 번 알린다
      if (!warnedRef.current) {
        warnedRef.current = true;
        pushToastRef.current?.({
          message: "브라우저 저장소를 쓸 수 없어 새로고침하면 기록이 사라져요",
          tone: "warn",
        });
      }
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
      setToasts([{ ...toast, id }]);
      window.setTimeout(() => dismissToast(id), 2800);
    },
    [dismissToast],
  );

  const pushToastRef = useRef(pushToast);
  pushToastRef.current = pushToast;

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
      const clash = findClash(prev.bookings, booking);
      if (clash) return { ok: false, reason: clashMessage(clash, booking) };
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
