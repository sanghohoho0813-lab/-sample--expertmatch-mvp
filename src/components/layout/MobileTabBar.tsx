"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CalendarCheck, Home, MessageCircle, Search, User } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { cx } from "@/lib/format";

/** '마이' 탭에 속하는 마이페이지 하위 탭 — 나머지는 '예약' */
const MY_TABS = ["favorites", "recent", "profile"];

const TABS = [
  { href: "/", label: "홈", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/experts",
    label: "검색",
    icon: Search,
    match: (p: string) => p.startsWith("/experts"),
  },
  {
    href: "/mypage?tab=upcoming",
    label: "예약",
    icon: CalendarCheck,
    match: (p: string, t: string | null) =>
      p === "/booking/complete" || (p === "/mypage" && !MY_TABS.includes(t ?? "")),
  },
  { href: "/chat", label: "채팅", icon: MessageCircle, match: (p: string) => p === "/chat" },
  {
    href: "/mypage?tab=profile",
    label: "마이",
    icon: User,
    match: (p: string, t: string | null) => p === "/mypage" && MY_TABS.includes(t ?? ""),
  },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const tab = params.get("tab");
  const { bookings, ready } = useAppStore();
  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;

  // 예약 진행 중에는 하단 예약 CTA와 겹치지 않도록 숨김 (완료 화면에서는 다시 보인다)
  if (pathname.startsWith("/booking") && pathname !== "/booking/complete") return null;
  // 전문가 상세는 하단 '상담 예약하기' 바가 대신한다 (두 바가 겹쳐 경쟁하지 않도록)
  if (/^\/experts\/[^/]+$/.test(pathname)) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white/95 pb-safe backdrop-blur-md shadow-bar lg:hidden"
      aria-label="주요 메뉴"
    >
      <ul className="flex">
        {TABS.map((t) => {
          const active = t.match(pathname, tab);
          const TabIcon = t.icon;
          const isChat = t.href === "/chat";
          return (
            <li key={t.label} className="flex-1">
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative flex min-h-[56px] flex-col items-center justify-center gap-1 pt-1.5 transition-colors duration-200",
                  active ? "text-teal-700" : isChat ? "text-navy-300" : "text-navy-400",
                )}
              >
                <span className="relative">
                  <TabIcon
                    className="h-[22px] w-[22px]"
                    strokeWidth={active ? 2.4 : 1.9}
                  />
                  {t.label === "예약" && ready && upcomingCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[15.5px] font-bold text-white">
                      {upcomingCount}
                    </span>
                  )}
                </span>
                <span className="text-[17.5px] font-semibold tracking-tight">
                  {t.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
