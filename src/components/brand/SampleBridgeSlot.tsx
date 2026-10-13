"use client";

import { usePathname } from "next/navigation";
import { SampleBridgeCTA } from "@/components/brand/SampleBridgeCTA";

/**
 * 예약 진행 중·맞춤 찾기 질문 중에는 한 가지 선택에 집중하도록
 * 브릿지 CTA가 경쟁하지 않게 숨긴다. (예약 완료·추천 결과 화면에는 노출)
 */
const HIDDEN_PATHS = [/^\/booking\/(?!complete)[^/]+$/, /^\/match$/];

/**
 * 모든 샘플 페이지 하단(푸터 위)에 공통 CTA를 배치하는 슬롯.
 * 레이아웃에서 한 번만 렌더링해 전 페이지에 일관되게 노출된다.
 */
export function SampleBridgeSlot() {
  const pathname = usePathname();
  if (HIDDEN_PATHS.some((re) => re.test(pathname))) return null;
  return <SampleBridgeCTA />;
}
