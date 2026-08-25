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
      <div className="shell flex min-h-[46px] flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
        <p className="flex items-center gap-2.5 text-[17px] font-medium text-[#c9d6dc]">
          <MiraeSymbol className="h-6 shrink-0" />
          <span>
            <span className="font-bold text-white">미래에이아이랩</span>이 제작한
            서비스 레퍼런스 데모입니다
          </span>
        </p>
        <Link
          href="/about"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[16.5px] font-semibold text-[#19c6f4] transition-colors hover:bg-white/10"
        >
          제작사 소개
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
        </Link>
      </div>
    </div>
  );
}
