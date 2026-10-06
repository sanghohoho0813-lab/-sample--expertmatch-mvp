"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarCheck,
  ClipboardList,
  Clock3,
  PenLine,
  RotateCcw,
} from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Stars } from "@/components/ui/Stars";
import { METHOD_LABEL } from "@/lib/data/categories";
import { cx, dDay, formatDateKorean, formatPrice, formatTimeKorean } from "@/lib/format";
import type { Booking, BookingStatus, MyReview } from "@/lib/types";

const STATUS_BADGE: Record<BookingStatus, { label: string; className: string }> = {
  upcoming: { label: "예약 확정", className: "bg-teal-50 text-teal-700" },
  done: { label: "상담 완료", className: "bg-navy-100 text-navy-600" },
  cancelled: { label: "취소됨", className: "bg-danger-50 text-danger-600" },
};

const ghostBtn =
  "inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-navy-200 bg-white px-3 text-md sm:min-w-[150px] sm:px-4 font-semibold text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50";

/** 마이페이지 예약 한 건 — 누구와 · 언제 · 무엇을 · 다음 행동 */
export function BookingRow({
  booking,
  status,
  now,
  review,
  onCancel,
  onComplete,
  onReview,
}: {
  booking: Booking;
  status: BookingStatus;
  now: Date | null;
  review?: MyReview;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
  onReview: (booking: Booking) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const badge = STATUS_BADGE[status];

  const cancelled = status === "cancelled";

  return (
    <li
      className="rounded-2xl border border-navy-100 bg-white p-4 sm:p-5"
      data-status={status}
    >
      {/* 누구와 */}
      <div className="flex items-center gap-3">
        <Portrait
          name={booking.expertName}
          accent={booking.expertAccent}
          photo={booking.expertPhoto}
          rounded="rounded-xl"
          sizes="48px"
          className={cx("h-12 w-12 shrink-0", cancelled && "opacity-60")}
        />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <Link
              href={`/experts/${booking.expertId}`}
              className="text-xl font-bold text-navy-900 transition-colors hover:text-teal-700"
            >
              {booking.expertName}
            </Link>
            <span className={cx("rounded-md px-1.5 py-0.5 text-xs font-bold", badge.className)}>
              {badge.label}
            </span>
          </p>
          <p className="truncate text-base text-navy-500">{booking.expertTitle}</p>
        </div>
        {status === "upcoming" && now && (
          <span className="shrink-0 rounded-lg bg-teal-50 px-2.5 py-1 text-base font-bold text-teal-800">
            {dDay(booking.date, now)}
          </span>
        )}
      </div>

      {/* 언제 · 무엇을 */}
      <div className={cx("mt-3.5 rounded-xl bg-canvas px-4 py-3", cancelled && "opacity-70")}>
        <p
          className={cx(
            "flex items-center gap-1.5 text-lg font-bold",
            cancelled ? "text-navy-400 line-through" : "text-navy-900",
          )}
        >
          <Clock3 className="h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
          {formatDateKorean(booking.date)} {formatTimeKorean(booking.time)}
        </p>
        <p className="mt-0.5 text-base leading-snug text-navy-500">
          {METHOD_LABEL[booking.method]} · {booking.productName} · {formatPrice(booking.price)}원
        </p>
        <p className="mt-1 font-mono text-xs text-navy-400">예약번호 {booking.code}</p>
      </div>

      {review && (
        <div className="mt-3 rounded-xl border border-navy-100 px-4 py-3">
          <p className="flex items-center gap-2 text-base font-bold text-navy-700">
            내 후기 <Stars value={review.rating} size={14} />
          </p>
          <p className="mt-1 line-clamp-2 text-md leading-relaxed text-navy-600">{review.body}</p>
        </div>
      )}

      {/* 다음 행동 */}
      {confirming ? (
        <div
          className="mt-3.5 rounded-xl border border-danger-100 bg-danger-50 px-4 py-3"
          role="alertdialog"
          aria-label="예약 취소 확인"
        >
          <p className="text-md font-semibold text-danger-700">
            이 예약을 취소할까요? 취소한 시간은 다른 분이 예약할 수 있어요.
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setConfirming(false)} className={ghostBtn}>
              유지하기
            </button>
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-danger-600 px-3.5 text-md font-bold text-white transition-colors hover:bg-danger-700"
            >
              예약 취소
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3.5">
          {status === "upcoming" && (
            <>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
                <Link href={`/booking/complete?code=${booking.code}`} className={ghostBtn}>
                  <ClipboardList className="h-4 w-4" strokeWidth={2.2} />
                  일정·준비사항
                </Link>
                <button type="button" onClick={() => setConfirming(true)} className={ghostBtn}>
                  예약 취소
                </button>
              </div>
              <button
                type="button"
                onClick={() => onComplete(booking.id)}
                className="mt-1.5 inline-flex min-h-[40px] items-center gap-1.5 px-1 text-sm font-medium text-navy-400 underline-offset-2 hover:text-navy-700 hover:underline"
              >
                <CalendarCheck className="h-4 w-4" strokeWidth={2.2} />
                데모: 상담 완료로 표시
              </button>
            </>
          )}
          {status !== "upcoming" && (
            <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              {status === "done" && !review ? (
                <button
                  type="button"
                  onClick={() => onReview(booking)}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-navy-900 px-3.5 text-md font-bold text-white transition-colors hover:bg-navy-800 sm:min-w-[150px]"
                >
                  <PenLine className="h-4 w-4" strokeWidth={2.2} />
                  후기 작성
                </button>
              ) : (
                <Link href={`/experts/${booking.expertId}`} className={ghostBtn}>
                  프로필 보기
                </Link>
              )}
              <Link href={`/booking/${booking.expertId}?product=${booking.productId}`} className={ghostBtn}>
                <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
                다시 예약
              </Link>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

