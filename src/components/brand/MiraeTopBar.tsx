import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MiraeSymbol } from "@/components/brand/MiraeLogo";

/**
 * 모든 페이지 최상단에 노출되는 제작사 표기 바.
 * 이 데모가 미래에이아이랩의 레퍼런스 작업물임을 한눈에 알 수 있게 한다.
 */
export function MiraeTopBar() {
  return (
    <div className="relative z-[60] bg-[#071a22] text-white">
      {/* 모바일에서도 한 줄로 유지 — 본문이 최대한 빨리 보이도록 */}
      <div className="shell flex h-10 items-center justify-between gap-3 sm:h-[46px]">
        <p className="flex min-w-0 items-center gap-2 text-[15.5px] font-medium text-[#c9d6dc] sm:gap-2.5 sm:text-[16.5px]">
          <MiraeSymbol className="h-6 shrink-0 sm:h-7" />
          <span className="truncate">
            <span className="font-bold text-white">미래에이아이랩</span>
            <span className="hidden sm:inline">이 제작한 서비스 레퍼런스 데모입니다</span>
            <span className="sm:hidden"> 제작 샘플</span>
          </span>
        </p>
        <Link
          href="/about"
          className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg px-2 text-[15.5px] font-semibold text-teal-300 transition-colors hover:bg-white/10 sm:text-[16px]"
        >
          <span className="sm:hidden">소개</span>
          <span className="hidden sm:inline">제작사 소개</span>
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
        </Link>
      </div>
    </div>
  );
}
