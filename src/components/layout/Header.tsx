"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useAppStore } from "@/lib/store/AppStore";
import { DEMO_USER } from "@/lib/data/demoUser";
import { cx } from "@/lib/format";

const NAV = [
  { href: "/experts", label: "전문가 찾기", match: (p: string) => p.startsWith("/experts") },
  { href: "/experts?panel=categories", label: "상담 분야", match: () => false },
  { href: "/#how-it-works", label: "이용방법", match: () => false },
  {
    href: "/mypage?tab=upcoming",
    label: "내 예약",
    match: (p: string) => p.startsWith("/mypage") || p.startsWith("/booking"),
  },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { favorites, ready } = useAppStore();

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
      <div className="shell flex h-16 items-center gap-3 lg:h-[72px]">
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
              <span className="block text-2xs font-semibold text-teal-700">
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
        <div className="animate-fade-in border-t border-navy-100 bg-white lg:hidden">
          <nav className="shell flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex min-h-[52px] items-center rounded-xl px-2 text-2xl font-medium text-navy-700 transition-colors hover:bg-navy-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-navy-100" />
            <Link
              href="/mypage?tab=profile"
              className="mb-3 mt-1 flex items-center gap-3 rounded-xl border border-navy-100 bg-canvas p-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-base font-extrabold text-white">
                {DEMO_USER.initials}
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block text-2xs font-semibold text-teal-700">
                  {DEMO_USER.org}
                </span>
                <span className="block text-base font-bold text-navy-900">
                  {DEMO_USER.name}님
                </span>
              </span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
