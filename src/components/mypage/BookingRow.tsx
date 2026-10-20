"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  DoorOpen,
  PenLine,
  RotateCcw,
} from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Stars } from "@/components/ui/Stars";
import { canChange, roomState } from "@/lib/bookingRules";
import { photoFor } from "@/lib/data/experts";
import { prepItems } from "@/lib/prep";
import { METHOD_LABEL } from "@/lib/data/categories";
import { cx, dDay, formatDateKorean, formatPrice, formatTimeKorean } from "@/lib/format";
import type { Booking, BookingStatus, MyReview } from "@/lib/types";

const STATUS_BADGE: Record<BookingStatus, { label: string; className: string }> = {
  upcoming: { label: "예약 확정", className: "bg-teal-50 text-teal-700" },
  done: { label: "상담 완료", className: "bg-navy-100 text-navy-600" },
  cancelled: { label: "취소됨", className: "bg-danger-50 text-danger-600" },
};

const ghostBtn =
  "inline-flex min-h-[48px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-navy-200 bg-white px-3 text-md font-semibold text-navy-700 transition-colors hover:border-navy-300 hover:bg-navy-50 sm:min-w-[150px] sm:px-4";

const primaryBtn = (tone = "bg-navy-900 hover:bg-navy-800") =>
  cx(
    "inline-flex min-h-[48px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-md font-bold text-white transition-colors sm:min-w-[150px] sm:px-4",
    tone,
  );

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
  const changeable = status === "upcoming" && now ? canChange(booking, now) : false;
  const roomOpen = status === "upcoming" && now ? roomState(booking, now) === "open" : false;

  const prepAll = prepItems(booking).flatMap((g) => g.items);
  const prepDone = prepAll.filter((item) => booking.prepDone?.includes(item)).length;

  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white" data-status={status}>
      <div className="flex-1 p-4 sm:p-5">
        {/* 상태 · 남은 날 · 예약번호 */}
        <div className="flex items-center gap-2">
          <span className={cx("rounded-md px-2 py-0.5 text-sm font-bold", badge.className)}>{badge.label}</span>
          {status === "upcoming" && now && (
            <span className="text-base font-bold text-teal-700">{dDay(booking.date, now)}</span>
          )}
          {booking.rescheduledFrom && !cancelled && (
            <span className="text-base text-navy-400">· 일정 변경됨</span>
          )}
          <span className="ml-auto font-mono text-xs text-navy-400">{booking.code}</span>
        </div>

        {/* 언제 · 무엇을 — 가장 먼저 읽히는 정보 */}
        <p
          className={cx(
            "mt-3 text-xl font-bold leading-snug sm:text-2xl",
            cancelled ? "text-navy-400 line-through decoration-navy-300" : "text-navy-900",
          )}
        >
          {formatDateKorean(booking.date)} {formatTimeKorean(booking.time)}
        </p>
        <p className={cx("mt-0.5 text-base leading-snug text-navy-500", cancelled && "opacity-70")}>
          {METHOD_LABEL[booking.method]} · {booking.productName} · {formatPrice(booking.price)}원
        </p>

        {/* 누구와 */}
        <div className="mt-3.5 flex items-center gap-3 border-t border-navy-100 pt-3.5">
          <Portrait
            name={booking.expertName}
            accent={booking.expertAccent}
            photo={photoFor(booking.expertId, booking.expertPhoto)}
            rounded="rounded-xl"
            sizes="44px"
            className={cx("h-11 w-11 shrink-0", cancelled && "opacity-60")}
          />
          <div className="min-w-0 flex-1">
            <Link
              href={`/experts/${booking.expertId}`}
              className="text-lg font-bold text-navy-900 transition-colors hover:text-teal-700"
            >
              {booking.expertName} 전문가
            </Link>
            <p className="truncate text-base text-navy-500">{booking.expertTitle}</p>
          </div>
          {status === "upcoming" && (
            <span
              className={cx(
                "shrink-0 text-base font-semibold",
                prepDone === prepAll.length ? "text-teal-700" : "text-navy-400",
              )}
            >
              준비 {prepDone}/{prepAll.length}
            </span>
          )}
        </div>

        {review && (
          <div className="mt-3 rounded-xl bg-canvas px-4 py-3">
            <p className="flex items-center gap-2 text-base font-bold text-navy-700">
              내 후기 <Stars value={review.rating} size={14} />
            </p>
            <p className="mt-1 line-clamp-2 text-md leading-relaxed text-navy-600">{review.body}</p>
          </div>
        )}
      </div>

      {/* 다음 행동 */}
      <div className="border-t border-navy-100 bg-canvas/50 px-4 py-3 sm:px-5">
        {confirming ? (
          <div role="alertdialog" aria-label="예약 취소 확인">
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
        ) : status === "upcoming" ? (
          <>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
              {roomOpen ? (
                <Link href={`/chat?code=${booking.code}`} className={primaryBtn("bg-teal-600 hover:bg-teal-700")}>
                  <DoorOpen className="h-4 w-4" strokeWidth={2.2} />
                  상담방 입장
                </Link>
              ) : (
                <Link href={`/booking/complete?code=${booking.code}`} className={primaryBtn()}>
                  <ClipboardList className="h-4 w-4" strokeWidth={2.2} />
                  상세·준비
                </Link>
              )}
              {changeable ? (
                <Link href={`/booking/reschedule?code=${booking.code}`} className={ghostBtn}>
                  <CalendarClock className="h-4 w-4" strokeWidth={2.2} />
                  일정 변경
                </Link>
              ) : (
                <Link href={`/chat?code=${booking.code}`} className={ghostBtn}>
                  <DoorOpen className="h-4 w-4" strokeWidth={2.2} />
                  상담방
                </Link>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3">
              {changeable ? (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="inline-flex min-h-[44px] items-center px-1 text-base font-semibold text-navy-500 underline-offset-2 hover:text-danger-700 hover:underline"
                >
                  예약 취소
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => onComplete(booking.id)}
                className="inline-flex min-h-[44px] items-center gap-1.5 px-1 text-sm font-medium text-navy-400 underline-offset-2 hover:text-navy-700 hover:underline"
              >
                <CalendarCheck className="h-4 w-4" strokeWidth={2.2} />
                데모: 상담 완료로 표시
              </button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
            {status === "done" && !review ? (
              <button type="button" onClick={() => onReview(booking)} className={primaryBtn()}>
                <PenLine className="h-4 w-4" strokeWidth={2.2} />
                후기 작성
              </button>
            ) : (
              <Link href={`/experts/${booking.expertId}`} className={ghostBtn}>
                프로필 보기
              </Link>
            )}
            <Link
              href={
                status === "done"
                  ? `/booking/${booking.expertId}?product=${booking.productId}&rebook=${booking.code}`
                  : `/booking/${booking.expertId}?product=${booking.productId}`
              }
              className={ghostBtn}
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
              {status === "done" ? "재상담 예약" : "다시 예약"}
            </Link>
          </div>
        )}
      </div>
    </li>
  );
}
