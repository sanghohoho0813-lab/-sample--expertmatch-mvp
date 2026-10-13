"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarClock,
  CalendarCheck,
  Check,
  DoorOpen,
  PenLine,
  RotateCcw,
} from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";
import { METHOD_ICON, METHOD_LABEL } from "@/lib/data/categories";
import {
  CHANGE_CUTOFF_MINUTES,
  CHANGE_POLICY,
  ROOM_OPENS_MINUTES,
  canChange,
  minutesUntil,
  type RoomState,
} from "@/lib/bookingRules";
import { cx, formatDateKorean, formatTimeKorean } from "@/lib/format";
import { prepItems } from "@/lib/prep";
import type { Booking, MyReview } from "@/lib/types";

/*
 * 예약 이후의 여정 — 예약 확정 → 상담 준비 → 상담 → 후기.
 * 예약 상세(/booking/complete)와 상담방(/chat)이 함께 쓴다.
 */

export type Stage = 1 | 2 | 3 | 4;

/** 지금 어느 단계인지 */
export function stageOf(status: "upcoming" | "done", room: RoomState | null, reviewed: boolean): Stage {
  if (status === "done") return reviewed ? 4 : 3;
  return room === "open" ? 2 : 1;
}

const STAGES = ["예약 확정", "상담 준비", "상담", "후기"];

