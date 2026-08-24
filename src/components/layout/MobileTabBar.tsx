"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CalendarCheck, Home, MessageCircle, Search, User } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { cx } from "@/lib/format";

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
    match: (p: string, t: string | null) => p === "/mypage" && t !== "favorites" && t !== "profile",
  },
  { href: "/chat", label: "채팅", icon: MessageCircle, match: (p: string) => p === "/chat" },
  {
    href: "/mypage?tab=profile",
    label: "마이",
    icon: User,
    match: (p: string, t: string | null) => p === "/mypage" && t === "profile",
  },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const tab = params.get("tab");
  const { bookings, ready } = useAppStore();

  // 예약 플로우에서는 하단 CTA와 겹치지 않도록 숨김
  if (pathname.startsWith("/booking")) return null;

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
                  {t.label === "예약" && ready && bookings.length > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[13px] font-bold text-white">
                      {bookings.length}
                    </span>
                  )}
                </span>
                <span className="text-[14.5px] font-semibold tracking-tight">
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
