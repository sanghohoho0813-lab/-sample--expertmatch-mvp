"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  CalendarCheck,
  CalendarPlus,
  Check,
  ChevronDown,
  ClipboardList,
  Copy,
  Home,
  Ticket,
  UserRound,
} from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { METHOD_LABEL } from "@/lib/data/categories";
import { useAppStore } from "@/lib/store/AppStore";
import { cx, dDay, formatDateFull, formatPrice, formatTimeKorean } from "@/lib/format";
import { downloadIcs, PREP_CHECKLIST, PREP_COMMON } from "@/lib/prep";
import { useNow } from "@/lib/useAvailability";

function SuccessMark() {
  return (
    <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
      <span
        className="absolute inset-0 rounded-full bg-teal-500/25 animate-ring-pulse [animation-iteration-count:2]"
        aria-hidden
      />
      <span className="relative flex h-20 w-20 animate-pop-in items-center justify-center rounded-full bg-teal-600 shadow-[0_12px_30px_-12px_rgba(5,144,137,1)]">
        <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
          <path
            d="M13 24.5 20.5 32 35 17"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="48"
            className="animate-draw-check"
          />
        </svg>
      </span>
    </div>
  );
}

export function BookingComplete() {
  const params = useSearchParams();
  const code = params.get("code");
  const { bookings, ready, pushToast } = useAppStore();
  const now = useNow();
  const [prepOpen, setPrepOpen] = useState(true);

  const booking =
    bookings.find((b) => b.code === code) ?? (ready ? bookings[0] : undefined);

  if (!ready) {
    return (
      <div className="shell py-20">
        <div className="mx-auto h-96 max-w-lg animate-pulse rounded-3xl bg-navy-100/70" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="shell py-20 text-center">
        <h1 className="text-[35px] font-bold text-navy-900">
          예약 정보를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-[24px] text-navy-500">
          예약 내역은 브라우저에 저장됩니다. 다시 예약을 진행해 주세요.
        </p>
        <Link
          href="/experts"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-teal-600 px-6 text-[24px] font-bold text-white transition-colors hover:bg-teal-700"
        >
          전문가 찾아보기
        </Link>
      </div>
    );
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(booking.code);
      pushToast({ message: "예약번호를 복사했어요", tone: "success" });
    } catch {
      pushToast({ message: "복사에 실패했어요", tone: "warn" });
    }
  };

  return (
    <div className="relative overflow-hidden pb-28 lg:pb-16">
      <div className="shell relative py-12 sm:py-16">
        <div className="mx-auto max-w-lg">
          <SuccessMark />

          <div className="mt-6 text-center animate-fade-up">
            <h1 className="text-[41px] font-extrabold tracking-[-0.03em] text-navy-900 sm:text-[47px]">
              상담 예약이 완료되었습니다
            </h1>
            <p className="mt-3 text-[24px] leading-relaxed text-navy-500">
              {booking.expertName} 전문가에게 예약이 전달되었어요.
              {now && (
                <span className="mt-1 block font-semibold text-teal-700">
                  {dDay(booking.date, now)} · {formatDateFull(booking.date)}{" "}
                  {formatTimeKorean(booking.time)}
                </span>
              )}
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card animate-fade-up [animation-delay:120ms]">
            <div className="flex items-center gap-3.5 border-b border-dashed border-navy-200 p-5">
              <Portrait name={booking.expertName} accent={booking.expertAccent} photo={booking.expertPhoto} rounded="rounded-2xl" className="h-14 w-14" />
              <div className="min-w-0 flex-1">
                <p className="text-[27.5px] font-bold text-navy-900">
                  {booking.expertName}
                </p>
                <p className="truncate text-[21.5px] text-navy-500">
                  {booking.expertTitle}
                </p>
              </div>
              <span className="shrink-0 rounded-lg bg-teal-50 px-2.5 py-1.5 text-[20.5px] font-bold text-teal-700">
                {booking.categoryName}
              </span>
            </div>

            <dl className="divide-y divide-navy-100">
              {[
                { label: "날짜", value: formatDateFull(booking.date) },
                {
                  label: "시간",
                  value: `${formatTimeKorean(booking.time)} · ${booking.minutes}분`,
                },
                { label: "상담 방식", value: METHOD_LABEL[booking.method] },
                { label: "상담 상품", value: booking.productName },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-4 px-5 py-3.5"
                >
                  <dt className="shrink-0 text-[23px] text-navy-500">{row.label}</dt>
                  <dd className="text-right text-[23.5px] font-semibold text-navy-900">
                    {row.value}
                  </dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <dt className="text-[24px] font-bold text-navy-900">상담료</dt>
                <dd className="text-[35px] font-extrabold tracking-tight text-navy-900">
                  {formatPrice(booking.price)}
                  <span className="ml-0.5 text-[21px] font-semibold text-navy-500">
                    원
                  </span>
                </dd>
              </div>
            </dl>

            <div className="flex items-center justify-between gap-3 border-t border-dashed border-navy-200 bg-navy-50/60 px-5 py-4">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[20.5px] text-navy-400">
                  <Ticket className="h-3.5 w-3.5" strokeWidth={2.2} />
                  예약번호
                </p>
                <p className="mt-0.5 break-all font-mono text-[20px] font-bold tracking-tight text-navy-900 sm:text-[25px]">
                  {booking.code}
                </p>
              </div>
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 text-[21.5px] font-semibold text-navy-600 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <Copy className="h-3.5 w-3.5" strokeWidth={2.2} />
                복사
              </button>
            </div>
          </div>

          {booking.note && (
            <div className="mt-4 rounded-2xl border border-navy-100 bg-white p-5 animate-fade-up [animation-delay:200ms]">
              <p className="text-[21px] font-bold text-navy-500">
                전문가에게 전달한 내용
              </p>
              <p className="mt-2 whitespace-pre-line text-[23.5px] leading-relaxed text-navy-700">
                {booking.note}
              </p>
            </div>
          )}

          {/* 다음 행동 */}
          <div className="mt-6 animate-fade-up [animation-delay:260ms]">
            <Link
              href="/mypage?tab=upcoming"
              className="flex h-[60px] w-full items-center justify-center gap-2 rounded-xl bg-navy-900 text-[25px] font-bold text-white transition-colors hover:bg-navy-800"
            >
              <CalendarCheck className="h-5 w-5" strokeWidth={2.4} />
              내 예약 확인
            </Link>
            <div className="mt-2.5 grid grid-cols-1 gap-2.5 min-[400px]:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  downloadIcs(booking);
                  pushToast({ message: "캘린더 파일을 내려받았어요", tone: "success" });
                }}
                className="inline-flex min-h-[56px] items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white px-2 text-[21px] font-semibold text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <CalendarPlus className="h-4 w-4 shrink-0" strokeWidth={2.2} />
                캘린더에 추가
              </button>
              <Link
                href={`/experts/${booking.expertId}`}
                className="inline-flex min-h-[56px] items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white px-2 text-[21px] font-semibold text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <UserRound className="h-4 w-4 shrink-0" strokeWidth={2.2} />
                프로필 다시 보기
              </Link>
            </div>
          </div>

          {/* 상담 전 준비사항 */}
          <section className="mt-4 rounded-2xl border border-navy-100 bg-white animate-fade-up [animation-delay:320ms]">
            <button
              type="button"
              onClick={() => setPrepOpen((v) => !v)}
              aria-expanded={prepOpen}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className="flex items-center gap-2 text-[23.5px] font-bold text-navy-900">
                <ClipboardList className="h-5 w-5 text-teal-600" strokeWidth={2.2} />
                상담 전 준비사항
              </span>
              <ChevronDown
                className={cx("h-5 w-5 text-navy-400 transition-transform", prepOpen && "rotate-180")}
                strokeWidth={2.2}
              />
            </button>
            {prepOpen && (
              <ul className="space-y-2.5 border-t border-navy-100 px-5 py-4">
                {[...PREP_CHECKLIST[booking.method], ...PREP_COMMON].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[21px] leading-snug text-navy-700">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-teal-600" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <Link
            href="/"
            className="mt-4 flex min-h-[48px] items-center justify-center gap-1.5 text-[21px] font-semibold text-navy-500 hover:text-navy-800"
          >
            <Home className="h-4 w-4" strokeWidth={2.2} />
            홈으로
          </Link>

          <p className="mt-5 text-center text-[20.5px] leading-relaxed text-navy-400">
            데모 예약입니다. 실제 결제는 발생하지 않았으며 예약 내역은 이
            브라우저에만 저장됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
