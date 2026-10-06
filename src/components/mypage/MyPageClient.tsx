"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX2,
  ChevronRight,
  Clock3,
  Heart,
  History,
  PenLine,
  RotateCcw,
  Search,
  Star,
  UserRound,
} from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Stars } from "@/components/ui/Stars";
import { Overlay } from "@/components/ui/Overlay";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { METHOD_LABEL } from "@/lib/data/categories";
import { EXPERT_MAP } from "@/lib/data/experts";
import { DEMO_USER } from "@/lib/data/demoUser";
import { useAppStore } from "@/lib/store/AppStore";
import { effectiveStatus } from "@/lib/availability";
import { useNow } from "@/lib/useAvailability";
import {
  cx,
  dDay,
  formatDateKorean,
  formatPrice,
  formatTimeKorean,
} from "@/lib/format";
import type { Booking, BookingStatus, MyReview } from "@/lib/types";

const TABS = [
  { id: "upcoming", label: "다가오는 상담", icon: CalendarClock },
  { id: "done", label: "완료된 상담", icon: CalendarCheck },
  { id: "cancelled", label: "취소된 상담", icon: CalendarX2 },
  { id: "favorites", label: "찜한 전문가", icon: Heart },
  { id: "recent", label: "최근 본 전문가", icon: History },
  { id: "profile", label: "프로필", icon: UserRound },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** 이전 버전 링크 호환 */
const LEGACY_TAB: Record<string, TabId> = { reviews: "done", history: "upcoming" };

const STATUS_BADGE: Record<BookingStatus, { label: string; className: string }> = {
  upcoming: { label: "예약 확정", className: "bg-teal-50 text-teal-700" },
  done: { label: "상담 완료", className: "bg-navy-100 text-navy-600" },
  cancelled: { label: "취소됨", className: "bg-danger-50 text-danger-600" },
};

function EmptyState({
  title,
  body,
  actionLabel = "전문가 찾아보기",
  actionHref = "/experts",
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50">
        <Search className="h-6 w-6 text-navy-300" strokeWidth={2} />
      </div>
      <h3 className="mt-4 text-[27.5px] font-bold text-navy-900">{title}</h3>
      <p className="mt-1.5 text-[23.5px] leading-relaxed text-navy-500">{body}</p>
      <Link
        href={actionHref}
        className="mt-5 inline-flex h-12 items-center rounded-xl bg-navy-900 px-6 text-[23.5px] font-bold text-white transition-colors hover:bg-navy-800"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

const ghostBtn =
  "inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 text-[21px] font-semibold text-navy-600 transition-colors hover:border-navy-300 hover:bg-navy-50";

function BookingRow({
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

  return (
    <li
      className={cx(
        "rounded-2xl border bg-white p-4 sm:p-5",
        status === "cancelled" ? "border-navy-100 opacity-80" : "border-navy-100",
      )}
      data-status={status}
    >
      <div className="flex items-start gap-3.5">
        <Portrait
          name={booking.expertName}
          accent={booking.expertAccent}
          photo={booking.expertPhoto}
          rounded="rounded-2xl"
          sizes="56px"
          className="h-14 w-14 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/experts/${booking.expertId}`}
              className="text-[25px] font-bold text-navy-900 transition-colors hover:text-teal-700"
            >
              {booking.expertName}
            </Link>
            <span className={cx("rounded-md px-1.5 py-0.5 text-[18px] font-bold", badge.className)}>
              {badge.label}
            </span>
            {status === "upcoming" && now && (
              <span className="text-[19px] font-bold text-teal-700">{dDay(booking.date, now)}</span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[21px] text-navy-500">{booking.expertTitle}</p>

          <p
            className={cx(
              "mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[21.5px]",
              status === "cancelled" ? "text-navy-400 line-through" : "text-navy-600",
            )}
          >
            <span className="inline-flex items-center gap-1.5 font-semibold text-navy-900">
              <Clock3 className="h-4 w-4 text-teal-600" strokeWidth={2.2} />
              {formatDateKorean(booking.date)} {formatTimeKorean(booking.time)}
            </span>
            <span className="text-navy-200" aria-hidden>|</span>
            <span>{METHOD_LABEL[booking.method]}</span>
            <span className="text-navy-200" aria-hidden>|</span>
            <span>
              {booking.productName} · {formatPrice(booking.price)}원
            </span>
          </p>

          {review && (
            <div className="mt-3 rounded-xl bg-canvas px-3.5 py-3">
              <p className="flex items-center gap-2 text-[19px] font-bold text-navy-700">
                내 후기 <Stars value={review.rating} size={14} />
              </p>
              <p className="mt-1 line-clamp-2 text-[20.5px] leading-relaxed text-navy-600">
                {review.body}
              </p>
            </div>
          )}

          {confirming ? (
            <div
              className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-danger-100 bg-danger-50 px-3.5 py-3"
              role="alertdialog"
              aria-label="예약 취소 확인"
            >
              <p className="text-[20.5px] font-semibold text-danger-700">이 예약을 취소할까요?</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setConfirming(false)} className={ghostBtn}>
                  유지
                </button>
                <button
                  type="button"
                  onClick={() => onCancel(booking.id)}
                  className="inline-flex min-h-[44px] items-center rounded-xl bg-danger-600 px-3.5 text-[21px] font-bold text-white transition-colors hover:bg-danger-700"
                >
                  취소하기
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-navy-100 pt-3">
              <span className="font-mono text-[19px] font-semibold text-navy-400">{booking.code}</span>
              <div className="flex flex-wrap items-center gap-2">
                {status === "upcoming" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setConfirming(true)}
                      className="inline-flex min-h-[44px] items-center px-2.5 text-[21px] font-semibold text-navy-400 transition-colors hover:text-danger-600"
                    >
                      예약 취소
                    </button>
                    <button
                      type="button"
                      onClick={() => onComplete(booking.id)}
                      className={ghostBtn}
                      title="데모: 상담이 끝난 상태로 바꿔 후기 작성을 체험할 수 있어요"
                    >
                      <CalendarCheck className="h-4 w-4" strokeWidth={2.2} />
                      완료 처리 (데모)
                    </button>
                  </>
                )}
                {status === "done" && !review && (
                  <button
                    type="button"
                    onClick={() => onReview(booking)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-navy-900 px-3.5 text-[21px] font-bold text-white transition-colors hover:bg-navy-800"
                  >
                    <PenLine className="h-4 w-4" strokeWidth={2.2} />
                    후기 작성
                  </button>
                )}
                {status !== "upcoming" && (
                  <Link href={`/booking/${booking.expertId}`} className={ghostBtn}>
                    <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
                    다시 예약
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function ReviewDialog({
  booking,
  onClose,
  onSubmit,
}: {
  booking: Booking | null;
  onClose: () => void;
  onSubmit: (rating: number, body: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const valid = body.trim().length >= 10;

  return (
    <Overlay
      open={Boolean(booking)}
      onClose={onClose}
      title="상담 후기 작성"
      description={booking ? `${booking.expertName} 전문가 · ${booking.productName}` : undefined}
      width="max-w-lg"
      footer={
        <button
          type="button"
          disabled={!valid}
          onClick={() => onSubmit(rating, body.trim())}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-navy-900 text-[23.5px] font-bold text-white transition-colors hover:bg-navy-800 disabled:bg-navy-200 disabled:text-navy-500"
        >
          {valid ? "후기 등록" : "10자 이상 작성해 주세요"}
        </button>
      }
    >
      <div className="px-5 py-5 sm:px-6">
        <p className="text-[21px] font-semibold text-navy-700">상담은 어떠셨나요?</p>
        <div className="mt-2 flex gap-1" role="radiogroup" aria-label="별점">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n}점`}
              onClick={() => setRating(n)}
              className="flex h-12 w-12 items-center justify-center rounded-xl hover:bg-navy-50"
            >
              <Star
                className={cx("h-8 w-8", n <= rating ? "fill-gold-400 text-gold-400" : "text-navy-200")}
                strokeWidth={1.8}
              />
            </button>
          ))}
        </div>
        <label htmlFor="review-body" className="mt-5 block text-[21px] font-semibold text-navy-700">
          후기 내용
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, 300))}
          rows={5}
          placeholder="어떤 점이 도움이 되었는지 알려주세요."
          className="field mt-2 resize-none leading-relaxed"
        />
        <p className="mt-1.5 text-right text-[18px] text-navy-400">{body.length} / 300</p>
      </div>
    </Overlay>
  );
}

export function MyPageClient() {
  const router = useRouter();
  const params = useSearchParams();
  const {
    bookings,
    favorites,
    recent,
    myReviews,
    ready,
    cancelBooking,
    completeBooking,
    addReview,
    clearRecent,
  } = useAppStore();
  const now = useNow();
  const [reviewing, setReviewing] = useState<Booking | null>(null);

  const rawTab = params.get("tab") ?? "";
  const tab: TabId = TABS.some((t) => t.id === rawTab)
    ? (rawTab as TabId)
    : (LEGACY_TAB[rawTab] ?? "upcoming");

  const setTab = (next: TabId) => router.replace(`/mypage?tab=${next}`, { scroll: false });

  const groups = useMemo(() => {
    const withStatus = bookings.map((b) => ({ b, s: effectiveStatus(b, now) }));
    const key = (b: Booking) => `${b.date}${b.time}`;
    return {
      upcoming: withStatus
        .filter((x) => x.s === "upcoming")
        .sort((x, y) => (key(x.b) < key(y.b) ? -1 : 1)),
      done: withStatus
        .filter((x) => x.s === "done")
        .sort((x, y) => (key(x.b) < key(y.b) ? 1 : -1)),
      cancelled: withStatus
        .filter((x) => x.s === "cancelled")
        .sort((x, y) => ((x.b.cancelledAt ?? "") < (y.b.cancelledAt ?? "") ? 1 : -1)),
    };
  }, [bookings, now]);

  const next = groups.upcoming[0]?.b;
  const favoriteExperts = favorites.map((id) => EXPERT_MAP[id]).filter(Boolean);
  const recentExperts = recent.map((id) => EXPERT_MAP[id]).filter(Boolean);
  const reviewOf = (id: string) => myReviews.find((r) => r.bookingId === id);
  const pendingReviews = groups.done.filter((x) => !reviewOf(x.b.id)).length;

  const counts: Record<TabId, number | null> = {
    upcoming: groups.upcoming.length,
    done: groups.done.length,
    cancelled: groups.cancelled.length,
    favorites: favorites.length,
    recent: recentExperts.length,
    profile: null,
  };

  const statusCards = [
    { id: "upcoming" as const, label: "다가오는", value: counts.upcoming },
    { id: "done" as const, label: "완료", value: counts.done },
    { id: "cancelled" as const, label: "취소", value: counts.cancelled },
  ];

  const rowProps = {
    now,
    onCancel: cancelBooking,
    onComplete: completeBooking,
    onReview: setReviewing,
  };

  return (
    <div className="shell py-6 pb-32 lg:py-10 lg:pb-20">
      {/* 상담 현황 */}
      <section className="rounded-3xl bg-navy-900 p-5 sm:p-7">
        <div className="flex items-center gap-3.5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-[27px] font-extrabold text-white">
            {DEMO_USER.initials}
          </span>
          <div className="min-w-0">
            <p className="text-[18px] font-bold text-teal-300">{DEMO_USER.org}</p>
            <h1 className="truncate text-[29px] font-extrabold tracking-tight text-white">
              {DEMO_USER.name}님의 상담
            </h1>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {statusCards.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setTab(c.id)}
              aria-pressed={tab === c.id}
              className={cx(
                "rounded-2xl px-3 py-3 text-left transition-colors sm:px-4",
                tab === c.id ? "bg-white/15 ring-1 ring-white/30" : "bg-white/5 hover:bg-white/10",
              )}
            >
              <span className="block text-[17px] leading-tight text-navy-200 sm:text-[19px]">{c.label}</span>
              <span className="mt-1 block text-[31px] font-extrabold text-white">
                {ready ? c.value : "–"}
              </span>
            </button>
          ))}
        </div>

        {ready && next && (
          <Link
            href="/mypage?tab=upcoming"
            onClick={(e) => {
              e.preventDefault();
              setTab("upcoming");
            }}
            className="mt-3 flex items-center gap-3.5 rounded-2xl bg-white p-4 transition-colors hover:bg-canvas"
          >
            <Portrait
              name={next.expertName}
              accent={next.expertAccent}
              photo={next.expertPhoto}
              rounded="rounded-xl"
              sizes="48px"
              className="h-12 w-12 shrink-0"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[18px] font-bold text-teal-700">
                다음 상담
                {now && <span className="whitespace-nowrap"> · {dDay(next.date, now)}</span>}
              </span>
              <span className="block text-[22px] font-bold leading-snug text-navy-900">
                {formatDateKorean(next.date)} {formatTimeKorean(next.time)}
              </span>
              <span className="block text-[19px] text-navy-500">
                {next.expertName} 전문가 · {METHOD_LABEL[next.method]}
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-navy-300" strokeWidth={2.2} />
          </Link>
        )}

        {ready && pendingReviews > 0 && (
          <button
            type="button"
            onClick={() => setTab("done")}
            className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 text-left text-[20px] text-navy-100 hover:bg-white/10"
          >
            <span>
              후기를 기다리는 상담 <b className="text-white">{pendingReviews}건</b>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={2.2} />
          </button>
        )}
      </section>

      <div
        className="scroll-slim mt-6 flex gap-1 overflow-x-auto border-b border-navy-100 pb-px"
        role="tablist"
        aria-label="마이페이지"
      >
        {TABS.map((t) => {
          const TabIcon = t.icon;
          const active = tab === t.id;
          const count = counts[t.id];
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={cx(
                "relative inline-flex min-h-[48px] shrink-0 items-center gap-1.5 whitespace-nowrap px-3 text-[22px] font-semibold transition-colors duration-200",
                active ? "text-navy-900" : "text-navy-400 hover:text-navy-700",
              )}
            >
              <TabIcon className="h-4 w-4" strokeWidth={2.2} />
              {t.label}
              {ready && count !== null && count > 0 && (
                <span className={cx("text-[18px] font-bold", active ? "text-teal-700" : "text-navy-300")}>
                  {count}
                </span>
              )}
              {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-teal-600" />}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {!ready ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-navy-100/70" />
            ))}
          </div>
        ) : (
          <>
            {tab === "upcoming" &&
              (groups.upcoming.length > 0 ? (
                <ul className="space-y-3">
                  {groups.upcoming.map(({ b, s }) => (
                    <BookingRow key={b.id} booking={b} status={s} {...rowProps} />
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="다가오는 상담이 없습니다"
                  body="고민에 맞는 전문가를 찾아 상담을 예약해 보세요."
                />
              ))}

            {tab === "done" &&
              (groups.done.length > 0 ? (
                <ul className="space-y-3">
                  {groups.done.map(({ b, s }) => (
                    <BookingRow key={b.id} booking={b} status={s} review={reviewOf(b.id)} {...rowProps} />
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="완료된 상담이 없습니다"
                  body="상담을 마치면 이곳에서 후기를 남길 수 있어요."
                />
              ))}

            {tab === "cancelled" &&
              (groups.cancelled.length > 0 ? (
                <ul className="space-y-3">
                  {groups.cancelled.map(({ b, s }) => (
                    <BookingRow key={b.id} booking={b} status={s} {...rowProps} />
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="취소된 상담이 없습니다"
                  body="취소한 예약은 이곳에 기록으로 남아요."
                />
              ))}

            {tab === "favorites" &&
              (favoriteExperts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {favoriteExperts.map((e) => (
                    <ExpertCard key={e.id} expert={e} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="찜한 전문가가 없습니다"
                  body="마음에 드는 전문가의 하트를 눌러 저장해 두세요."
                />
              ))}

            {tab === "recent" &&
              (recentExperts.length > 0 ? (
                <>
                  <div className="mb-3 flex justify-end">
                    <button
                      type="button"
                      onClick={clearRecent}
                      className="inline-flex min-h-[44px] items-center px-2 text-[20px] font-semibold text-navy-400 hover:text-navy-700"
                    >
                      기록 지우기
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {recentExperts.map((e) => (
                      <ExpertCard key={e.id} expert={e} />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState
                  title="최근 본 전문가가 없습니다"
                  body="전문가 프로필을 보면 이곳에 자동으로 저장돼요."
                />
              ))}

            {tab === "profile" && (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-navy-100 bg-white p-5">
                  <h3 className="text-[25px] font-bold text-navy-900">기본 정보</h3>
                  <dl className="mt-4 space-y-3 text-[23px]">
                    {[
                      { label: "소속", value: DEMO_USER.org },
                      { label: "이름", value: `${DEMO_USER.name}님` },
                      { label: "직무", value: DEMO_USER.role },
                      { label: "관심 분야", value: DEMO_USER.interests },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-3 border-b border-navy-100 pb-3 last:border-0 last:pb-0"
                      >
                        <dt className="text-navy-500">{row.label}</dt>
                        <dd className="text-right font-semibold text-navy-900">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 rounded-xl bg-navy-50 px-3.5 py-3 text-[20.5px] leading-relaxed text-navy-500">
                    {DEMO_USER.note}
                  </p>
                </div>

                <div className="rounded-2xl border border-navy-100 bg-white p-5">
                  <h3 className="text-[25px] font-bold text-navy-900">이용 요약</h3>
                  <dl className="mt-4 space-y-3 text-[23px]">
                    {[
                      {
                        label: "누적 상담료",
                        value: `${formatPrice(
                          bookings
                            .filter((b) => b.status !== "cancelled")
                            .reduce((s, b) => s + b.price, 0),
                        )}원`,
                      },
                      { label: "작성한 후기", value: `${myReviews.length}건` },
                      { label: "찜한 전문가", value: `${favorites.length}명` },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between gap-3 border-b border-navy-100 pb-3 last:border-0 last:pb-0"
                      >
                        <dt className="text-navy-500">{row.label}</dt>
                        <dd className="font-semibold text-navy-900">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link
                    href="/experts"
                    className="mt-4 flex min-h-[48px] items-center justify-between rounded-xl border border-navy-100 px-4 text-[22px] font-semibold text-navy-700 transition-colors hover:border-navy-200 hover:bg-navy-50"
                  >
                    전문가 찾기
                    <ChevronRight className="h-4 w-4 text-navy-300" strokeWidth={2.2} />
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ReviewDialog
        key={reviewing?.id ?? "none"}
        booking={reviewing}
        onClose={() => setReviewing(null)}
        onSubmit={(rating, body) => {
          if (!reviewing) return;
          addReview({
            id: `r-${Date.now()}`,
            bookingId: reviewing.id,
            expertId: reviewing.expertId,
            rating,
            body,
            productName: reviewing.productName,
            createdAt: new Date().toISOString(),
          });
          setReviewing(null);
        }}
      />
    </div>
  );
}
