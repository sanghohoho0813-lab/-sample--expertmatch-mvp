"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store/AppStore";

/** 전문가 상세 진입을 최근 본 목록에 기록 */
export function TrackView({ expertId }: { expertId: string }) {
  const { markViewed, ready } = useAppStore();
  useEffect(() => {
    if (ready) markViewed(expertId);
  }, [ready, expertId, markViewed]);
  return null;
}
