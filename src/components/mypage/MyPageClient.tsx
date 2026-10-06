"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX2,
  ChevronRight,
  Heart,
  History,
  UserRound,
} from "lucide-react";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { BookingRow } from "@/components/mypage/BookingRow";
import { EmptyState } from "@/components/mypage/EmptyState";
import { ReviewDialog } from "@/components/mypage/ReviewDialog";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { effectiveStatus } from "@/lib/availability";
import { DEMO_USER } from "@/lib/data/demoUser";
import { EXPERT_MAP } from "@/lib/data/experts";
import { cx, formatPrice } from "@/lib/format";
import { useAppStore } from "@/lib/store/AppStore";
import { useNow } from "@/lib/useAvailability";
import type { Booking } from "@/lib/types";

const TABS = [
  { id: "upcoming", label: "예정", icon: CalendarClock },
  { id: "done", label: "완료", icon: CalendarCheck },
  { id: "cancelled", label: "취소", icon: CalendarX2 },
  { id: "favorites", label: "찜", icon: Heart },
  { id: "recent", label: "최근 본", icon: History },
  { id: "profile", label: "프로필", icon: UserRound },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** 이전 버전 링크 호환 */
const LEGACY_TAB: Record<string, TabId> = { reviews: "done", history: "upcoming" };

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

  const rowProps = {
    now,
    onCancel: cancelBooking,
    onComplete: completeBooking,
    onReview: setReviewing,
  };

  return (
    <div className="shell py-6 pb-32 lg:py-10 lg:pb-20">
      {/* 누구의 상담인지 — 상태별 개수는 아래 탭에, 다음 상담은 '예정' 목록 맨 위에 (D-day 표시) */}
      <section>
        <div className="flex items-center gap-3.5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-3xl font-extrabold text-white">
            {DEMO_USER.initials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-teal-700">{DEMO_USER.org}</p>
            <h1 className="truncate text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">
              {DEMO_USER.name}님의 상담
            </h1>
          </div>
        </div>

      </section>

      <div
        className="scroll-slim mt-6 flex gap-1 overflow-x-auto border-b border-navy-100 pb-px"
        role="tablist"
        aria-label="마이페이지"
        onKeyDown={(e) => {
          // 탭 사이 이동: ←/→, 처음·끝: Home/End (WAI-ARIA Tabs 패턴)
          const i = TABS.findIndex((t) => t.id === tab);
          const nextIndex =
            e.key === "ArrowRight" ? (i + 1) % TABS.length
            : e.key === "ArrowLeft" ? (i - 1 + TABS.length) % TABS.length
            : e.key === "Home" ? 0
            : e.key === "End" ? TABS.length - 1
            : -1;
          if (nextIndex < 0) return;
          e.preventDefault();
          setTab(TABS[nextIndex].id);
          document.getElementById(`mypage-tab-${TABS[nextIndex].id}`)?.focus();
        }}
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
              id={`mypage-tab-${t.id}`}
              aria-selected={active}
              aria-controls="mypage-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(t.id)}
              className={cx(
                "relative inline-flex min-h-[48px] shrink-0 items-center gap-1.5 whitespace-nowrap px-2.5 text-lg font-semibold transition-colors duration-200 sm:px-3 sm:text-lg",
                active ? "text-navy-900" : "text-navy-400 hover:text-navy-700",
              )}
            >
              <TabIcon className="hidden h-4 w-4 sm:block" strokeWidth={2.2} />
              {t.label}
              {ready && count !== null && count > 0 && (
                <span className={cx("text-sm font-bold", active ? "text-teal-700" : "text-navy-400")}>
                  {count}
                </span>
              )}
              {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-teal-600" />}
            </button>
          );
        })}
      </div>

      <div className="mt-6" id="mypage-panel" role="tabpanel" aria-labelledby={`mypage-tab-${tab}`}>
        {!ready ? (
          <ListSkeleton />
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
                  icon={CalendarClock}
                  title="예정된 상담이 없어요"
                  body="고민에 맞는 전문가를 찾아 상담을 예약해 보세요."
                />
              ))}

            {tab === "done" &&
              (groups.done.length > 0 ? (
                <>
                {pendingReviews > 0 && (
                  <p className="mb-3 rounded-xl border border-gold-200 bg-cream-50 px-4 py-3 text-md text-navy-700">
                    후기를 기다리는 상담이 <b className="text-navy-900">{pendingReviews}건</b> 있어요.
                    남겨 주신 후기는 전문가 프로필에 바로 반영돼요.
                  </p>
                )}
                <ul className="space-y-3">
                  {groups.done.map(({ b, s }) => (
                    <BookingRow key={b.id} booking={b} status={s} review={reviewOf(b.id)} {...rowProps} />
                  ))}
                </ul>
                </>
              ) : (
                <EmptyState
                  icon={CalendarCheck}
                  title="완료된 상담이 없어요"
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
                  icon={CalendarX2}
                  title="취소한 상담이 없어요"
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
                  icon={Heart}
                  title="찜한 전문가가 없어요"
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
                      className="inline-flex min-h-[44px] items-center px-2 text-md font-semibold text-navy-400 hover:text-navy-700"
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
                  icon={History}
                  title="최근 본 전문가가 없어요"
                  body="전문가 프로필을 보면 이곳에 자동으로 저장돼요."
                />
              ))}

            {tab === "profile" && (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-navy-100 bg-white p-5">
                  <h2 className="text-2xl font-bold text-navy-900">기본 정보</h2>
                  <dl className="mt-4 space-y-3 text-xl">
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
                  <p className="mt-4 rounded-xl bg-navy-50 px-3.5 py-3 text-md leading-relaxed text-navy-500">
                    {DEMO_USER.note}
                  </p>
                </div>

                <div className="rounded-2xl border border-navy-100 bg-white p-5">
                  <h2 className="text-2xl font-bold text-navy-900">이용 요약</h2>
                  <dl className="mt-4 space-y-3 text-xl">
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
                    className="mt-4 flex min-h-[48px] items-center justify-between rounded-xl border border-navy-100 px-4 text-lg font-semibold text-navy-700 transition-colors hover:border-navy-200 hover:bg-navy-50"
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
