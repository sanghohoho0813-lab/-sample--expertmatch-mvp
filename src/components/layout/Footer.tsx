"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { MIRAE_LINKS } from "@/lib/mirae";

const COLUMNS = [
  {
    title: "서비스",
    links: [
      { label: "전문가 찾기", href: "/experts" },
      { label: "상담 분야", href: "/experts?panel=categories" },
      { label: "이용방법", href: "/#how-it-works" },
      { label: "내 예약", href: "/mypage?tab=upcoming" },
    ],
  },
  {
    title: "인기 분야",
    links: [
      { label: "창업 상담", href: "/experts?category=startup" },
      { label: "마케팅 상담", href: "/experts?category=marketing" },
      { label: "투자유치 상담", href: "/experts?category=investment" },
      { label: "세무 상담", href: "/experts?category=tax" },
    ],
  },
];

/** 예약 진행 중에는 단계에 집중하도록 푸터를 숨긴다 (완료 화면에는 노출) */
const HIDDEN = /^\/booking\/(?!complete)[^/]+$/;

export function Footer() {
  const pathname = usePathname();
  if (HIDDEN.test(pathname)) return null;

  return (
    <footer className="mt-12 border-t border-navy-100 bg-white pb-24 lg:mt-16 lg:pb-0">
      <div className="shell py-10 lg:py-12">
        <div className="grid gap-8 sm:grid-cols-[1.3fr_1fr_1fr] lg:gap-12">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-[20px] leading-relaxed text-navy-500">
              검증된 전문가를 찾아 바로 상담을 예약하세요.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:contents">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-[20px] font-bold text-navy-900">{col.title}</h3>
                <ul className="mt-3 space-y-1">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-[40px] items-center text-[20px] text-navy-500 transition-colors duration-200 hover:text-navy-900"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-navy-100 pt-6 text-[18px] text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 <span className="font-semibold text-navy-600">미래에이아이랩</span> · (sample)
            ExpertMatch · 전문가 정보와 후기는 예시 데이터입니다.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="inline-flex min-h-[40px] items-center font-semibold text-navy-600 hover:text-navy-900">
              제작사 소개
            </Link>
            <a
              href={MIRAE_LINKS.home}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1 font-semibold text-navy-600 hover:text-navy-900"
            >
              미래에이아이랩
              <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
