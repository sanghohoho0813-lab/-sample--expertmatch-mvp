"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Booking } from "@/lib/types";

const STORAGE_KEY = "expertmatch:v1";
export const MAX_COMPARE = 3;

interface PersistedState {
  favorites: string[];
  compare: string[];
  bookings: Booking[];
}

const INITIAL: PersistedState = { favorites: [], compare: [], bookings: [] };

export interface Toast {
  id: number;
  message: string;
  tone: "default" | "success" | "warn";
  action?: { label: string; href: string };
}

interface AppStoreValue extends PersistedState {
  /** localStorage 로딩 완료 여부 (하이드레이션 안전) */
  ready: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string, name: string) => void;
  isComparing: (id: string) => boolean;
  toggleCompare: (id: string, name: string) => void;
  clearCompare: () => void;
  removeCompare: (id: string) => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  toasts: Toast[];
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

function readStorage(): PersistedState {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      compare: Array.isArray(parsed.compare)
        ? parsed.compare.slice(0, MAX_COMPARE)
        : [],
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
    };
  } catch {
    return INITIAL;
  }
}

let toastSeq = 0;

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(INITIAL);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // 마운트 이후에만 localStorage를 읽어 서버/클라이언트 마크업 불일치를 방지
  useEffect(() => {
    setState(readStorage());
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
      setState((prev) => {
        const has = prev.favorites.includes(id);
        pushToast({
          message: has
            ? `${name} 전문가를 찜 목록에서 제외했어요`
            : `${name} 전문가를 찜했어요`,
          tone: has ? "default" : "success",
          action: has ? undefined : { label: "찜 목록", href: "/mypage?tab=favorites" },
        });
        return {
          ...prev,
          favorites: has
            ? prev.favorites.filter((f) => f !== id)
            : [...prev.favorites, id],
        };
      });
    },
    [pushToast],
  );

  const toggleCompare = useCallback(
    (id: string, name: string) => {
      setState((prev) => {
        const has = prev.compare.includes(id);
        if (has) {
          return { ...prev, compare: prev.compare.filter((c) => c !== id) };
        }
        if (prev.compare.length >= MAX_COMPARE) {
          pushToast({
            message: `비교는 최대 ${MAX_COMPARE}명까지 가능해요`,
            tone: "warn",
          });
          return prev;
        }
        pushToast({
          message: `${name} 전문가를 비교에 담았어요`,
          tone: "success",
        });
        return { ...prev, compare: [...prev.compare, id] };
      });
    },
    [pushToast],
  );

  const clearCompare = useCallback(() => {
    setState((prev) => ({ ...prev, compare: [] }));
  }, []);

  const removeCompare = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      compare: prev.compare.filter((c) => c !== id),
    }));
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setState((prev) => ({ ...prev, bookings: [booking, ...prev.bookings] }));
  }, []);

  const cancelBooking = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        bookings: prev.bookings.filter((b) => b.id !== id),
      }));
      pushToast({ message: "예약을 취소했어요", tone: "default" });
    },
    [pushToast],
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
