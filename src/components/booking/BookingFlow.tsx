"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarRange,
  Check,
  ChevronLeft,
  Clock3,
  Plus,
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
import { createBookingCode, useAppStore } from "@/lib/store/AppStore";
import { useSlotPicker } from "@/lib/useAvailability";
import {
  cx,
  formatDateKorean,
  formatPrice,
  formatTimeKorean,
} from "@/lib/format";
import type { Booking, ConsultMethod, Expert } from "@/lib/types";

const STEPS = ["상담 상품", "상담 방식", "날짜", "시간", "상담 내용", "예약 확인"];

/** 아직 선택하지 않았을 때 CTA에 보여줄 안내 */
const NEED = [
  "상품을 선택해 주세요",
  "상담 방식을 선택해 주세요",
  "날짜를 선택해 주세요",
  "시간을 선택해 주세요",
  "",
  "",
];

const NOTE_TEMPLATES = [
  { label: "현재 상황", text: "현재 상황: " },
  { label: "가장 궁금한 점", text: "가장 궁금한 점: " },
  { label: "시도해 본 방법", text: "시도해 본 방법: " },
];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function BookingFlow({ expert }: { expert: Expert }) {
  const router = useRouter();
  const params = useSearchParams();
  const { addBooking, pushToast } = useAppStore();
  const noteRef = useRef<HTMLTextAreaElement>(null);

  // 상세에서 상품을 고르고 들어오면 상품 단계는 건너뛴다 (언제든 되돌아가 바꿀 수 있음)
  const productFromQuery = params.get("product");
  const hasProduct = expert.products.some((p) => p.id === productFromQuery);
  // 상세의 '상담 가능 시간'에서 날짜를 누르고 들어오면 그 날짜를 미리 선택해 둔다
  const dateFromQuery = params.get("date");
  const presetDate = dateFromQuery && /^\d{4}-\d{2}-\d{2}$/.test(dateFromQuery) ? dateFromQuery : null;

  const [step, setStep] = useState(hasProduct ? 1 : 0);
  const [maxReached, setMaxReached] = useState(hasProduct ? 1 : 0);
  const [productId, setProductId] = useState(() =>
    hasProduct
      ? (productFromQuery as string)
      : (expert.products.find((p) => p.recommended)?.id ?? expert.products[0].id),
  );
  const [method, setMethod] = useState<ConsultMethod | null>(
    expert.methods.length === 1 ? expert.methods[0] : null,
  );
  // 미리 선택한 날짜가 예약 불가면 아래 effect가 비운다
  const [dateKey, setDateKey] = useState<string | null>(presetDate);
  const [time, setTime] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const product = expert.products.find((p) => p.id === productId) ?? expert.products[0];

  // 선택한 상품 길이 기준 — 저장된 예약과 겹치는 시간은 자동으로 빠진다
  const { now, getOpen, getStates } = useSlotPicker(expert.id, product.minutes);
  const today = now ? startOfDay(now) : null;
  const slotStates = dateKey ? getStates(dateKey) : [];

  // 상품을 바꿔 길이가 달라지면, 더 이상 가능하지 않은 선택은 비운다
  useEffect(() => {
    if (!now || !dateKey) return;
    const open = getOpen(dateKey);
    if (open.length === 0) {
      setDateKey(null);
      setTime(null);
    } else if (time && !open.includes(time)) {
      setTime(null);
    }
  }, [product.minutes, now, dateKey, time, getOpen]);

  const canAdvance = [true, Boolean(method), Boolean(dateKey), Boolean(time), true, true][step];
  const isLast = step === STEPS.length - 1;

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, next));
    setStep(clamped);
    setMaxReached((m) => Math.max(m, clamped));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addTemplate = (text: string) => {
    setNote((prev) => {
      const base = prev.trimEnd();
      return `${base}${base ? "\n" : ""}${text}`.slice(0, 500);
    });
    requestAnimationFrame(() => {
      const el = noteRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  const submit = () => {
    if (!dateKey || !time || !method || submitting) return;
    setSubmitting(true);
    const booking: Booking = {
      id: `${Date.now()}`,
      code: createBookingCode(),
      expertId: expert.id,
      expertName: expert.name,
      expertTitle: expert.title,
      expertAccent: expert.accent,
      expertPhoto: expert.photo,
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
    const result = addBooking(booking);
    if (!result.ok) {
      // 다른 탭 등에서 같은 시간이 먼저 예약된 경우 — 시간 선택으로 되돌린다
      setSubmitting(false);
      setTime(null);
      pushToast({ message: result.reason, tone: "warn" });
      goTo(3);
      return;
    }
    // 데모 결제 처리 (실제 PG 연동 없음)
    window.setTimeout(() => {
      router.push(`/booking/complete?code=${booking.code}`);
    }, 450);
  };

  /** 지금까지 고른 내용 — 탭하면 그 단계로 돌아간다 */
  const trail = [
    { step: 0, label: "상품", value: `${product.name} · ${formatPrice(product.price)}원` },
    { step: 1, label: "방식", value: method ? METHOD_LABEL[method] : null },
    { step: 2, label: "날짜", value: dateKey ? formatDateKorean(dateKey) : null },
    { step: 3, label: "시간", value: time ? formatTimeKorean(time) : null },
  ].filter((t) => t.step < step && t.value);

  const summaryRows = [
    { step: 0, label: "상담 상품", value: product.name },
    { step: 1, label: "상담 방식", value: method ? METHOD_LABEL[method] : null },
    { step: 2, label: "날짜", value: dateKey ? formatDateKorean(dateKey) : null },
    {
      step: 3,
      label: "시간",
      value: time ? `${formatTimeKorean(time)} · ${product.minutes}분` : null,
    },
  ];

  const morning = slotStates.filter((s) => Number(s.time.slice(0, 2)) < 12);
  const afternoon = slotStates.filter((s) => Number(s.time.slice(0, 2)) >= 12);

  return (
    <div className="pb-36 lg:pb-16">
      {/* 상단: 전문가 + 진행 단계 */}
      <div className="sticky top-16 z-30 border-b border-navy-100 bg-white lg:top-[72px]">
        <div className="shell py-3 lg:py-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/experts/${expert.id}`}
              aria-label="전문가 상세로 돌아가기"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
            </Link>
            <Portrait
              name={expert.name}
              accent={expert.accent}
              photo={expert.photo}
              rounded="rounded-xl"
              sizes="40px"
              className="hidden h-10 w-10 shrink-0 sm:block lg:hidden"
            />
            <p className="min-w-0 flex-1 truncate text-[24.5px] font-bold text-navy-900">
              {expert.name} 전문가 예약
            </p>
            <div className="hidden lg:block">
              <StepIndicator steps={STEPS} current={step} maxReached={maxReached} onJump={goTo} />
            </div>
          </div>
          <div className="mt-3 lg:hidden">
            <StepIndicator steps={STEPS} current={step} maxReached={maxReached} onJump={goTo} />
          </div>
        </div>
      </div>

      <div className="shell py-6 lg:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="min-w-0 flex-1">
            {/* 이전 단계 선택 내용 (모바일 — 데스크톱은 우측 요약) */}
            {trail.length > 0 && !isLast && (
              <ul
                className="-mt-1 mb-5 flex flex-wrap gap-2 lg:hidden"
                aria-label="지금까지 선택한 내용"
              >
                {trail.map((t) => (
                  <li key={t.label}>
                    <button
                      type="button"
                      onClick={() => goTo(t.step)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border border-navy-100 bg-white px-3 py-1 text-left text-[19.5px] text-navy-600 transition-colors hover:border-navy-300"
                    >
                      <Check className="h-3.5 w-3.5 shrink-0 text-teal-600" strokeWidth={3} />
                      <span className="shrink-0 text-navy-400">{t.label}</span>
                      <span className="font-semibold text-navy-800">{t.value}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* STEP 1 — 상담 상품 */}
            {step === 0 && (
              <section className="animate-fade-up">
                <h1 className="text-[35px] font-bold text-navy-900 sm:text-[42px]">
                  어떤 상담을 받으시겠어요?
                </h1>
                <p className="mt-2 text-[23px] text-navy-500">
                  시간과 깊이에 따라 고를 수 있어요.
                </p>

                <ul className="mt-6 space-y-3">
                  {expert.products.map((p) => {
                    const active = p.id === productId;
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => setProductId(p.id)}
                          aria-pressed={active}
                          className={cx(
                            "flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-colors duration-200",
                            active
                              ? "border-teal-600 bg-teal-50/60 ring-1 ring-teal-600"
                              : "border-navy-200 bg-white hover:border-navy-300",
                          )}
                        >
                          <span
                            className={cx(
                              "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
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
                              <span className="text-[27px] font-bold text-navy-900">
                                {p.name}
                              </span>
                              {p.recommended && (
                                <span className="rounded-md bg-navy-100 px-2 py-0.5 text-[18.5px] font-bold text-navy-700">
                                  가장 많이 선택
                                </span>
                              )}
                            </span>
                            <span className="mt-1 block text-[22px] leading-relaxed text-navy-500">
                              {p.description}
                            </span>
                            <span className="mt-2.5 flex flex-wrap items-baseline gap-3">
                              <span className="text-[31.5px] font-extrabold text-navy-900">
                                {formatPrice(p.price)}
                                <span className="ml-0.5 text-[20.5px] font-semibold text-navy-500">원</span>
                              </span>
                              <span className="inline-flex items-center gap-1 text-[20.5px] text-navy-500">
                                <Clock3 className="h-4 w-4" strokeWidth={2.2} />
                                {p.minutes}분
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
                <h1 className="text-[35px] font-bold text-navy-900 sm:text-[42px]">
                  어떤 방식으로 상담할까요?
                </h1>

                <ul className="mt-6 space-y-2.5">
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
                            "flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-colors duration-200",
                            !available
                              ? "cursor-not-allowed border-navy-100 bg-navy-50/60 opacity-60"
                              : active
                                ? "border-teal-600 bg-teal-50/60 ring-1 ring-teal-600"
                                : "border-navy-200 bg-white hover:border-navy-300",
                          )}
                        >
                          <span
                            className={cx(
                              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                              active ? "bg-teal-600 text-white" : "bg-navy-50 text-navy-600",
                            )}
                          >
                            <Icon name={METHOD_ICON[m]} className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[25.5px] font-bold text-navy-900">
                              {METHOD_LABEL[m]}
                            </span>
                            <span className="mt-0.5 block text-[20.5px] leading-snug text-navy-500">
                              {available ? METHOD_HINT[m] : "이 전문가는 제공하지 않는 방식이에요"}
                            </span>
                          </span>
                          <span
                            className={cx(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                              active
                                ? "border-teal-600 bg-teal-600 text-white"
                                : "border-navy-200 text-transparent",
                            )}
                            aria-hidden
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={3.2} />
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
                <h1 className="text-[35px] font-bold text-navy-900 sm:text-[42px]">
                  언제 상담받으시겠어요?
                </h1>
                <p className="mt-2 text-[23px] text-navy-500">
                  {product.minutes}분 상담이 가능한 날짜만 선택할 수 있어요.
                </p>

                <div className="mt-6">
                  {today ? (
                    <>
                      <DayStrip
                        getSlots={getOpen}
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
                        className="mt-3 inline-flex h-11 items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 text-[20.5px] font-semibold text-navy-600 transition-colors hover:border-navy-300 lg:hidden"
                      >
                        <CalendarRange className="h-4 w-4" strokeWidth={2.2} />
                        {calendarOpen ? "달력 닫기" : "달력에서 선택"}
                      </button>
                      {/* 데스크톱은 달력을 항상 펼쳐 둔다 */}
                      <div className={cx("mt-3", calendarOpen ? "block" : "hidden lg:block")}>
                        <MonthCalendar
                          getSlots={getOpen}
                          today={today}
                          value={dateKey}
                          onChange={(key) => {
                            setDateKey(key);
                            setTime(null);
                          }}
                        />
                      </div>
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
                <h1 className="text-[35px] font-bold text-navy-900 sm:text-[42px]">
                  몇 시가 좋으세요?
                </h1>
                <p className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-[22px] font-bold text-teal-800">
                    <CalendarDays className="h-4 w-4" strokeWidth={2.2} />
                    {dateKey ? formatDateKorean(dateKey) : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => goTo(2)}
                    className="inline-flex min-h-[40px] items-center px-2 text-[20.5px] font-semibold text-navy-400 underline-offset-2 hover:text-navy-700 hover:underline"
                  >
                    날짜 변경
                  </button>
                </p>

                <div className="mt-6 space-y-6">
                  {[
                    { label: "오전", list: morning },
                    { label: "오후", list: afternoon },
                  ]
                    .filter((g) => g.list.length > 0)
                    .map((group) => (
                      <div key={group.label}>
                        <p className="text-[20.5px] font-bold text-navy-400">{group.label}</p>
                        <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
                          {group.list.map((s) => {
                            const active = time === s.time;
                            const blocked = s.state !== "open";
                            return (
                              <button
                                key={s.time}
                                type="button"
                                disabled={blocked}
                                onClick={() => setTime(s.time)}
                                aria-pressed={active}
                                className={cx(
                                  "flex min-h-[56px] flex-col items-center justify-center rounded-xl border text-[23px] font-bold transition-colors duration-150",
                                  active
                                    ? "border-teal-600 bg-teal-600 text-white"
                                    : blocked
                                      ? "cursor-not-allowed border-navy-100 bg-navy-50/70 text-navy-300"
                                      : "border-navy-200 bg-white text-navy-800 hover:border-teal-500 hover:bg-teal-50",
                                )}
                              >
                                {s.time}
                                {blocked && (
                                  <span className="text-[16.5px] font-semibold leading-tight">
                                    {s.state === "taken" ? "예약됨" : "내 다른 예약"}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                  {slotStates.every((s) => s.state !== "open") && (
                    <p className="rounded-xl border border-dashed border-navy-200 bg-white px-4 py-8 text-center text-[22px] text-navy-500">
                      이 날짜에는 예약 가능한 시간이 없어요. 다른 날짜를 선택해 주세요.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* STEP 5 — 상담 내용 */}
            {step === 4 && (
              <section className="animate-fade-up">
                <h1 className="text-[35px] font-bold text-navy-900 sm:text-[42px]">
                  전문가에게 미리 알려주세요
                </h1>
                <p className="mt-2 text-[23px] text-navy-500">
                  선택 사항이에요. 적어 주시면 상담이 더 구체적이에요.
                </p>

                <div className="mt-5 flex flex-wrap gap-2" aria-label="예시 문구 추가">
                  {NOTE_TEMPLATES.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => addTemplate(t.text)}
                      className="inline-flex min-h-[40px] items-center gap-1 rounded-full border border-navy-200 bg-white px-3.5 text-[20px] font-medium text-navy-600 transition-colors hover:border-teal-400 hover:text-teal-800"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
                      {t.label}
                    </button>
                  ))}
                </div>

                <label htmlFor="booking-note" className="sr-only">
                  상담 내용
                </label>
                <textarea
                  id="booking-note"
                  ref={noteRef}
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 500))}
                  rows={7}
                  placeholder="전문가에게 미리 전달하고 싶은 내용을 작성해주세요."
                  className="field mt-3 resize-none leading-relaxed"
                />
                <p className="mt-2 text-right text-[19.5px] text-navy-400">{note.length} / 500</p>
              </section>
            )}

            {/* STEP 6 — 예약 확인 */}
            {step === 5 && (
              <section className="animate-fade-up">
                <h1 className="text-[35px] font-bold text-navy-900 sm:text-[42px]">
                  예약 내용을 확인해 주세요
                </h1>

                <div className="mt-6 overflow-hidden rounded-2xl border border-navy-100 bg-white">
                  <div className="flex items-center gap-4 border-b border-navy-100 p-5">
                    <Portrait
                      name={expert.name}
                      accent={expert.accent}
                      photo={expert.photo}
                      rounded="rounded-xl"
                      sizes="56px"
                      className="h-14 w-14 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[25.5px] font-bold text-navy-900">{expert.name}</p>
                      <p className="truncate text-[20.5px] text-navy-500">{expert.title}</p>
                    </div>
                  </div>

                  <div className="divide-y divide-navy-100">
                    {summaryRows.map((row) => (
                      <div key={row.label} className="flex items-center gap-4 px-5 py-4">
                        <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-4">
                          <p className="text-[18.5px] text-navy-400 sm:w-[112px] sm:shrink-0 sm:text-[20.5px] sm:text-navy-500">
                            {row.label}
                          </p>
                          <p className="mt-0.5 text-[22px] font-semibold text-navy-900 sm:mt-0 sm:text-[23px]">
                            {row.value}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => goTo(row.step)}
                          className="shrink-0 rounded-lg px-2 py-1.5 text-[19.5px] font-semibold text-teal-700 hover:bg-teal-50"
                        >
                          변경
                        </button>
                      </div>
                    ))}
                    <div className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-4">
                          <p className="text-[18.5px] text-navy-400 sm:w-[112px] sm:shrink-0 sm:text-[20.5px] sm:text-navy-500">
                            전달 내용
                          </p>
                          <p className="mt-0.5 text-[20.5px] text-navy-400 sm:mt-0">
                            {note.trim() ? "작성함" : "작성하지 않음"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => goTo(4)}
                          className="shrink-0 rounded-lg px-2 py-1.5 text-[19.5px] font-semibold text-teal-700 hover:bg-teal-50"
                        >
                          {note.trim() ? "수정" : "작성"}
                        </button>
                      </div>
                      {note.trim() && (
                        <p className="mt-2 whitespace-pre-line rounded-xl bg-canvas px-4 py-3 text-[20.5px] leading-relaxed text-navy-700">
                          {note.trim()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-4 bg-canvas px-5 py-5">
                      <p className="text-[23px] font-bold text-navy-900">결제 예정 금액</p>
                      <p className="text-[33px] font-extrabold tracking-tight text-navy-900">
                        {formatPrice(product.price)}
                        <span className="ml-0.5 text-[20.5px] font-semibold text-navy-500">원</span>
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-3 flex items-start gap-2 text-[19.5px] leading-relaxed text-navy-400">
                  <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
                  데모 예약입니다. 실제 결제는 발생하지 않으며 예약은 이 브라우저에 저장됩니다.
                </p>
              </section>
            )}

            {/* 데스크톱 이동 버튼 */}
            <div className="mt-10 hidden items-center justify-between gap-3 lg:flex">
              <button
                type="button"
                onClick={() => (step === 0 ? router.back() : goTo(step - 1))}
                className="inline-flex h-14 items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-6 text-[22px] font-semibold text-navy-600 transition-colors hover:bg-navy-50"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
                {step === 0 ? "전문가 상세로" : "이전"}
              </button>

              {!isLast ? (
                <button
                  type="button"
                  disabled={!canAdvance}
                  onClick={() => goTo(step + 1)}
                  className="inline-flex h-14 items-center gap-2 rounded-xl bg-navy-900 px-8 text-[22px] font-bold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-navy-200 disabled:text-navy-400"
                >
                  {canAdvance ? `다음: ${STEPS[step + 1]}` : NEED[step]}
                  {canAdvance && <ArrowRight className="h-4 w-4" strokeWidth={2.4} />}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={submit}
                  className="inline-flex h-14 items-center gap-2 rounded-xl bg-teal-600 px-9 text-[23px] font-bold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
                >
                  {submitting ? "예약 처리 중..." : "상담 예약하기"}
                </button>
              )}
            </div>
          </div>

          {/* 데스크톱 우측 요약 — 지금까지의 선택이 항상 보인다 */}
          <aside className="hidden w-[372px] shrink-0 lg:block">
            <div className="sticky top-[196px] rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
              <div className="flex items-center gap-3.5">
                <Portrait
                  name={expert.name}
                  accent={expert.accent}
                  photo={expert.photo}
                  rounded="rounded-xl"
                  sizes="56px"
                  className="h-14 w-14 shrink-0"
                />
                <div className="min-w-0">
                  <p className="truncate text-[25.5px] font-bold text-navy-900">{expert.name}</p>
                  <p className="flex items-center gap-1.5 text-[19.5px] text-navy-500">
                    <Stars value={expert.rating} size={13} />
                    {expert.rating.toFixed(1)} · 후기 {expert.reviewCount}
                  </p>
                </div>
              </div>

              <dl className="mt-5 space-y-1 border-t border-navy-100 pt-4">
                {summaryRows.map((row) => {
                  const current = row.step === step;
                  const reachable = row.step <= maxReached;
                  return (
                    <div key={row.label}>
                      <button
                        type="button"
                        disabled={!reachable}
                        onClick={() => goTo(row.step)}
                        className={cx(
                          "flex w-full items-start justify-between gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                          current && "bg-teal-50",
                          reachable && !current && "hover:bg-navy-50",
                        )}
                      >
                        <dt className={cx("shrink-0 text-[20.5px]", current ? "font-semibold text-teal-800" : "text-navy-400")}>
                          {row.label}
                        </dt>
                        <dd
                          className={cx(
                            "text-right text-[20.5px] font-semibold",
                            row.value ? "text-navy-900" : current ? "text-teal-700" : "text-navy-300",
                          )}
                        >
                          {row.value ?? (current ? "지금 선택" : "선택 전")}
                        </dd>
                      </button>
                    </div>
                  );
                })}
              </dl>

              <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
                <span className="text-[22px] text-navy-600">총 상담료</span>
                <span className="text-[34px] font-extrabold tracking-tight text-navy-900">
                  {formatPrice(product.price)}
                  <span className="ml-0.5 text-[20.5px] font-semibold text-navy-500">원</span>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 모바일 Sticky CTA (예약 중에는 하단 탭바를 숨긴다) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-bar lg:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => (step === 0 ? router.back() : goTo(step - 1))}
            aria-label="이전 단계"
            className="flex h-[52px] w-12 shrink-0 items-center justify-center rounded-xl border border-navy-200 bg-white text-navy-600"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.2} />
          </button>
          {/* 가격은 선택 칩에 이미 보이므로, 결제 직전 단계에서만 함께 보여준다 */}
          <div className={cx("min-w-0 shrink-0", isLast ? "block" : "hidden")}>
            <p className="text-[17px] text-navy-400">총 상담료</p>
            <p className="text-[22px] font-extrabold leading-tight text-navy-900">
              {formatPrice(product.price)}원
            </p>
          </div>
          {!isLast ? (
            <button
              type="button"
              disabled={!canAdvance}
              onClick={() => goTo(step + 1)}
              className="inline-flex h-[52px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy-900 px-4 text-[21.5px] font-bold text-white transition-colors disabled:bg-navy-200 disabled:text-navy-500"
            >
              <span className="truncate">
                {canAdvance ? `다음 · ${STEPS[step + 1]}` : NEED[step]}
              </span>
              {canAdvance && <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2.4} />}
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={submit}
              className="inline-flex h-[52px] min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-teal-600 px-3 text-[21px] font-bold text-white transition-colors disabled:opacity-60 xs:text-[22px]"
            >
              {submitting ? "예약 처리 중..." : "상담 예약하기"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
