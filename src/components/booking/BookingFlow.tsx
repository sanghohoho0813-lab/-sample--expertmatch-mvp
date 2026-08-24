"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarRange,
  Check,
  ChevronLeft,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Stars } from "@/components/ui/Stars";
import { Icon } from "@/components/ui/Icon";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { MonthCalendar } from "@/components/booking/MonthCalendar";
import { DayStrip } from "@/components/booking/DayStrip";
import {
  CATEGORY_MAP,
  METHOD_HINT,
  METHOD_ICON,
  METHOD_LABEL,
} from "@/lib/data/categories";
import { slotsFor, startOfToday } from "@/lib/availability";
import { createBookingCode, useAppStore } from "@/lib/store/AppStore";
import {
  cx,
  formatDateKorean,
  formatPrice,
  formatTimeKorean,
} from "@/lib/format";
import type { Booking, ConsultMethod, Expert } from "@/lib/types";

const STEPS = [
  "상담 상품",
  "상담 방식",
  "날짜 선택",
  "시간 선택",
  "상담 내용",
  "예약 확인",
];

const QUESTION_HINTS = [
  "현재 상황을 2~3줄로 정리해 주세요",
  "가장 궁금한 점 한 가지를 적어주세요",
  "이미 시도해 본 방법이 있다면 알려주세요",
];