export function JourneySteps({ stage }: { stage: Stage }) {
  return (
    <ol className="flex items-start" aria-label="상담 진행 단계">
      {STAGES.map((label, i) => {
        const done = i < stage;
        const current = i === stage;
        return (
          <li key={label} className="relative flex flex-1 flex-col items-center text-center">
            {i > 0 && (
              <span
                className={cx(
                  "absolute right-1/2 top-[13px] h-0.5 w-full",
                  done || current ? "bg-teal-600" : "bg-navy-100",
                )}
                aria-hidden
              />
            )}
            <span
              className={cx(
                "relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-3xs font-bold",
                done
                  ? "bg-teal-600 text-white"
                  : current
                    ? "border-2 border-teal-600 bg-white text-teal-700"
                    : "border-2 border-navy-100 bg-white text-navy-300",
              )}
              aria-hidden
            >
              {done ? <Check className="h-3.5 w-3.5" strokeWidth={3.2} /> : i + 1}
            </span>
            <span
              className={cx(
                "mt-1.5 px-0.5 text-xs leading-tight sm:text-base",
                current ? "font-bold text-navy-900" : done ? "font-semibold text-navy-600" : "text-navy-400",
              )}
            >
              {label}
              <span className="sr-only">{done ? " (완료)" : current ? " (지금 단계)" : ""}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** 상담 전 준비 — 체크한 항목은 저장돼 다음에 열어도 남아 있다 */
export function PrepChecklist({
  booking,
  onToggle,
}: {
  booking: Booking;
  onToggle: (item: string) => void;
}) {
  const groups = prepItems(booking);
  const all = groups.flatMap((g) => g.items);
  const done = all.filter((i) => booking.prepDone?.includes(i)).length;

  return (
    <section aria-labelledby="prep-title">
      <div className="flex items-end justify-between gap-3">
        <h2 id="prep-title" className="text-2xl font-bold text-navy-900">
          상담 전 준비
        </h2>
        <p className="text-base font-semibold text-navy-500" aria-live="polite">
          {done === all.length ? "준비 완료" : `${done} / ${all.length}`}
        </p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-100" aria-hidden>
        <div
          className="h-full rounded-full bg-teal-600 transition-[width] duration-300"
          style={{ width: `${(done / Math.max(all.length, 1)) * 100}%` }}
        />
      </div>

      <div className="mt-4 space-y-5">
        {groups.map((g) => (
          <div key={g.group}>
            <p className="text-base font-semibold text-navy-400">{g.group}</p>
            <ul className="mt-1.5 space-y-1">
              {g.items.map((item) => {
                const checked = booking.prepDone?.includes(item) ?? false;
                return (
                  <li key={item}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => onToggle(item)}
                      className="-mx-2 flex w-[calc(100%+1rem)] items-start gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-canvas"
                    >
                      <span
                        className={cx(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                          checked ? "border-teal-600 bg-teal-600 text-white" : "border-navy-200 bg-white text-transparent",
                        )}
                        aria-hidden
                      >
                        <Check className="h-3 w-3" strokeWidth={3.4} />
                      </span>
                      <span
                        className={cx(
                          "text-lg leading-snug",
                          checked ? "text-navy-400 line-through decoration-navy-300" : "text-navy-800",
                        )}
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/** 상담방 — 언제 열리는지, 어떻게 진행되는지 (데모에서는 실제 연결 없음) */
export function RoomNotice({ booking, room, now }: { booking: Booking; room: RoomState; now: Date }) {
  const until = minutesUntil(booking, now);
  const open = room === "open";
  return (
    <section
      aria-labelledby="room-title"
      className={cx(
        "rounded-2xl border p-5",
        open ? "border-teal-600 bg-teal-50/60" : "border-navy-100 bg-white",
      )}
    >
      <div className="flex items-start gap-3.5">
        <span
          className={cx(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            open ? "bg-teal-600 text-white" : "bg-navy-50 text-navy-600",
          )}
        >
          <Icon name={METHOD_ICON[booking.method]} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="room-title" className="text-xl font-bold text-navy-900">
            {open ? "상담방이 열렸어요" : `${METHOD_LABEL[booking.method]} 상담방`}
          </h2>
          <p className="mt-0.5 text-md leading-relaxed text-navy-600">
            {open
              ? until > 0
                ? `${until}분 뒤 상담이 시작돼요. 지금 들어가서 기다릴 수 있어요.`
                : "상담 시간이에요. 상담방에서 전문가를 만나세요."
              : `상담 시작 ${ROOM_OPENS_MINUTES}분 전(${formatTimeKorean(
                  shiftTime(booking.time, -ROOM_OPENS_MINUTES),
                )})부터 입장할 수 있어요.`}
          </p>
        </div>
      </div>
      <Link
        href={`/chat?code=${booking.code}`}
        className={cx(
          "mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-lg font-bold transition-colors",
          open
            ? "bg-teal-600 text-white hover:bg-teal-700"
            : "border border-navy-200 bg-white text-navy-700 hover:bg-navy-50",
        )}
      >
        <DoorOpen className="h-5 w-5" strokeWidth={2.2} />
        {open ? "상담방 입장" : "상담방 미리 보기"}
      </Link>
    </section>
  );
}

function shiftTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const t = h * 60 + m + minutes;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

/** 일정 변경·취소 — 정책을 먼저 보여 주고, 취소는 한 번 더 확인한다 */
export function ChangePanel({
  booking,
  now,
  onCancel,
}: {
  booking: Booking;
  now: Date;
  onCancel: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const allowed = canChange(booking, now);

  return (
    <section aria-labelledby="change-title">
      <h2 id="change-title" className="text-2xl font-bold text-navy-900">
        일정 변경·취소
      </h2>
      <p className="mt-1 text-md leading-relaxed text-navy-500">
        {allowed
          ? `${CHANGE_POLICY}. 바꾼 시간은 전문가에게 바로 전달돼요.`
          : `상담 시작 ${CHANGE_CUTOFF_MINUTES}분 전이 지나 변경·취소할 수 없어요. 급한 사정은 상담방에서 전문가에게 알려 주세요.`}
      </p>
      {booking.rescheduledFrom && (
        <p className="mt-2 inline-flex flex-wrap items-center gap-x-1.5 rounded-lg bg-canvas px-3 py-1.5 text-base text-navy-600">
          <CalendarClock className="h-4 w-4 text-navy-400" strokeWidth={2.2} />
          <span className="line-through decoration-navy-300">
            {formatDateKorean(booking.rescheduledFrom.date)} {formatTimeKorean(booking.rescheduledFrom.time)}
          </span>
          에서 변경됨
        </p>
      )}

      {allowed &&
        (confirming ? (
          <div
            className="mt-3 rounded-xl border border-danger-100 bg-danger-50 px-4 py-3"
            role="alertdialog"
            aria-label="예약 취소 확인"
          >
            <p className="text-md font-semibold text-danger-700">
              이 예약을 취소할까요? 상담료는 전액 환불되고, 이 시간은 다른 분이 예약할 수 있어요.
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-navy-200 bg-white px-3 text-md font-semibold text-navy-700 hover:bg-navy-50"
              >
                유지하기
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-danger-600 px-3 text-md font-bold text-white hover:bg-danger-700"
              >
                예약 취소
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={`/booking/reschedule?code=${booking.code}`}
              className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3 text-lg font-semibold text-navy-800 transition-colors hover:border-navy-300 hover:bg-navy-50"
            >
              <CalendarClock className="h-4 w-4" strokeWidth={2.2} />
              일정 변경
            </Link>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-navy-200 bg-white px-3 text-lg font-semibold text-navy-600 transition-colors hover:border-danger-500/40 hover:text-danger-700"
            >
              예약 취소
            </button>
          </div>
        ))}
    </section>
  );
}

/** 상담 이후 — 후기 · 같은 전문가에게 이어서 상담 */
export function AfterPanel({
  booking,
  review,
  onReview,
}: {
  booking: Booking;
  review?: MyReview;
  onReview: () => void;
}) {
  return (
    <section aria-labelledby="after-title" className="rounded-2xl border border-navy-100 bg-white p-5">
      <h2 id="after-title" className="text-2xl font-bold text-navy-900">
        {review ? "남긴 후기" : "상담은 어떠셨나요?"}
      </h2>
      {review ? (
        <div className="mt-2">
          <Stars value={review.rating} size={16} />
          <p className="mt-1.5 whitespace-pre-line text-lg leading-relaxed text-navy-700">{review.body}</p>
        </div>
      ) : (
        <>
          <p className="mt-1 text-md leading-relaxed text-navy-500">
            후기는 다른 분이 전문가를 고를 때 가장 많이 참고하는 정보예요. 실제 상담을 받은 분만 남길 수 있어요.
          </p>
          <button
            type="button"
            onClick={onReview}
            className="mt-3 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-navy-900 text-lg font-bold text-white transition-colors hover:bg-navy-800"
          >
            <PenLine className="h-4 w-4" strokeWidth={2.2} />
            후기 남기기
          </button>
        </>
      )}

      <div className="mt-5 border-t border-navy-100 pt-4">
        <p className="text-lg font-bold text-navy-900">이어서 상담이 필요하다면</p>
        <p className="mt-0.5 text-md text-navy-500">
          지난 상담과 같은 상품·방식으로 준비해 두고, 이어서 물어볼 내용을 적을 수 있게 해 드려요.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
          <Link
            href={`/booking/${booking.expertId}?product=${booking.productId}&rebook=${booking.code}`}
            className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-3 text-lg font-bold text-white transition-colors hover:bg-teal-700"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
            {booking.expertName} 전문가 재상담
          </Link>
          <Link
            href="/match"
            className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3 text-lg font-semibold text-navy-700 transition-colors hover:bg-navy-50"
          >
            <CalendarCheck className="h-4 w-4" strokeWidth={2.2} />
            다른 고민 상담하기
          </Link>
        </div>
      </div>
    </section>
  );
}
