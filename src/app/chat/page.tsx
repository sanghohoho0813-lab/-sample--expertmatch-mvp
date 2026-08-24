import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Lock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "채팅",
};

export default function ChatPage() {
  return (
    <div className="shell py-12 pb-32 sm:py-20 lg:pb-20">
      <div className="mx-auto max-w-md text-center">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-navy-50">
          <MessageCircle className="h-9 w-9 text-navy-300" strokeWidth={1.8} />
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-2xl border-4 border-white bg-navy-200">
            <Lock className="h-3.5 w-3.5 text-white" strokeWidth={2.6} />
          </span>
        </div>

        <h1 className="mt-6 text-[22px] font-bold text-navy-900 sm:text-[26px]">
          상담 예약 후 이용할 수 있습니다
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-navy-500">
          예약이 확정되면 전문가와 1:1 채팅으로 사전 질문을 주고받을 수 있어요.
          <br className="hidden sm:block" />
          이번 데모에서는 채팅 기능이 제공되지 않습니다.
        </p>

        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/experts"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-teal-600 px-6 text-[15px] font-bold text-white transition-colors hover:bg-teal-700"
          >
            전문가 찾아보기
          </Link>
          <Link
            href="/mypage?tab=upcoming"
            className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white px-6 text-[15px] font-semibold text-navy-700 transition-colors hover:bg-navy-50"
          >
            <CalendarClock className="h-4 w-4" strokeWidth={2.2} />내 예약 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
