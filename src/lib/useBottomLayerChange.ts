"use client";

import { useEffect } from "react";

/**
 * 화면 하단 고정 요소(비교 바 등)가 나타나거나 바뀌었음을 알린다.
 * 공용 뒤로·앞으로 버튼(public/mirae-history-nav.js)은 resize 때 자리를 다시 잡으므로,
 * 그 신호를 보내 고정 요소와 겹치지 않게 한다.
 */
export function useBottomLayerChange(...deps: unknown[]) {
  useEffect(() => {
    const id = window.requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
