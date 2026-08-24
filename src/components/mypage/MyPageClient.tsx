"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  Heart,
  History,
  MessageSquareQuote,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Stars } from "@/components/ui/Stars";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { METHOD_LABEL } from "@/lib/data/categories";
import { EXPERT_MAP } from "@/lib/data/experts";
import { useAppStore } from "@/lib/store/AppStore";
import {
  cx,
  formatDateKorean,
  formatPrice,
  formatTimeKorean,
  parseDateKey,
} from "@/lib/format";
import type { Booking } from "@/lib/types";

const TABS = [
  { id: "upcoming", label: "예정된 상담", icon: CalendarClock },
  { id: "done", label: "완료 상담", icon: CalendarCheck },
  { id: "favorites", label: "찜한 전문가", icon: Heart },
  { id: "reviews", label: "작성한 후기", icon: MessageSquareQuote },
  { id: "history", label: "상담 히스토리", icon: History },
  { id: "profile", label: "프로필", icon: UserRound },
] as const;

type TabId = (typeof TABS)[number]["id"];

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
      <h3 className="mt-4 text-[23px] font-bold text-navy-900">{title}</h3>
      <p className="mt-1.5 text-[19.5px] leading-relaxed text-navy-500">{body}</p>
      <Link
        href={actionHref}
        className="mt-5 inline-flex h-12 items-center rounded-xl bg-teal-600 px-6 text-[20px] font-bold text-white transition-colors hover:bg-teal-700"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function BookingRow({
  booking,
  onCancel,
  past,
}: {
  booking: Booking;
  onCancel?: (id: string) => void;
  past?: boolean;
}) {
  return (
    <li className="rounded-2xl border border-navy-100 bg-white p-4 transition-colors hover:border-navy-200 sm:p-5">
      <div className="flex items-start gap-3.5">
        <Portrait name={booking.expertName} accent={booking.expertAccent} photo={booking.expertPhoto} rounded="rounded-2xl" className="h-14 w-14" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/experts/${booking.expertId}`}
              className="text-[21px] font-bold text-navy-900 transition-colors hover:text-teal-700"
            >
              {booking.expertName}
            </Link>
            <span
              className={cx(
                "rounded-md px-1.5 py-0.5 text-[15px] font-bold",
                past ? "bg-navy-100 text-navy-500" : "bg-teal-50 text-teal-700",
              )}
            >
              {past ? "상담 완료" : "예약 확정"}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[18px] text-navy-500">
            {booking.expertTitle}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[18px] text-navy-600">
            <span className="inline-flex items-center gap-1.5 font-semibold text-navy-900">
              <CalendarClock className="h-4 w-4 text-teal-600" strokeWidth={2.2} />
              {formatDateKorean(booking.date)} {formatTimeKorean(booking.time)}
            </span>
            <span className="text-navy-200">|</span>
            <span>{METHOD_LABEL[booking.method]}</span>
            <span className="text-navy-200">|</span>
            <span>{booking.productName}</span>
          </div>

          {booking.note && (
            <p className="mt-2.5 line-clamp-2 rounded-xl bg-navy-50 px-3 py-2 text-[17.5px] leading-relaxed text-navy-500">
              {booking.note}
            </p>
          )}

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-navy-100 pt-3">
            <div className="flex items-center gap-2 text-[17px] text-navy-400">
              <span className="font-mono font-semibold text-navy-600">
                {booking.code}
              </span>
              <span>·</span>
              <span className="font-semibold text-navy-900">
                {formatPrice(booking.price)}원
              </span>
            </div>
            <div className="flex items-center gap-2">
              {past ? (
                <Link
                  href={`/booking/${booking.expertId}`}
                  className="inline-flex h-10 items-center rounded-xl border border-navy-200 bg-white px-3.5 text-[18px] font-semibold text-navy-600 transition-colors hover:bg-navy-50"
                >
                  다시 예약
                </Link>
              ) : (
                <>
                  <Link
                    href="/chat"
                    className="inline-flex h-10 items-center rounded-xl border border-navy-200 bg-white px-3.5 text-[18px] font-semibold text-navy-600 transition-colors hover:bg-navy-50"
                  >
                    상담 준비
                  </Link>
                  {onCancel && (
                    <button
                      type="button"
                      onClick={() => onCancel(booking.id)}
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-[18px] font-semibold text-navy-400 transition-colors hover:bg-danger-50 hover:text-danger-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                      예약 취소
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function MyPageClient() {
  const router = useRouter();
  const params = useSearchParams();
  const { bookings, favorites, cancelBooking, ready } = useAppStore();
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  }, []);

  const tabParam = params.get("tab") as TabId | null;
  const tab: TabId = TABS.some((t) => t.id === tabParam)
    ? (tabParam as TabId)
    : "upcoming";

  const setTab = (next: TabId) =>
    router.replace(`/mypage?tab=${next}`, { scroll: false });

  const { upcoming, done } = useMemo(() => {
    const sorted = [...bookings].sort((a, b) =>
      `${a.date}${a.time}` < `${b.date}${b.time}` ? -1 : 1,
    );
    if (!today) return { upcoming: sorted, done: [] as Booking[] };
    return {
      upcoming: sorted.filter(
        (b) => parseDateKey(b.date).getTime() >= today.getTime(),
      ),
      done: sorted
        .filter((b) => parseDateKey(b.date).getTime() < today.getTime())
        .reverse(),
    };
  }, [bookings, today]);

  const favoriteExperts = favorites.map((id) => EXPERT_MAP[id]).filter(Boolean);
  const totalSpend = bookings.reduce((s, b) => s + b.price, 0);

  return (
    <div className="shell py-6 pb-32 lg:py-10 lg:pb-20">
      <section className="overflow-hidden rounded-3xl bg-navy-900 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-[20px] font-extrabold text-white">
              게스트
            </span>
            <div>
              <p className="text-[26px] font-extrabold tracking-tight text-white">
                게스트님
              </p>
              <p className="mt-1 text-[18px] text-navy-300">
                데모 계정으로 둘러보는 중입니다
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-4 sm:gap-8">
            <div>
              <dt className="text-[16px] text-navy-300">예정 상담</dt>
              <dd className="mt-1 text-[26px] font-extrabold text-white">
                {ready ? upcoming.length : 0}
              </dd>
            </div>
            <div>
              <dt className="text-[16px] text-navy-300">찜한 전문가</dt>
              <dd className="mt-1 text-[26px] font-extrabold text-white">
                {ready ? favorites.length : 0}
              </dd>
            </div>
            <div>
              <dt className="text-[16px] text-navy-300">누적 상담료</dt>
              <dd className="mt-1 text-[26px] font-extrabold text-white">
                {ready ? formatPrice(totalSpend) : 0}
                <span className="ml-0.5 text-[16px] font-semibold text-navy-300">
                  원
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="scroll-slim mt-6 flex gap-1.5 overflow-x-auto border-b border-navy-100 pb-px">
        {TABS.map((t) => {
          const TabIcon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={active ? "page" : undefined}
              className={cx(
                "relative inline-flex min-h-[48px] shrink-0 items-center gap-1.5 whitespace-nowrap px-3.5 text-[19.5px] font-semibold transition-colors duration-200",
                active ? "text-navy-900" : "text-navy-400 hover:text-navy-700",
              )}
            >
              <TabIcon className="h-4 w-4" strokeWidth={2.2} />
              {t.label}
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-teal-600" />
              )}
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
              (upcoming.length > 0 ? (
                <ul className="space-y-3">
                  {upcoming.map((b) => (
                    <BookingRow key={b.id} booking={b} onCancel={cancelBooking} />
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="예정된 상담이 없습니다"
                  body="고민에 맞는 전문가를 찾아 첫 상담을 예약해 보세요."
                />
              ))}

            {tab === "done" &&
              (done.length > 0 ? (
                <ul className="space-y-3">
                  {done.map((b) => (
                    <BookingRow key={b.id} booking={b} past />
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="완료된 상담이 없습니다"
                  body="상담을 마치면 이곳에서 다시 확인할 수 있어요."
                />
              ))}

            {tab === "favorites" &&
              (favoriteExperts.length > 0 ? (
                <div className="grid gap-4 xl:grid-cols-2">
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

            {tab === "reviews" && (
              <div className="rounded-2xl border border-navy-100 bg-white p-6">
                <h3 className="text-[21px] font-bold text-navy-900">작성한 후기</h3>
                <p className="mt-2 text-[19.5px] leading-relaxed text-navy-500">
                  상담이 완료되면 후기를 작성할 수 있습니다. 완료된 상담{" "}
                  <span className="font-bold text-navy-900">{done.length}건</span> 중
                  아직 작성한 후기가 없습니다.
                </p>
                {done.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {done.slice(0, 3).map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center gap-3 rounded-xl border border-navy-100 p-3.5"
                      >
                        <Portrait name={b.expertName} accent={b.expertAccent} photo={b.expertPhoto} rounded="rounded-xl" className="h-10 w-10" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[19.5px] font-bold text-navy-900">
                            {b.expertName}
                          </p>
                          <p className="text-[17px] text-navy-400">
                            {formatDateKorean(b.date)} 상담
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Stars value={0} size={14} />
                          <ChevronRight className="h-4 w-4 text-navy-300" strokeWidth={2.2} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === "history" &&
              (bookings.length > 0 ? (
                <ol className="space-y-0">
                  {bookings.map((b, i) => (
                    <li key={b.id} className="relative flex gap-4 pb-5 last:pb-0">
                      <div className="flex flex-col items-center">
                        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600 ring-4 ring-teal-50" />
                        {i < bookings.length - 1 && (
                          <span className="mt-1 w-px flex-1 bg-navy-100" aria-hidden />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 rounded-2xl border border-navy-100 bg-white p-4">
                        <p className="text-[17px] font-semibold text-teal-700">
                          {formatDateKorean(b.date)} {formatTimeKorean(b.time)}
                        </p>
                        <p className="mt-1 text-[20px] font-bold text-navy-900">
                          {b.expertName} · {b.productName}
                        </p>
                        <p className="mt-0.5 text-[17.5px] text-navy-500">
                          {METHOD_LABEL[b.method]} · {formatPrice(b.price)}원 · {b.code}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyState
                  title="상담 히스토리가 없습니다"
                  body="예약한 상담이 이곳에 시간순으로 정리됩니다."
                />
              ))}

            {tab === "profile" && (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-navy-100 bg-white p-5">
                  <h3 className="text-[21px] font-bold text-navy-900">기본 정보</h3>
                  <dl className="mt-4 space-y-3 text-[19.5px]">
                    {[
                      { label: "이름", value: "게스트" },
                      { label: "계정 유형", value: "데모 계정" },
                      { label: "관심 분야", value: "창업 · 마케팅" },
                      { label: "알림", value: "상담 1시간 전 알림" },
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
                  <p className="mt-4 rounded-xl bg-navy-50 px-3.5 py-3 text-[17.5px] leading-relaxed text-navy-500">
                    별도 회원가입 없이 바로 체험할 수 있도록 데모 계정이 자동으로
                    설정되어 있습니다.
                  </p>
                </div>

                <div className="rounded-2xl border border-navy-100 bg-white p-5">
                  <h3 className="text-[21px] font-bold text-navy-900">빠른 이동</h3>
                  <ul className="mt-4 space-y-2">
                    {[
                      { label: "전문가 찾기", href: "/experts" },
                      { label: "예정된 상담 보기", href: "/mypage?tab=upcoming" },
                      { label: "찜한 전문가 보기", href: "/mypage?tab=favorites" },
                      { label: "이용방법 다시보기", href: "/#how-it-works" },
                    ].map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="flex min-h-[48px] items-center justify-between rounded-xl border border-navy-100 px-4 text-[19.5px] font-semibold text-navy-700 transition-colors hover:border-navy-200 hover:bg-navy-50"
                        >
                          {l.label}
                          <ChevronRight className="h-4 w-4 text-navy-300" strokeWidth={2.2} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
