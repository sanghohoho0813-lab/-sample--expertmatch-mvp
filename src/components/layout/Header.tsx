"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarCheck,
  ChevronRight,
  DoorOpen,
  GitCompareArrows,
  Heart,
  History,
  LayoutGrid,
  ListChecks,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useAppStore } from "@/lib/store/AppStore";
import { DEMO_USER } from "@/lib/data/demoUser";
import { cx } from "@/lib/format";

const NAV = [
  { href: "/experts", label: "전문가 찾기", match: (p: string) => p.startsWith("/experts") },
  { href: "/match", label: "맞춤 찾기", match: (p: string) => p.startsWith("/match") },
  { href: "/experts?panel=categories", label: "상담 분야", match: () => false },
  {
    href: "/mypage?tab=upcoming",
    label: "내 예약",
    match: (p: string) => p.startsWith("/mypage") || p.startsWith("/booking"),
  },
];

/** 모바일 전체 메뉴 — 이름 아래 한 줄 설명으로 어디로 가는지 알려 준다 */
const MENU = [
  { href: "/experts", label: "전문가 찾기", hint: "분야·고민·이름으로 검색", icon: Search },
  { href: "/match", label: "맞춤 찾기", hint: "질문 5개로 맞는 전문가 추천", icon: ListChecks },
  { href: "/experts?panel=categories", label: "상담 분야", hint: "10개 분야 한눈에 보기", icon: LayoutGrid },
  { href: "/compare", label: "전문가 비교", hint: "담아 둔 전문가 나란히 보기", icon: GitCompareArrows },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { favorites, bookings, ready } = useAppStore();
  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b bg-white transition-shadow duration-200",
        scrolled ? "border-navy-100 shadow-[0_1px_16px_-8px_rgba(11,26,51,0.25)]" : "border-transparent",
      )}
    >
      <div className="shell flex h-14 items-center gap-3 lg:h-16">
        <Logo />

        <nav className="ml-4 hidden items-center gap-0.5 lg:flex xl:ml-8 xl:gap-1">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative whitespace-nowrap rounded-lg px-2.5 py-2 text-md transition-colors duration-200 hover:bg-navy-50 hover:text-navy-900 xl:px-3 xl:text-lg",
                  active ? "font-bold text-navy-900" : "font-medium text-navy-500",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-2.5 -bottom-[13px] h-[3px] rounded-full bg-teal-600 xl:inset-x-3" aria-hidden />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            href="/experts?focus=search"
            aria-label="전문가 검색"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900 lg:hidden"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link
            href="/mypage?tab=favorites"
            aria-label="찜한 전문가"
            className="relative hidden h-11 w-11 items-center justify-center rounded-xl text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900 lg:flex"
          >
            <Heart className="h-5 w-5" />
            {ready && favorites.length > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-2xs font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link
            href="/mypage?tab=profile"
            aria-label={`${DEMO_USER.displayName}님 프로필`}
            className="hidden items-center gap-2.5 rounded-xl border border-navy-100 p-1.5 transition-colors hover:border-navy-200 hover:bg-navy-50 lg:inline-flex xl:pr-3.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-base font-extrabold text-white">
              {DEMO_USER.initials}
            </span>
            <span className="hidden leading-tight xl:block">
              <span className="block text-xs font-semibold text-teal-700">
                {DEMO_USER.org}
              </span>
              <span className="block text-sm font-bold text-navy-800">
                {DEMO_USER.name}님
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-navy-700 transition-colors hover:bg-navy-50 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade-in max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-navy-100 bg-white lg:hidden">
          <nav className="shell py-4" aria-label="전체 메뉴">
            <Link
              href="/mypage?tab=profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-2xl bg-navy-900 p-4 text-white"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-lg font-extrabold">
                {DEMO_USER.initials}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block text-sm font-semibold text-teal-300">{DEMO_USER.org}</span>
                <span className="mt-0.5 block text-xl font-bold">{DEMO_USER.name}님</span>
              </span>
              <span className="inline-flex shrink-0 items-center text-base font-semibold text-navy-200">
                프로필
                <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
              </span>
            </Link>

            {/* 자주 찾는 곳 — 개수가 있으면 함께 */}
            <ul className="mt-3 grid grid-cols-4 gap-2">
              {[
                { href: "/mypage?tab=upcoming", label: "내 예약", icon: CalendarCheck, count: upcomingCount },
                { href: "/mypage?tab=favorites", label: "찜", icon: Heart, count: favorites.length },
                { href: "/mypage?tab=recent", label: "최근 본", icon: History, count: null },
                { href: "/chat", label: "상담방", icon: DoorOpen, count: null },
              ].map((q) => {
                const QIcon = q.icon;
                return (
                  <li key={q.label}>
                    <Link
                      href={q.href}
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-center gap-1.5 rounded-2xl bg-canvas px-1 py-3 text-navy-700 transition-colors hover:bg-navy-50"
                    >
                      <span className="relative">
                        <QIcon className="h-6 w-6" strokeWidth={1.9} />
                        {ready && q.count !== null && q.count > 0 && (
                          <span className="absolute -right-2.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1 text-2xs font-bold text-white">
                            {q.count}
                          </span>
                        )}
                      </span>
                      <span className="whitespace-nowrap text-base font-semibold">{q.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className="mt-3 divide-y divide-navy-100">
              {MENU.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[64px] items-center gap-3.5 py-2"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                        <ItemIcon className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xl font-semibold text-navy-900">{item.label}</span>
                        <span className="block text-base text-navy-500">{item.hint}</span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-navy-300" strokeWidth={2.2} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
