"use client";

import { photoFor } from "@/lib/data/experts";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CalendarClock, ChevronLeft, ChevronRight, DoorOpen, Info, Lock, MessageSquareText } from "lucide-react";
import { JourneySteps, stageOf } from "@/components/booking/BookingJourney";
import { Portrait } from "@/components/ui/Portrait";
import { effectiveStatus } from "@/lib/availability";
import { ROOM_OPENS_MINUTES, minutesUntil, roomState, type RoomState } from "@/lib/bookingRules";
import { METHOD_LABEL } from "@/lib/data/categories";
import { useAppStore } from "@/lib/store/AppStore";
import { useNow } from "@/lib/useAvailability";
import { cx, dDay, formatDateKorean, formatTimeKorean } from "@/lib/format";
import type { Booking } from "@/lib/types";

/**
 * 상담방 — 예약마다 하나씩 생기는 공간.
 *
 * 데모에서는 실제 화상·전화·채팅 연결을 제공하지 않는다. 대신 실제 서비스에서
 * 상담방이 하는 일(입장 시점 안내, 상담 전 전달 내용 고치기, 진행 기록)을
 * 저장된 예약 데이터로 정직하게 보여 준다. 전문가가 보낸 것처럼 꾸민 메시지는 없다.
 */
export function ChatClient() {
  const params = useSearchParams();
  const code = params.get("code");
  const { bookings, ready } = useAppStore();
  const now = useNow();

  if (!ready) {
    return <div className="mx-auto h-72 max-w-2xl animate-pulse rounded-3xl bg-navy-100/70" />;
  }

  const booking = code ? bookings.find((b) => b.code === code && b.status !== "cancelled") : undefined;
  if (booking) return <Room booking={booking} now={now} />;

  const rooms = bookings
    .filter((b) => b.status !== "cancelled")
    .sort((a, b) => {
      // 예정된 상담을 가까운 순으로 먼저, 끝난 상담은 최근 순으로 뒤에
      const sa = effectiveStatus(a, now);
      const sb = effectiveStatus(b, now);
      if (sa !== sb) return sa === "upcoming" ? -1 : 1;
      const ka = `${a.date}${a.time}`;
      const kb = `${b.date}${b.time}`;
      return sa === "upcoming" ? (ka < kb ? -1 : 1) : ka < kb ? 1 : -1;
    });

  if (rooms.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-navy-50">
          <MessageSquareText className="h-9 w-9 text-navy-300" strokeWidth={1.8} />
        </div>
        <h1 className="mt-6 text-5xl font-bold text-navy-900 sm:text-6xl">예약하면 상담방이 생겨요</h1>
        <p className="mt-3 text-lg leading-relaxed text-navy-500">
          상담방에서 시작 시간 안내를 받고, 상담 전에 전문가에게 전할 내용을 고칠 수 있어요.
        </p>
        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            href="/match"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-navy-900 px-6 text-lg font-bold text-white transition-colors hover:bg-navy-800"
          >
            맞춤 전문가 찾기
          </Link>
          <Link
            href="/experts"
            className="inline-flex h-14 items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white px-6 text-lg font-semibold text-navy-700 transition-colors hover:bg-navy-50"
          >
            전문가 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-5xl font-bold text-navy-900 sm:text-6xl">상담방</h1>
      <p className="mt-2 text-md leading-relaxed text-navy-500">
        예약한 상담마다 상담방이 있어요. 시작 {ROOM_OPENS_MINUTES}분 전부터 입장할 수 있어요.
      </p>
      <ul className="mt-6 space-y-3">
        {rooms.map((b) => {
          const status = effectiveStatus(b, now);
          const room = now ? roomState({ ...b, status: status === "done" ? "done" : b.status }, now) : null;
          return (
            <li key={b.id}>
              <Link
                href={`/chat?code=${b.code}`}
                className="flex items-center gap-3.5 rounded-2xl border border-navy-100 bg-white p-4 transition-colors hover:border-navy-300"
              >
                <Portrait
                  name={b.expertName}
                  accent={b.expertAccent}
                  photo={photoFor(b.expertId, b.expertPhoto)}
                  rounded="rounded-xl"
                  sizes="56px"
                  className={cx("h-14 w-14 shrink-0", status === "done" && "opacity-70")}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2">
                    <span className="text-lg font-bold text-navy-900">{b.expertName} 전문가</span>
                    <RoomPill room={room} booking={b} now={now} />
                  </span>
                  <span className="block text-base text-navy-500">
                    {formatDateKorean(b.date)} {formatTimeKorean(b.time)} · {METHOD_LABEL[b.method]}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-navy-300" strokeWidth={2.2} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RoomPill({ room, booking, now }: { room: RoomState | null; booking: Booking; now: Date | null }) {
  if (!room || !now) return null;
  const map: Record<RoomState, { label: string; className: string }> = {
    before: { label: dDay(booking.date, now), className: "bg-navy-50 text-navy-600" },
    open: { label: "입장 가능", className: "bg-teal-600 text-white" },
    ended: { label: "상담 종료", className: "bg-navy-100 text-navy-500" },
  };
  const m = map[room];
  return <span className={cx("rounded-md px-1.5 py-0.5 text-xs font-bold", m.className)}>{m.label}</span>;
}

function Room({ booking, now }: { booking: Booking; now: Date | null }) {
  const { updateNote, reviewFor } = useAppStore();
  const status = effectiveStatus(booking, now) as "upcoming" | "done";
  const room = now ? roomState({ ...booking, status: status === "done" ? "done" : booking.status }, now) : null;
  const [entered, setEntered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(booking.note);
  const until = now ? minutesUntil(booking, now) : null;

  const log: { key: string; when: string; text: string }[] = [
    {
      key: "booked",
      when: formatDateKorean(booking.createdAt.slice(0, 10)),
      text: `예약 확정 · ${booking.productName} ${booking.minutes}분 · ${METHOD_LABEL[booking.method]}`,
    },
  ];
  if (booking.rescheduledFrom) {
    log.push({
      key: "moved",
      when: "일정 변경",
      text: `${formatDateKorean(booking.rescheduledFrom.date)} ${formatTimeKorean(booking.rescheduledFrom.time)} → ${formatDateKorean(booking.date)} ${formatTimeKorean(booking.time)}`,
    });
  }
  if (status === "done") log.push({ key: "done", when: "상담 종료", text: "상담이 끝났어요. 후기와 재상담은 예약 상세에서 할 수 있어요." });

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/booking/complete?code=${booking.code}`}
        className="-ml-2 inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-base font-semibold text-navy-500 hover:text-navy-900"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
        예약 상세
      </Link>

      <header className="mt-2 flex items-center gap-3.5">
        <Portrait
          name={booking.expertName}
          accent={booking.expertAccent}
          photo={photoFor(booking.expertId, booking.expertPhoto)}
          rounded="rounded-2xl"
          sizes="64px"
          className="h-16 w-16 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-4xl font-bold leading-tight text-navy-900">{booking.expertName} 전문가 상담방</h1>
          <p className="mt-0.5 text-base text-navy-500">
            {formatDateKorean(booking.date)} {formatTimeKorean(booking.time)} · {booking.minutes}분 ·{" "}
            {METHOD_LABEL[booking.method]}
          </p>
        </div>
      </header>

      <div className="mt-6">
        <JourneySteps stage={stageOf(status, room, Boolean(reviewFor(booking.id)))} />
      </div>

      {/* 입장 */}
      <section
        className={cx(
          "mt-6 rounded-2xl border p-5",
          room === "open" ? "border-teal-600 bg-teal-50/60" : "border-navy-100 bg-white",
        )}
        aria-labelledby="room-entry"
      >
        <h2 id="room-entry" className="flex items-center gap-2 text-xl font-bold text-navy-900">
          {room === "open" ? (
            <DoorOpen className="h-5 w-5 text-teal-700" strokeWidth={2.2} />
          ) : room === "before" ? (
            <Lock className="h-5 w-5 text-navy-400" strokeWidth={2.2} />
          ) : (
            <CalendarClock className="h-5 w-5 text-navy-400" strokeWidth={2.2} />
          )}
          {room === "open" ? "지금 입장할 수 있어요" : room === "before" ? "아직 입장 전이에요" : "상담이 끝났어요"}
        </h2>
        <p className="mt-1 text-md leading-relaxed text-navy-600">
          {room === "before" && until !== null
            ? `상담 시작 ${ROOM_OPENS_MINUTES}분 전에 입장 버튼이 열려요. (${until >= 60 * 24 ? `${Math.floor(until / 60 / 24)}일` : until >= 60 ? `${Math.floor(until / 60)}시간` : `${until}분`} 남음)`
            : room === "open"
              ? `${METHOD_LABEL[booking.method]}은 이 화면에서 시작해요.`
              : "상담 기록은 아래에 남아 있어요."}
        </p>
        {room !== "ended" && (
          <button
            type="button"
            disabled={room !== "open"}
            onClick={() => setEntered(true)}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 text-lg font-bold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-navy-100 disabled:text-navy-400"
          >
            <DoorOpen className="h-5 w-5" strokeWidth={2.2} />
            {METHOD_LABEL[booking.method]} 입장
          </button>
        )}
        {entered && (
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-white px-4 py-3 text-md leading-relaxed text-navy-700" role="status">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" strokeWidth={2.2} />
            실제 서비스라면 여기서 {METHOD_LABEL[booking.method]} 연결이 시작돼요. 이 데모는 연결 없이 흐름까지만 보여 드려요.
          </p>
        )}
      </section>

      {/* 전달한 내용 — 상담 전까지 고칠 수 있다 */}
      <section className="mt-6 rounded-2xl border border-navy-100 bg-white p-5" aria-labelledby="room-note">
        <div className="flex items-center justify-between gap-3">
          <h2 id="room-note" className="text-xl font-bold text-navy-900">
            전문가에게 전달한 내용
          </h2>
          {status === "upcoming" && !editing && (
            <button
              type="button"
              onClick={() => {
                setDraft(booking.note);
                setEditing(true);
              }}
              className="inline-flex h-10 items-center rounded-lg px-3 text-base font-semibold text-teal-700 hover:bg-teal-50"
            >
              {booking.note ? "고치기" : "작성하기"}
            </button>
          )}
        </div>
        {editing ? (
          <>
            <label htmlFor="room-note-input" className="sr-only">
              전문가에게 전달할 내용
            </label>
            <textarea
              id="room-note-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, 500))}
              rows={5}
              className="field mt-3 resize-none leading-relaxed"
              placeholder="현재 상황, 가장 궁금한 점, 함께 볼 자료를 적어 주세요."
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-base text-navy-400">{draft.length} / 500</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex h-11 items-center rounded-xl border border-navy-200 px-4 text-md font-semibold text-navy-600 hover:bg-navy-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateNote(booking.id, draft.trim());
                    setEditing(false);
                  }}
                  className="inline-flex h-11 items-center rounded-xl bg-navy-900 px-4 text-md font-bold text-white hover:bg-navy-800"
                >
                  저장
                </button>
              </div>
            </div>
          </>
        ) : booking.note ? (
          <p className="mt-2 whitespace-pre-line text-lg leading-relaxed text-navy-700">{booking.note}</p>
        ) : (
          <p className="mt-2 text-lg text-navy-400">아직 전달한 내용이 없어요. 미리 적어 두면 상담이 더 구체적이에요.</p>
        )}
      </section>

      {/* 진행 기록 */}
      <section className="mt-6" aria-labelledby="room-log">
        <h2 id="room-log" className="text-xl font-bold text-navy-900">
          진행 기록
        </h2>
        <ol className="mt-3 space-y-3 border-l-2 border-navy-100 pl-5">
          {log.map((l) => (
            <li key={l.key} className="relative">
              <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-teal-600" aria-hidden />
              <p className="text-base font-semibold text-navy-400">{l.when}</p>
              <p className="text-lg text-navy-800">{l.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-8 text-center text-md leading-relaxed text-navy-400">
        데모 상담방이에요. 실제 화상·전화·채팅 연결과 전문가 응답은 제공하지 않아요.
      </p>
    </div>
  );
}
