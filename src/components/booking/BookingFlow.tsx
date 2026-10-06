"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft } from "lucide-react";
import { StepIndicator } from "@/components/booking/StepIndicator";
import {
  BookingSummary,
  ConfirmStep,
  DateStep,
  MethodStep,
  NoteStep,
  ProductStep,
  TimeStep,
  type SummaryRow,
} from "@/components/booking/steps";
import { Portrait } from "@/components/ui/Portrait";
import { CATEGORY_MAP, METHOD_LABEL } from "@/lib/data/categories";
import { cx, formatDateKorean, formatPrice, formatTimeKorean } from "@/lib/format";
import { createBookingCode, useAppStore } from "@/lib/store/AppStore";
import { useSlotPicker } from "@/lib/useAvailability";
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

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function BookingFlow({ expert }: { expert: Expert }) {
  const router = useRouter();
  const params = useSearchParams();
  const { addBooking, pushToast } = useAppStore();

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
    if (clamped === step) return;
    setStep(clamped);
    setMaxReached((m) => Math.max(m, clamped));
    // 단계를 주소에 남겨, 휴대폰 '뒤로'가 예약을 벗어나지 않고 이전 단계로 가게 한다
    const url = new URL(window.location.href);
    url.searchParams.set("step", String(clamped + 1));
    window.history.pushState(null, "", url.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 뒤로·앞으로 이동으로 주소의 단계가 바뀌면 화면도 맞춘다 (가 본 단계까지만)
  const stepRef = useRef(step);
  stepRef.current = step;
  const maxRef = useRef(maxReached);
  maxRef.current = maxReached;
  const initialStep = hasProduct ? 1 : 0;
  const stepParam = params.get("step");
  useEffect(() => {
    const target = stepParam ? Number(stepParam) - 1 : initialStep;
    if (!Number.isInteger(target) || target < 0 || target > maxRef.current) return;
    if (target !== stepRef.current) setStep(target);
  }, [stepParam, initialStep]);

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

  const summaryRows: SummaryRow[] = [
    { step: 0, label: "상담 상품", value: product.name },
    { step: 1, label: "상담 방식", value: method ? METHOD_LABEL[method] : null },
    { step: 2, label: "날짜", value: dateKey ? formatDateKorean(dateKey) : null },
    {
      step: 3,
      label: "시간",
      value: time ? `${formatTimeKorean(time)} · ${product.minutes}분` : null,
    },
  ];

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
            <p className="min-w-0 flex-1 truncate text-2xl font-bold text-navy-900">
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
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border border-navy-100 bg-white px-3 py-1 text-left text-base text-navy-600 transition-colors hover:border-navy-300"
                    >
                      <Check className="h-3.5 w-3.5 shrink-0 text-teal-600" strokeWidth={3} />
                      <span className="shrink-0 text-navy-400">{t.label}</span>
                      <span className="font-semibold text-navy-800">{t.value}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {step === 0 && <ProductStep products={expert.products} value={productId} onChange={setProductId} />}

            {step === 1 && <MethodStep methods={expert.methods} value={method} onChange={setMethod} />}

            {step === 2 && (
              <DateStep
                minutes={product.minutes}
                today={today}
                getOpen={getOpen}
                value={dateKey}
                onChange={(key) => {
                  setDateKey(key);
                  setTime(null);
                }}
              />
            )}

            {step === 3 && dateKey && (
              <TimeStep
                dateKey={dateKey}
                states={slotStates}
                value={time}
                onChange={setTime}
                onChangeDate={() => goTo(2)}
              />
            )}

            {step === 4 && <NoteStep value={note} onChange={setNote} />}

            {step === 5 && (
              <ConfirmStep expert={expert} rows={summaryRows} note={note} price={product.price} onEdit={goTo} />
            )}

            {/* 데스크톱 이동 버튼 */}
            <div className="mt-10 hidden items-center justify-between gap-3 lg:flex">
              <button
                type="button"
                onClick={() => (step === 0 ? router.back() : goTo(step - 1))}
                className="inline-flex h-14 items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-6 text-lg font-semibold text-navy-600 transition-colors hover:bg-navy-50"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
                {step === 0 ? "전문가 상세로" : "이전"}
              </button>

              {!isLast ? (
                <button
                  type="button"
                  disabled={!canAdvance}
                  onClick={() => goTo(step + 1)}
                  className="inline-flex h-14 items-center gap-2 rounded-xl bg-navy-900 px-8 text-lg font-bold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-navy-200 disabled:text-navy-400"
                >
                  {canAdvance ? `다음: ${STEPS[step + 1]}` : NEED[step]}
                  {canAdvance && <ArrowRight className="h-4 w-4" strokeWidth={2.4} />}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={submit}
                  className="inline-flex h-14 items-center gap-2 rounded-xl bg-teal-600 px-9 text-xl font-bold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
                >
                  {submitting ? "예약 처리 중..." : "상담 예약하기"}
                </button>
              )}
            </div>
          </div>

          <BookingSummary
            expert={expert}
            rows={summaryRows}
            step={step}
            maxReached={maxReached}
            price={product.price}
            onJump={goTo}
          />
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
            <p className="text-xs text-navy-400">총 상담료</p>
            <p className="text-lg font-extrabold leading-tight text-navy-900">
              {formatPrice(product.price)}원
            </p>
          </div>
          {!isLast ? (
            <button
              type="button"
              disabled={!canAdvance}
              onClick={() => goTo(step + 1)}
              className="inline-flex h-[52px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy-900 px-4 text-lg font-bold text-white transition-colors disabled:bg-navy-200 disabled:text-navy-500"
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
              className="inline-flex h-[52px] min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-xl bg-teal-600 px-3 text-lg font-bold text-white transition-colors disabled:opacity-60 xs:text-lg"
            >
              {submitting ? "예약 처리 중..." : "상담 예약하기"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
