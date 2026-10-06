"use client";

import Link from "next/link";
import { CalendarClock, ChevronRight, Lock, MessageCircle } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { METHOD_LABEL } from "@/lib/data/categories";
import { effectiveStatus } from "@/lib/availability";
import { useAppStore } from "@/lib/store/AppStore";
import { useNow } from "@/lib/useAvailability";
import { dDay, formatDateKorean, formatTimeKorean } from "@/lib/format";

/**
 * 채팅 탭 — 데모에서는 실제 채팅을 제공하지 않는다.
 * 예약이 있으면 '어떤 상담의 채팅방이 언제 열리는지'를 보여 주고,
 * 없으면 예약으로 안내한다.
 */
export function ChatClient() {
  const { bookings, ready } = useAppStore();
  const now = useNow();
  const upcoming = bookings
    .filter((b) => effectiveStatus(b, now) === "upcoming")
    .sort((a, b) => (`${a.date}${a.time}` < `${b.date}${b.time}` ? -1 : 1));

  if (!ready) {
    return <div className="mx-auto h-72 max-w-md animate-pulse rounded-3xl bg-navy-100/70" />;
  }

  if (upcoming.length > 0) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="text-[32px] font-bold text-navy-900 sm:text-[38px]">상담 채팅</h1>
        <p className="mt-2 text-[20px] leading-relaxed text-navy-500">
          채팅방은 상담 시작 10분 전에 열려요. 데모에서는 채팅이 제공되지 않아요.
        </p>
        <ul className="mt-6 space-y-3">
          {upcoming.map((b) => (
            <li key={b.id}>
              <Link
                href="/mypage?tab=upcoming"
                className="flex items-center gap-3.5 rounded-2xl border border-navy-100 bg-white p-4 transition-colors hover:border-navy-300"
              >
                <Portrait
                  name={b.expertName}
                  accent={b.expertAccent}
                  photo={b.expertPhoto}
                  rounded="rounded-xl"
                  sizes="56px"
                  className="h-14 w-14 shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[22px] font-bold text-navy-900">{b.expertName} 전문가</span>
                  <span className="block text-[19px] text-navy-500">
                    {formatDateKorean(b.date)} {formatTimeKorean(b.time)} · {METHOD_LABEL[b.method]}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  {now && <span className="text-[18px] font-bold text-teal-700">{dDay(b.date, now)}</span>}
                  <span className="inline-flex items-center gap-1 text-[16.5px] text-navy-400">
                    <Lock className="h-3.5 w-3.5" strokeWidth={2.4} />
                    대기 중
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-navy-300" strokeWidth={2.2} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-navy-50">
        <MessageCircle className="h-9 w-9 text-navy-300" strokeWidth={1.8} />
      </div>
      <h1 className="mt-6 text-[32px] font-bold text-navy-900 sm:text-[38px]">예약하면 채팅이 열려요</h1>
      <p className="mt-3 text-[21px] leading-relaxed text-navy-500">
        상담을 예약하면 상담 시간에 전문가와 1:1 채팅을 할 수 있어요.
      </p>
      <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        <Link
          href="/experts"
          className="inline-flex h-14 items-center justify-center rounded-xl bg-navy-900 px-6 text-[22px] font-bold text-white transition-colors hover:bg-navy-800"
        >
          전문가 찾아보기
        </Link>
        <Link
          href="/mypage?tab=upcoming"
          className="inline-flex h-14 items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white px-6 text-[22px] font-semibold text-navy-700 transition-colors hover:bg-navy-50"
        >
          <CalendarClock className="h-4 w-4" strokeWidth={2.2} />내 예약 보기
        </Link>
      </div>
    </div>
  );
}
