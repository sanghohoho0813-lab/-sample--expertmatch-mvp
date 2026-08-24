"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarPlus, Copy, Home, Ticket } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { METHOD_LABEL } from "@/lib/data/categories";
import { useAppStore } from "@/lib/store/AppStore";
import { formatDateFull, formatPrice, formatTimeKorean } from "@/lib/format";

function SuccessMark() {
  return (
    <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
      <span
        className="absolute inset-0 rounded-full bg-teal-500/25 animate-ring-pulse"
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
        <h1 className="text-[29px] font-bold text-navy-900">
          예약 정보를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-[20px] text-navy-500">
          예약 내역은 브라우저에 저장됩니다. 다시 예약을 진행해 주세요.
        </p>
        <Link
          href="/experts"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-teal-600 px-6 text-[20px] font-bold text-white transition-colors hover:bg-teal-700"
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
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-teal-50 to-transparent"
        aria-hidden
      />

      <div className="shell relative py-12 sm:py-16">
        <div className="mx-auto max-w-lg">
          <SuccessMark />

          <div className="mt-6 text-center animate-fade-up">
            <h1 className="text-[34px] font-extrabold tracking-[-0.03em] text-navy-900 sm:text-[39px]">
              상담 예약이 완료되었습니다
            </h1>
            <p className="mt-3 text-[20px] leading-relaxed text-navy-500">
              {booking.expertName} 전문가에게 예약이 전달되었어요.
              <br />
              상담 시작 전에 알림으로 다시 안내해 드릴게요.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card animate-fade-up [animation-delay:120ms]">
            <div className="flex items-center gap-3.5 border-b border-dashed border-navy-200 p-5">
              <Portrait name={booking.expertName} accent={booking.expertAccent} photo={booking.expertPhoto} rounded="rounded-2xl" className="h-14 w-14" />
              <div className="min-w-0 flex-1">
                <p className="text-[23px] font-bold text-navy-900">
                  {booking.expertName}
                </p>
                <p className="truncate text-[18px] text-navy-500">
                  {booking.expertTitle}
                </p>
              </div>
              <span className="shrink-0 rounded-lg bg-teal-50 px-2.5 py-1.5 text-[17px] font-bold text-teal-700">
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
                  <dt className="shrink-0 text-[19px] text-navy-500">{row.label}</dt>
                  <dd className="text-right text-[19.5px] font-semibold text-navy-900">
                    {row.value}
                  </dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <dt className="text-[20px] font-bold text-navy-900">상담료</dt>
                <dd className="text-[29px] font-extrabold tracking-tight text-navy-900">
                  {formatPrice(booking.price)}
                  <span className="ml-0.5 text-[17.5px] font-semibold text-navy-500">
                    원
                  </span>
                </dd>
              </div>
            </dl>

            <div className="flex items-center justify-between gap-3 border-t border-dashed border-navy-200 bg-navy-50/60 px-5 py-4">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[17px] text-navy-400">
                  <Ticket className="h-3.5 w-3.5" strokeWidth={2.2} />
                  예약번호
                </p>
                <p className="mt-0.5 truncate font-mono text-[21px] font-bold tracking-tight text-navy-900">
                  {booking.code}
                </p>
              </div>
              <button
                type="button"
                onClick={copyCode}
                className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 text-[18px] font-semibold text-navy-600 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <Copy className="h-3.5 w-3.5" strokeWidth={2.2} />
                복사
              </button>
            </div>
          </div>

          {booking.note && (
            <div className="mt-4 rounded-2xl border border-navy-100 bg-white p-5 animate-fade-up [animation-delay:200ms]">
              <p className="text-[17.5px] font-bold text-navy-500">
                전문가에게 전달한 내용
              </p>
              <p className="mt-2 whitespace-pre-line text-[19.5px] leading-relaxed text-navy-700">
                {booking.note}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row animate-fade-up [animation-delay:260ms]">
            <Link
              href="/mypage?tab=upcoming"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-[21px] font-bold text-white transition-all duration-200 hover:bg-teal-700 active:scale-[0.98]"
            >
              <CalendarPlus className="h-4 w-4" strokeWidth={2.4} />
              내 예약 확인
            </Link>
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-navy-200 bg-white py-3.5 text-[21px] font-semibold text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50"
            >
              <Home className="h-4 w-4" strokeWidth={2.2} />
              홈으로
            </Link>
          </div>

          <p className="mt-5 text-center text-[17px] leading-relaxed text-navy-400">
            데모 예약입니다. 실제 결제는 발생하지 않았으며 예약 내역은 이
            브라우저에만 저장됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
