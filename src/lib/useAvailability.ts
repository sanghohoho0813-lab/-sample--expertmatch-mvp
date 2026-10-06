"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  earliestSlot,
  openSlotCount,
  openSlots,
  slotStates,
  type EarliestSlot,
} from "@/lib/availability";
import { useAppStore } from "@/lib/store/AppStore";
import type { Expert } from "@/lib/types";

/**
 * 현재 시각. 서버 렌더와 클라이언트 첫 렌더가 달라지지 않도록
 * 마운트 이후에만 값을 채우고, 1분마다 갱신한다.
 */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/** 전문가의 가장 짧은 상담 시간 — 카드/비교의 가능 시간 계산 기준 */
export function shortestMinutes(expert: Expert): number {
  return expert.products.reduce((m, p) => Math.min(m, p.minutes), Infinity);
}

/**
 * 한 전문가의 예약 가능 요약 (저장된 예약을 반영).
 * 저장소 로딩 전이나 서버 렌더 중에는 null 을 돌려준다.
 */
export function useExpertAvailability(
  expert: Expert,
  /** 특정 상품 길이 기준으로 볼 때 (기본: 가장 짧은 상품) */
  minutes?: number,
): {
  earliest: EarliestSlot | null;
  weekCount: number;
  now: Date;
} | null {
  const now = useNow();
  const { bookings, ready } = useAppStore();
  return useMemo(() => {
    if (!now || !ready) return null;
    const m = minutes ?? shortestMinutes(expert);
    return {
      earliest: earliestSlot(expert.id, now, bookings, m),
      weekCount: openSlotCount(expert.id, now, bookings, m, 7),
      now,
    };
  }, [expert, minutes, now, ready, bookings]);
}

/** 예약 플로우용 — 선택한 상품 길이 기준으로 날짜·시간 가능 여부를 계산 */
export function useSlotPicker(expertId: string, minutes: number) {
  const now = useNow();
  const { bookings, ready } = useAppStore();

  const getOpen = useCallback(
    (dateKey: string) =>
      now && ready ? openSlots(expertId, dateKey, now, bookings, minutes) : [],
    [expertId, minutes, now, ready, bookings],
  );

  const getStates = useCallback(
    (dateKey: string) =>
      now && ready ? slotStates(expertId, dateKey, now, bookings, minutes) : [],
    [expertId, minutes, now, ready, bookings],
  );

  return { now: now && ready ? now : null, getOpen, getStates };
}
