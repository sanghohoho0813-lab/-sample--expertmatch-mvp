"use client";

import { photoFor } from "@/lib/data/experts";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { DateStep, TimeStep } from "@/components/booking/steps";
import { Portrait } from "@/components/ui/Portrait";
import { BookingSkeleton } from "@/components/ui/Skeleton";
import { CHANGE_POLICY, canChange } from "@/lib/bookingRules";
import { METHOD_LABEL } from "@/lib/data/categories";
import { cx, formatDateKorean, formatTimeKorean } from "@/lib/format";
import { useAppStore } from "@/lib/store/AppStore";
import { useSlotPicker } from "@/lib/useAvailability";
import type { Booking } from "@/lib/types";

/**
 * 일정 변경 — 상품·방식·상담 내용은 그대로 두고 날짜와 시간만 다시 고른다.
 * 새 예약과 같은 겹침 규칙을 쓰되, 바꾸는 예약 자신은 제외한다.
 */
export function RescheduleFlow() {
  const params = useSearchParams();
  const code = params.get("code");
  const { bookings, ready } = useAppStore();
  const booking = bookings.find((b) => b.code === code);

  if (!ready) return <BookingSkeleton />;
  if (!booking) {
    return (
      <Notice title="예약 정보를 찾을 수 없어요" body="예약 내역은 이 브라우저에 저장돼요. 내 예약에서 확인해 보세요." />
    );
  }
  return <Picker booking={booking} />;
}

function Notice({ title, body, booking }: { title: string; body: string; booking?: Booking }) {
  return (
    <div className="shell py-16 text-center sm:py-20">
      <h1 className="text-5xl font-bold text-navy-900 sm:text-6xl">{title}</h1>
      <p className="mt-2 text-lg leading-relaxed text-navy-500">{body}</p>
      <Link
        href={booking ? `/booking/complete?code=${booking.code}` : "/mypage?tab=upcoming"}
        className="mt-7 inline-flex h-14 items-center justify-center rounded-xl bg-navy-900 px-6 text-lg font-bold text-white hover:bg-navy-800 transition-[color,background-color,border-color,transform] active:scale-[0.98]"
      >
        {booking ? "예약 상세로" : "내 예약 보기"}
      </Link>
    </div>
  );
}

function Picker({ booking }: { booking: Booking }) {
  const router = useRouter();
  const { rescheduleBooking, pushToast } = useAppStore();
  const { now, getOpen, getStates } = useSlotPicker(booking.expertId, booking.minutes, booking.id);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (now && !canChange(booking, now)) {
    return (
      <Notice
        booking={booking}
        title="이 예약은 일정을 바꿀 수 없어요"
        body={
          booking.status === "cancelled"
            ? "취소된 예약이에요."
            : booking.status === "done"
              ? "이미 끝난 상담이에요."
              : `${CHANGE_POLICY}. 시작이 임박해 변경할 수 없어요.`
        }
      />
    );
  }

  const today = now ? new Date(now.getFullYear(), now.getMonth(), now.getDate()) : null;
  const same = dateKey === booking.date && time === booking.time;

  const save = () => {
    if (!dateKey || !time || same || saving) return;
    setSaving(true);
    const result = rescheduleBooking(booking.id, dateKey, time);
    if (!result.ok) {
      setSaving(false);
      setTime(null);
      pushToast({ message: result.reason, tone: "warn" });
      return;
    }
    router.push(`/booking/complete?code=${booking.code}`);
  };

  return (
    <div className="pb-36 lg:pb-16">
      <div className="border-b border-navy-100 bg-white">
        <div className="shell flex items-center gap-3 py-3 lg:py-4">
          <Link
            href={`/booking/complete?code=${booking.code}`}
            aria-label="예약 상세로 돌아가기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
          </Link>
          <Portrait
            name={booking.expertName}
            accent={booking.expertAccent}
            photo={photoFor(booking.expertId, booking.expertPhoto)}
            rounded="rounded-xl"
            sizes="40px"
            className="h-10 w-10 shrink-0"
          />
          <p className="min-w-0 flex-1 truncate text-2xl font-bold text-navy-900">
            {booking.expertName} 전문가 · 일정 변경
          </p>
        </div>
      </div>

      <div className="shell max-w-3xl py-6 lg:py-10">
        <dl className="grid grid-cols-1 gap-2 rounded-2xl border border-navy-100 bg-white p-4 sm:grid-cols-2 sm:p-5">
          <div>
            <dt className="text-base text-navy-400">지금 일정</dt>
            <dd className="mt-0.5 text-lg font-bold text-navy-900">
              {formatDateKorean(booking.date)} {formatTimeKorean(booking.time)}
            </dd>
          </div>
          <div>
            <dt className="text-base text-navy-400">바꿀 일정</dt>
            <dd className={cx("mt-0.5 text-lg font-bold", dateKey && time ? "text-teal-700" : "text-navy-300")}>
              {dateKey && time
                ? `${formatDateKorean(dateKey)} ${formatTimeKorean(time)}`
                : dateKey
                  ? `${formatDateKorean(dateKey)} · 시간 선택 전`
                  : "날짜와 시간을 골라 주세요"}
            </dd>
          </div>
          <p className="text-base text-navy-500 sm:col-span-2">
            {booking.productName} · {booking.minutes}분 · {METHOD_LABEL[booking.method]} — 상품과 방식, 전달한 내용은 그대로예요.
          </p>
        </dl>

        <div className="mt-8">
          <DateStep
            minutes={booking.minutes}
            today={today}
            getOpen={getOpen}
            value={dateKey}
            onChange={(key) => {
              setDateKey(key);
              setTime(null);
            }}
          />
        </div>

        {dateKey && (
          <div className="mt-10" id="reschedule-time">
            <TimeStep
              dateKey={dateKey}
              states={getStates(dateKey)}
              value={time}
              onChange={setTime}
              onChangeDate={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              heading="h2"
            />
          </div>
        )}

        {same && !saving && (
          <p className="mt-4 text-md font-semibold text-amber-700">지금과 같은 일정이에요. 다른 시간을 골라 주세요.</p>
        )}
        <p className="mt-6 text-base text-navy-400">{CHANGE_POLICY}.</p>

        <div className="mt-6 hidden justify-end lg:flex">
          <button
            type="button"
            disabled={!dateKey || !time || same || saving}
            onClick={save}
            className="inline-flex h-14 items-center gap-2 rounded-xl bg-teal-600 px-8 text-lg font-bold text-white transition-[color,background-color,border-color,transform] hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-navy-200 disabled:text-navy-400 active:scale-[0.98]"
          >
            {saving ? "변경 중..." : "이 일정으로 변경"}
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-bar lg:hidden">
        <button
          type="button"
          disabled={!dateKey || !time || same || saving}
          onClick={save}
          className="inline-flex h-[52px] w-full items-center justify-center gap-1.5 rounded-xl bg-teal-600 text-lg font-bold text-white transition-[color,background-color,border-color,transform] disabled:bg-navy-200 disabled:text-navy-500 active:scale-[0.98]"
        >
          {saving ? "변경 중..." : !dateKey ? "날짜를 선택해 주세요" : !time ? "시간을 선택해 주세요" : "이 일정으로 변경"}
        </button>
      </div>
    </div>
  );
}
