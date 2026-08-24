"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store/AppStore";
import { cx } from "@/lib/format";

const NAV = [
  { href: "/experts", label: "전문가 찾기" },
  { href: "/experts?panel=categories", label: "상담 분야" },
  { href: "/#how-it-works", label: "이용방법" },
  { href: "/#reviews", label: "커뮤니티" },
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
        "sticky top-0 z-50 border-b bg-white/92 backdrop-blur-md transition-shadow duration-200",
        scrolled ? "border-navy-100 shadow-[0_1px_16px_-8px_rgba(11,26,51,0.25)]" : "border-transparent",
      )}
    >
      <div className="shell flex h-16 items-center gap-3 lg:h-[72px]">
        <Logo />

        <nav className="ml-8 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-3 py-2 text-[20px] font-medium text-navy-600 transition-colors duration-200 hover:bg-navy-50 hover:text-navy-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            href="/experts"
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
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-600 px-1 text-[13px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link
            href="/mypage"
            className="hidden rounded-lg px-3 py-2 text-[20px] font-medium text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900 lg:block"
          >
            로그인
          </Link>
          <ButtonLink href="/experts" size="sm" className="hidden lg:inline-flex">
            회원가입
          </ButtonLink>

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
                className="flex min-h-[52px] items-center rounded-xl px-2 text-[21px] font-medium text-navy-700 transition-colors hover:bg-navy-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-navy-100" />
            <div className="flex gap-2 pb-3">
              <ButtonLink href="/mypage" variant="outline" size="md" className="flex-1">
                로그인
              </ButtonLink>
              <ButtonLink href="/experts" size="md" className="flex-1">
                회원가입
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
