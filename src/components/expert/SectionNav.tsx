"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/format";

/** 헤더 + 이 줄의 높이 — 이 선을 지난 섹션을 '지금 보는 섹션'으로 본다 */
const OFFSET = 140;

/**
 * 상세의 섹션 바로가기 — 스크롤해도 위에 붙어 있고, 지금 읽는 섹션을 표시한다.
 * (긴 상세에서 '어디쯤인지'와 '어디로 갈 수 있는지'를 함께 알려 준다)
 */
export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top - OFFSET <= 0) current = s.id;
      }
      // 맨 아래에 닿으면 마지막 섹션
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1]?.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sections]);

  // 모바일 가로 스크롤 줄에서 현재 탭이 보이도록
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    if (!list || !link) return;
    const left = link.offsetLeft - 16;
    const right = link.offsetLeft + link.offsetWidth - list.clientWidth + 16;
    if (list.scrollLeft > left) list.scrollTo({ left, behavior: "smooth" });
    else if (list.scrollLeft < right) list.scrollTo({ left: right, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="상세 정보 바로가기"
      className="sticky top-16 z-30 -mx-5 border-b border-navy-100 bg-white/95 backdrop-blur-md sm:-mx-6 lg:top-[72px] lg:col-start-1 lg:row-start-2 lg:mx-0"
    >
      <ul ref={listRef} className="relative no-scrollbar flex gap-1 overflow-x-auto px-3 sm:px-4 lg:px-0">
        {sections.map((sec, i) => {
          const on = sec.id === active;
          return (
            <li key={sec.id} className="shrink-0">
              <a
                href={`#${sec.id}`}
                aria-current={on ? "location" : undefined}
                className={cx(
                  "relative inline-flex min-h-[52px] items-center px-2.5 text-base font-semibold transition-colors lg:first:pl-0",
                  on ? "text-navy-900" : "text-navy-400 hover:text-navy-800",
                )}
              >
                {sec.label}
                {on && (
                  <span
                    className={cx("absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-teal-600", i === 0 && "lg:left-0")}
                    aria-hidden
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
