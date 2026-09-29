"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cx } from "@/lib/format";

/** 긴 페이지에서 상단으로 빠르게 돌아가는 버튼 */
export function ScrollTop() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);
  const [raised, setRaised] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShown(window.scrollY > 900);
      // 하단 고정 바(비교 바·예약 CTA)와 겹치지 않도록
      const nearBottom =
        window.innerHeight + window.scrollY > document.body.scrollHeight - 240;
      setRaised(nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 예약 플로우는 하단이 CTA로 가득 차 있어 노출하지 않는다
  if (pathname.startsWith("/booking")) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="맨 위로 이동"
      className={cx(
        "fixed right-4 z-30 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-navy-100 bg-white text-navy-600 shadow-pop transition-all duration-300 hover:border-navy-300 hover:text-navy-900 lg:right-8",
        shown
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
        raised ? "bottom-[168px] lg:bottom-28" : "bottom-[96px] lg:bottom-8",
      )}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
    </button>
  );
}