export function BookingFlow({ expert }: { expert: Expert }) {
  const router = useRouter();
  const params = useSearchParams();
  const { addBooking } = useAppStore();

  const [today, setToday] = useState<Date | null>(null);
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [productId, setProductId] = useState(
    () =>
      params.get("product") ??
      expert.products.find((p) => p.recommended)?.id ??
      expert.products[0].id,
  );
  const [method, setMethod] = useState<ConsultMethod | null>(
    expert.methods.length === 1 ? expert.methods[0] : null,
  );
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // 날짜 계산은 마운트 이후에만 수행 (하이드레이션 안전)
  useEffect(() => setToday(startOfToday()), []);

  const product = expert.products.find((p) => p.id === productId) ?? expert.products[0];

  const slots = useMemo(
    () => (dateKey ? slotsFor(expert.id, dateKey) : []),
    [expert.id, dateKey],
  );

  const canAdvance = [
    Boolean(product),
    Boolean(method),
    Boolean(dateKey),
    Boolean(time),
    true,
    true,
  ][step];

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, next));
    setStep(clamped);
    setMaxReached((m) => Math.max(m, clamped));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submit = () => {
    if (!dateKey || !time || !method) return;
    setSubmitting(true);
    const booking: Booking = {
      id: `${Date.now()}`,
      code: createBookingCode(),
      expertId: expert.id,
      expertName: expert.name,
      expertTitle: expert.title,
      expertAccent: expert.accent,
      categoryName: CATEGORY_MAP[expert.categories[0]].name,
      productId: product.id,
      productName: product.name,
      minutes: product.minutes,
      price: product.price,
      method,
      date: dateKey,
      time,
      note: note.trim(),
      createdAt: new Date().toISOString(),
      status: "upcoming",
    };
    addBooking(booking);
    // 데모 결제 처리 (실제 PG 연동 없음)
    window.setTimeout(() => {
      router.push(`/booking/complete?code=${booking.code}`);
    }, 550);
  };

  const summary = (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div className="flex items-center gap-3">
        <Portrait name={expert.name} accent={expert.accent} rounded="rounded-2xl" className="h-14 w-14" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-bold text-navy-900">
            {expert.name}
          </p>
          <p className="truncate text-[13px] text-navy-500">{expert.title}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <Stars value={expert.rating} size={12} />
            <span className="text-[12px] font-semibold text-navy-600">
              {expert.rating.toFixed(1)}
            </span>
            <span className="text-[12px] text-navy-400">
              ({expert.reviewCount})
            </span>
          </div>
        </div>
      </div>

      <dl className="mt-4 space-y-2.5 border-t border-navy-100 pt-4 text-[14px]">
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-navy-400">상담 상품</dt>
          <dd className="text-right font-semibold text-navy-900">
            {product.name}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-navy-400">상담 방식</dt>
          <dd
            className={cx(
              "text-right font-semibold",
              method ? "text-navy-900" : "text-navy-300",
            )}
          >
            {method ? METHOD_LABEL[method] : "선택 전"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-navy-400">날짜</dt>
          <dd
            className={cx(
              "text-right font-semibold",
              dateKey ? "text-navy-900" : "text-navy-300",
            )}
          >
            {dateKey ? formatDateKorean(dateKey) : "선택 전"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="shrink-0 text-navy-400">시간</dt>
          <dd
            className={cx(
              "text-right font-semibold",
              time ? "text-navy-900" : "text-navy-300",
            )}
          >
            {time ? `${formatTimeKorean(time)} · ${product.minutes}분` : "선택 전"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
        <span className="text-[14px] font-medium text-navy-600">총 상담료</span>
        <span className="text-[22px] font-extrabold tracking-tight text-navy-900">
          {formatPrice(product.price)}
          <span className="ml-0.5 text-[13px] font-semibold text-navy-500">원</span>
        </span>
      </div>

      <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-navy-50 px-3 py-2.5 text-[12px] leading-snug text-navy-500">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" strokeWidth={2.2} />
        데모 환경입니다. 실제 결제는 발생하지 않으며 예약 정보는 이 브라우저에만
        저장됩니다.
      </p>
    </div>
  );

  return (
    <div className="pb-32 lg:pb-16">
      {/* 상단: 전문가 요약 + 스텝 */}
      <div className="sticky top-16 z-30 border-b border-navy-100 bg-white/95 backdrop-blur-md lg:top-[72px]">
        <div className="shell py-3 lg:py-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/experts/${expert.id}`}
              aria-label="전문가 상세로 돌아가기"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
            </Link>
            <Portrait name={expert.name} accent={expert.accent} rounded="rounded-xl" className="h-10 w-10 lg:hidden" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold text-navy-900">
                {expert.name} 전문가 상담 예약
              </p>
              <p className="truncate text-[12.5px] text-navy-400 lg:hidden">
                {expert.title}
              </p>
            </div>
            <div className="hidden lg:block">
              <StepIndicator
                steps={STEPS}
                current={step}
                maxReached={maxReached}
                onJump={goTo}
              />
            </div>
          </div>
          <div className="mt-3 lg:hidden">
            <StepIndicator
              steps={STEPS}
              current={step}
              maxReached={maxReached}
              onJump={goTo}
            />
          </div>
        </div>
      </div>

      <div className="shell py-6 lg:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="min-w-0 flex-1">
            {/* STEP 1 — 상담 상품 */}
            {step === 0 && (
              <section className="animate-fade-up">
                <h1 className="text-[22px] font-bold text-navy-900 sm:text-[26px]">
                  어떤 상담을 받으시겠어요?
                </h1>
                <p className="mt-2 text-[15px] text-navy-500">
                  상담 시간과 깊이에 따라 상품을 선택할 수 있어요.
                </p>

                <ul className="mt-5 space-y-3">
                  {expert.products.map((p) => {
                    const active = p.id === productId;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => setProductId(p.id)}
                          aria-pressed={active}
                          className={cx(
                            "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5",
                            active
                              ? "border-teal-600 bg-teal-50/60 ring-1 ring-teal-600"
                              : "border-navy-200 bg-white hover:border-navy-300 hover:bg-navy-50/50",
                          )}
                        >
                          <span
                            className={cx(
                              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                              active
                                ? "border-teal-600 bg-teal-600 text-white"
                                : "border-navy-200 bg-white text-transparent",
                            )}
                            aria-hidden
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={3.2} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-[16.5px] font-bold text-navy-900">
                                {p.name}
                              </span>
                              {p.recommended && (
                                <span className="rounded-md bg-navy-900 px-1.5 py-0.5 text-[10.5px] font-bold text-white">
                                  가장 많이 선택
                                </span>
                              )}
                            </span>
                            <span className="mt-1.5 block text-[14px] leading-relaxed text-navy-500">
                              {p.description}
                            </span>
                            <span className="mt-2.5 flex flex-wrap items-center gap-3">
                              <span className="inline-flex items-center gap-1 text-[13px] text-navy-500">
                                <Clock3 className="h-3.5 w-3.5" strokeWidth={2.2} />
                                {p.minutes}분
                              </span>
                              <span className="text-[18px] font-extrabold text-navy-900">
                                {formatPrice(p.price)}
                                <span className="ml-0.5 text-[13px] font-semibold text-navy-500">
                                  원
                                </span>
                              </span>
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* STEP 2 — 상담 방식 */}
            {step === 1 && (
              <section className="animate-fade-up">
                <h1 className="text-[22px] font-bold text-navy-900 sm:text-[26px]">
                  어떤 방식으로 상담할까요?
                </h1>
                <p className="mt-2 text-[15px] text-navy-500">
                  전문가가 제공하는 상담 방식 중에서 선택해 주세요.
                </p>

                <ul className="mt-5 space-y-2.5">
                  {(["video", "phone", "chat"] as ConsultMethod[]).map((m) => {
                    const available = expert.methods.includes(m);
                    const active = method === m;
                    return (
                      <li key={m}>
                        <button
                          type="button"
                          disabled={!available}
                          onClick={() => setMethod(m)}
                          aria-pressed={active}
                          className={cx(
                            "flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200",
                            !available
                              ? "cursor-not-allowed border-navy-100 bg-navy-50/60 opacity-60"
                              : active
                                ? "border-teal-600 bg-teal-50/60 ring-1 ring-teal-600"
                                : "border-navy-200 bg-white hover:border-navy-300 hover:bg-navy-50/50",
                          )}
                        >
                          <span
                            className={cx(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors",
                              active
                                ? "border-teal-600 bg-teal-600"
                                : "border-navy-200 bg-white",
                            )}
                            aria-hidden
                          >
                            <span
                              className={cx(
                                "h-1.5 w-1.5 rounded-full",
                                active ? "bg-white" : "bg-transparent",
                              )}
                            />
                          </span>
                          <span
                            className={cx(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                              active
                                ? "bg-teal-600 text-white"
                                : "bg-navy-50 text-navy-600",
                            )}
                          >
                            <Icon name={METHOD_ICON[m]} className="h-[18px] w-[18px]" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15.5px] font-bold text-navy-900">
                              {METHOD_LABEL[m]}
                            </span>
                            <span className="mt-0.5 block text-[13px] leading-snug text-navy-500">
                              {available
                                ? METHOD_HINT[m]
                                : "이 전문가는 제공하지 않는 방식입니다"}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* STEP 3 — 날짜 */}
            {step === 2 && (
              <section className="animate-fade-up">
                <h1 className="text-[22px] font-bold text-navy-900 sm:text-[26px]">
                  언제 상담받으시겠어요?
                </h1>
                <p className="mt-2 text-[15px] text-navy-500">
                  초록 점이 있는 날짜에 예약할 수 있어요.
                </p>

                <div className="mt-5">
                  {today ? (
                    <>
                      <DayStrip
                        expertId={expert.id}
                        today={today}
                        value={dateKey}
                        onChange={(key) => {
                          setDateKey(key);
                          setTime(null);
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => setCalendarOpen((v) => !v)}
                        aria-expanded={calendarOpen}
                        className="mt-3 inline-flex h-11 items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 text-[13.5px] font-semibold text-navy-600 transition-colors hover:border-navy-300 hover:bg-navy-50"
                      >
                        <CalendarRange className="h-4 w-4" strokeWidth={2.2} />
                        {calendarOpen ? "달력 닫기" : "달력에서 선택"}
                      </button>

                      {calendarOpen && (
                        <div className="mt-3 animate-fade-up">
                          <MonthCalendar
                            expertId={expert.id}
                            today={today}
                            value={dateKey}
                            onChange={(key) => {
                              setDateKey(key);
                              setTime(null);
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-[92px] animate-pulse rounded-2xl bg-navy-100/70" />
                  )}
                </div>
              </section>
            )}

            {/* STEP 4 — 시간 */}
            {step === 3 && (
              <section className="animate-fade-up">
                <h1 className="text-[22px] font-bold text-navy-900 sm:text-[26px]">
                  시간을 선택해 주세요
                </h1>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-[15px] text-navy-500">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1.5 text-[14px] font-bold text-teal-800">
                    <CalendarDays className="h-4 w-4" strokeWidth={2.2} />
                    {dateKey ? formatDateKorean(dateKey) : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => goTo(2)}
                    className="text-[13.5px] font-semibold text-navy-400 underline-offset-2 hover:text-navy-700 hover:underline"
                  >
                    날짜 변경
                  </button>
                </p>

                <div className="mt-5 space-y-5">
                  {(
                    [
                      { label: "오전", list: slots.filter((s) => Number(s.slice(0, 2)) < 12) },
                      { label: "오후", list: slots.filter((s) => Number(s.slice(0, 2)) >= 12) },
                    ] as const
                  )
                    .filter((g) => g.list.length > 0)
                    .map((group) => (
                      <div key={group.label}>
                        <p className="text-[13px] font-bold text-navy-400">
                          {group.label}
                        </p>
                        <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
                          {group.list.map((s) => {
                            const active = time === s;
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setTime(s)}
                                aria-pressed={active}
                                className={cx(
                                  "flex min-h-[48px] items-center justify-center rounded-xl border text-[15px] font-bold transition-all duration-200 active:scale-[0.96]",
                                  active
                                    ? "border-teal-600 bg-teal-600 text-white shadow-[0_8px_18px_-10px_rgba(14,124,134,0.95)]"
                                    : "border-navy-200 bg-white text-navy-800 hover:border-teal-500 hover:bg-teal-50",
                                )}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>

                {slots.length === 0 && (
                  <p className="mt-5 rounded-xl border border-dashed border-navy-200 bg-white px-4 py-8 text-center text-[14.5px] text-navy-500">
                    선택한 날짜에 예약 가능한 시간이 없습니다. 다른 날짜를 선택해
                    주세요.
                  </p>
                )}
              </section>
            )}

            {/* STEP 5 — 상담 내용 */}
            {step === 4 && (
              <section className="animate-fade-up">
                <h1 className="text-[22px] font-bold text-navy-900 sm:text-[26px]">
                  전문가에게 미리 알려주세요
                </h1>
                <p className="mt-2 text-[15px] text-navy-500">
                  상담 전에 전달되어 더 구체적인 답변을 받을 수 있어요. (선택)
                </p>

                <div className="mt-5">
                  <label htmlFor="booking-note" className="sr-only">
                    상담 내용
                  </label>
                  <textarea
                    id="booking-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value.slice(0, 500))}
                    rows={7}
                    placeholder="전문가에게 미리 전달하고 싶은 내용을 작성해주세요."
                    className="field resize-none leading-relaxed"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[12.5px] text-navy-400">
                      상담 시작 전까지 수정할 수 있어요.
                    </p>
                    <p className="text-[12.5px] font-medium text-navy-400">
                      {note.length} / 500
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-navy-100 bg-white p-4">
                  <p className="text-[13.5px] font-bold text-navy-900">
                    이렇게 적으면 더 좋아요
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {QUESTION_HINTS.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2 text-[13.5px] text-navy-500"
                      >
                        <Check
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600"
                          strokeWidth={3}
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* STEP 6 — 예약 확인 */}
            {step === 5 && (
              <section className="animate-fade-up">
                <h1 className="text-[22px] font-bold text-navy-900 sm:text-[26px]">
                  예약 내용을 확인해 주세요
                </h1>
                <p className="mt-2 text-[15px] text-navy-500">
                  아래 내용으로 상담이 예약됩니다.
                </p>

                <div className="mt-5 overflow-hidden rounded-2xl border border-navy-100 bg-white">
                  <div className="flex items-center gap-3.5 border-b border-navy-100 bg-navy-50/60 p-4 sm:p-5">
                    <Portrait name={expert.name} accent={expert.accent} rounded="rounded-2xl" className="h-14 w-14" />
                    <div className="min-w-0">
                      <p className="text-[16.5px] font-bold text-navy-900">
                        {expert.name}
                      </p>
                      <p className="truncate text-[13.5px] text-navy-500">
                        {expert.title}
                      </p>
                    </div>
                  </div>

                  <dl className="divide-y divide-navy-100">
                    {[
                      { label: "상담 분야", value: CATEGORY_MAP[expert.categories[0]].name },
                      { label: "상담 상품", value: `${product.name} · ${product.minutes}분` },
                      { label: "상담 방식", value: method ? METHOD_LABEL[method] : "-" },
                      { label: "날짜", value: dateKey ? formatDateKorean(dateKey) : "-" },
                      { label: "시간", value: time ? formatTimeKorean(time) : "-" },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-start justify-between gap-4 px-4 py-3.5 sm:px-5"
                      >
                        <dt className="shrink-0 text-[14px] text-navy-500">
                          {row.label}
                        </dt>
                        <dd className="text-right text-[14.5px] font-semibold text-navy-900">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                    <div className="px-4 py-3.5 sm:px-5">
                      <dt className="text-[14px] text-navy-500">전달할 내용</dt>
                      <dd className="mt-1.5 whitespace-pre-line text-[14.5px] leading-relaxed text-navy-700">
                        {note.trim() || (
                          <span className="text-navy-300">작성한 내용이 없습니다</span>
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4 bg-navy-50/60 px-4 py-4 sm:px-5">
                      <dt className="text-[15px] font-bold text-navy-900">
                        결제 예정 금액
                      </dt>
                      <dd className="text-[22px] font-extrabold tracking-tight text-navy-900">
                        {formatPrice(product.price)}
                        <span className="ml-0.5 text-[13px] font-semibold text-navy-500">
                          원
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-navy-400">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
                  데모 예약입니다. 카드 정보 입력이나 실제 결제는 발생하지 않으며,
                  예약 내역은 이 브라우저에만 저장됩니다.
                </p>
              </section>
            )}

            {/* 데스크톱 네비게이션 */}
            <div className="mt-8 hidden items-center justify-between gap-3 lg:flex">
              <button
                type="button"
                onClick={() => (step === 0 ? router.back() : goTo(step - 1))}
                className="inline-flex h-12 items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-5 text-[15px] font-semibold text-navy-600 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
                {step === 0 ? "전문가 상세로" : "이전"}
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  disabled={!canAdvance}
                  onClick={() => goTo(step + 1)}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-navy-900 px-7 text-[15.5px] font-bold text-white transition-all duration-200 hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  다음
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={submit}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-teal-600 px-8 text-[15.5px] font-bold text-white shadow-[0_10px_24px_-12px_rgba(5,144,137,1)] transition-all duration-200 hover:bg-teal-700 disabled:opacity-60"
                >
                  {submitting ? "예약 처리 중..." : "상담 예약하기"}
                  {!submitting && <ArrowRight className="h-4 w-4" strokeWidth={2.4} />}
                </button>
              )}
            </div>
          </div>

          {/* 데스크톱 우측 요약 */}
          <aside className="hidden w-[336px] shrink-0 lg:block">
            <div className="sticky top-[188px]">{summary}</div>
          </aside>

          {/* 모바일 요약 */}
          <div className="lg:hidden">{summary}</div>
        </div>
      </div>

      {/* 모바일 Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white/97 px-4 py-3 pb-safe shadow-bar backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => (step === 0 ? router.back() : goTo(step - 1))}
            aria-label="이전 단계"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-navy-200 bg-white text-navy-600 transition-colors hover:bg-navy-50"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
          </button>

          <div
            className={cx(
              "min-w-0 flex-1",
              step < STEPS.length - 1 ? "hidden xs:block" : "hidden",
            )}
          >
            <p className="text-[11.5px] text-navy-400">총 상담료</p>
            <p className="text-[16px] font-extrabold leading-none text-navy-900">
              {formatPrice(product.price)}원
            </p>
          </div>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              disabled={!canAdvance}
              onClick={() => goTo(step + 1)}
              className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy-900 px-5 text-[15.5px] font-bold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:bg-navy-200 disabled:text-navy-400"
            >
              {canAdvance ? "다음 단계" : `${STEPS[step]}을 선택해 주세요`}
              {canAdvance && <ArrowRight className="h-4 w-4" strokeWidth={2.4} />}
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={submit}
              className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-[15.5px] font-bold text-white transition-all duration-200 disabled:opacity-60"
            >
              {submitting
                ? "예약 처리 중..."
                : `${formatPrice(product.price)}원 · 상담 예약하기`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
