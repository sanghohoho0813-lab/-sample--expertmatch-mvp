"use client";

import { useRef, useState } from "react";
import { CalendarDays, CalendarRange, Check, Clock3, Plus, ShieldCheck } from "lucide-react";
import { DayStrip } from "@/components/booking/DayStrip";
import { MonthCalendar } from "@/components/booking/MonthCalendar";
import { Icon } from "@/components/ui/Icon";
import { Portrait } from "@/components/ui/Portrait";
import { Stars } from "@/components/ui/Stars";
import type { SlotState } from "@/lib/availability";
import { METHOD_HINT, METHOD_ICON, METHOD_LABEL } from "@/lib/data/categories";
import { cx, formatDateKorean, formatPrice } from "@/lib/format";
import type { ConsultationProduct, ConsultMethod, Expert } from "@/lib/types";

/*
 * 예약 6단계의 각 화면.
 * 상태는 BookingFlow 가 들고, 여기서는 보여 주고 고른 값을 알리기만 한다.
 */

/** 확인 화면·우측 요약의 한 줄 (value 가 없으면 아직 고르지 않은 단계) */
export interface SummaryRow {
  step: number;
  label: string;
  value: string | null;
}

export function ProductStep({
  products,
  value,
  onChange,
}: {
  products: ConsultationProduct[];
  value: string;
  onChange: (productId: string) => void;
}) {
  return (
    <section className="animate-fade-up">
      <h1 className="text-6xl font-bold text-navy-900 sm:text-7xl">
        어떤 상담을 받으시겠어요?
      </h1>
      <p className="mt-2 text-xl text-navy-500">
        시간과 깊이에 따라 고를 수 있어요.
      </p>

      <ul className="mt-6 space-y-3">
        {products.map((p) => {
          const active = p.id === value;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onChange(p.id)}
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
                    <span className="text-3xl font-bold text-navy-900">
                      {p.name}
                    </span>
                    {p.recommended && (
                      <span className="rounded-md bg-navy-100 px-2 py-0.5 text-sm font-bold text-navy-700">
                        가장 많이 선택
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-lg leading-relaxed text-navy-500">
                    {p.description}
                  </span>
                  <span className="mt-2.5 flex flex-wrap items-baseline gap-3">
                    <span className="text-4xl font-extrabold text-navy-900">
                      {formatPrice(p.price)}
                      <span className="ml-0.5 text-md font-semibold text-navy-500">원</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-md text-navy-500">
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
  );
}

export function MethodStep({
  methods,
  value,
  onChange,
}: {
  methods: ConsultMethod[];
  value: ConsultMethod | null;
  onChange: (method: ConsultMethod) => void;
}) {
  return (
    <section className="animate-fade-up">
      <h1 className="text-6xl font-bold text-navy-900 sm:text-7xl">
        어떤 방식으로 상담할까요?
      </h1>

      <ul className="mt-6 space-y-2.5">
        {(["video", "phone", "chat"] as ConsultMethod[])
          .filter((m) => methods.includes(m))
          .map((m) => {
          const active = value === m;
          return (
            <li key={m}>
              <button
                type="button"
                onClick={() => onChange(m)}
                aria-pressed={active}
                className={cx(
                  "flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-colors duration-200",
                  active
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
                  <span className="block text-2xl font-bold text-navy-900">
                    {METHOD_LABEL[m]}
                  </span>
                  <span className="mt-0.5 block text-md leading-snug text-navy-500">
                    {METHOD_HINT[m]}
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
  );
}

export function DateStep({
  minutes,
  today,
  getOpen,
  value,
  onChange,
}: {
  minutes: number;
  /** 마운트 전(null)에는 자리표시만 그린다 */
  today: Date | null;
  getOpen: (dateKey: string) => string[];
  value: string | null;
  onChange: (dateKey: string) => void;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  return (
    <section className="animate-fade-up">
      <h1 className="text-6xl font-bold text-navy-900 sm:text-7xl">
        언제 상담받으시겠어요?
      </h1>
      <p className="mt-2 text-xl text-navy-500">
        {minutes}분 상담이 가능한 날짜만 선택할 수 있어요.
      </p>

      <div className="mt-6">
        {today ? (
          <>
            <DayStrip
              getSlots={getOpen}
              today={today}
              value={value}
              onChange={onChange}
            />
            <button
              type="button"
              onClick={() => setCalendarOpen((v) => !v)}
              aria-expanded={calendarOpen}
              className="mt-3 inline-flex h-11 items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3.5 text-md font-semibold text-navy-600 transition-colors hover:border-navy-300 lg:hidden"
            >
              <CalendarRange className="h-4 w-4" strokeWidth={2.2} />
              {calendarOpen ? "달력 닫기" : "달력에서 선택"}
            </button>
            {/* 데스크톱은 달력을 항상 펼쳐 둔다 */}
            <div className={cx("mt-3", calendarOpen ? "block" : "hidden lg:block")}>
              <MonthCalendar
                getSlots={getOpen}
                today={today}
                value={value}
                onChange={onChange}
              />
            </div>
          </>
        ) : (
          <div className="h-[92px] animate-pulse rounded-2xl bg-navy-100/70" />
        )}
      </div>
    </section>
  );
}

export function TimeStep({
  dateKey,
  states,
  value,
  onChange,
  onChangeDate,
}: {
  dateKey: string;
  states: { time: string; state: SlotState }[];
  value: string | null;
  onChange: (time: string) => void;
  onChangeDate: () => void;
}) {
  const morning = states.filter((s) => Number(s.time.slice(0, 2)) < 12);
  const afternoon = states.filter((s) => Number(s.time.slice(0, 2)) >= 12);
  return (
    <section className="animate-fade-up">
      <h1 className="text-6xl font-bold text-navy-900 sm:text-7xl">
        몇 시가 좋으세요?
      </h1>
      <p className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-lg font-bold text-teal-800">
          <CalendarDays className="h-4 w-4" strokeWidth={2.2} />
          {formatDateKorean(dateKey)}
        </span>
        <button
          type="button"
          onClick={onChangeDate}
          className="inline-flex min-h-[40px] items-center px-2 text-md font-semibold text-navy-400 underline-offset-2 hover:text-navy-700 hover:underline"
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
              <p className="text-md font-bold text-navy-400">{group.label}</p>
              <div className="mt-2.5 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
                {group.list.map((s) => {
                  const active = value === s.time;
                  const blocked = s.state !== "open";
                  return (
                    <button
                      key={s.time}
                      type="button"
                      disabled={blocked}
                      onClick={() => onChange(s.time)}
                      aria-pressed={active}
                      className={cx(
                        "flex min-h-[56px] flex-col items-center justify-center rounded-xl border text-xl font-bold transition-colors duration-150",
                        active
                          ? "border-teal-600 bg-teal-600 text-white"
                          : blocked
                            ? "cursor-not-allowed border-navy-100 bg-navy-50/70 text-navy-300"
                            : "border-navy-200 bg-white text-navy-800 hover:border-teal-500 hover:bg-teal-50",
                      )}
                    >
                      {s.time}
                      {blocked && (
                        <span className="text-xs font-semibold leading-tight">
                          {s.state === "taken" ? "예약됨" : "내 다른 예약"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

        {states.every((s) => s.state !== "open") && (
          <p className="rounded-xl border border-dashed border-navy-200 bg-white px-4 py-8 text-center text-lg text-navy-500">
            이 날짜에는 예약 가능한 시간이 없어요. 다른 날짜를 선택해 주세요.
          </p>
        )}
      </div>
    </section>
  );
}

export const MAX_NOTE = 500;

const NOTE_TEMPLATES = [
  { label: "현재 상황", text: "현재 상황: " },
  { label: "가장 궁금한 점", text: "가장 궁금한 점: " },
  { label: "시도해 본 방법", text: "시도해 본 방법: " },
];

export function NoteStep({ value, onChange }: { value: string; onChange: (note: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  /** 예시 문구를 새 줄로 덧붙이고 커서를 끝으로 */
  const addTemplate = (text: string) => {
    const base = value.trimEnd();
    onChange(`${base}${base ? "\n" : ""}${text}`.slice(0, MAX_NOTE));
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  return (
    <section className="animate-fade-up">
      <h1 className="text-6xl font-bold text-navy-900 sm:text-7xl">
        전문가에게 미리 알려주세요
      </h1>
      <p className="mt-2 text-xl text-navy-500">
        선택 사항이에요. 적어 주시면 상담이 더 구체적이에요.
      </p>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="예시 문구 추가">
        {NOTE_TEMPLATES.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => addTemplate(t.text)}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-full border border-navy-200 bg-white px-3.5 text-md font-medium text-navy-600 transition-colors hover:border-teal-400 hover:text-teal-800"
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
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_NOTE))}
        rows={7}
        placeholder="전문가에게 미리 전달하고 싶은 내용을 작성해주세요."
        className="field mt-3 resize-none leading-relaxed"
      />
      <p className="mt-2 text-right text-base text-navy-400">{value.length} / {MAX_NOTE}</p>
    </section>
  );
}

export function ConfirmStep({
  expert,
  rows,
  note,
  price,
  onEdit,
}: {
  expert: Expert;
  rows: SummaryRow[];
  note: string;
  price: number;
  onEdit: (step: number) => void;
}) {
  return (
    <section className="animate-fade-up">
      <h1 className="text-6xl font-bold text-navy-900 sm:text-7xl">
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
            <p className="text-2xl font-bold text-navy-900">{expert.name}</p>
            <p className="truncate text-md text-navy-500">{expert.title}</p>
          </div>
        </div>

        <div className="divide-y divide-navy-100">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-4">
                <p className="text-sm text-navy-400 sm:w-[112px] sm:shrink-0 sm:text-md sm:text-navy-500">
                  {row.label}
                </p>
                <p className="mt-0.5 text-lg font-semibold text-navy-900 sm:mt-0 sm:text-xl">
                  {row.value}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEdit(row.step)}
                className="shrink-0 rounded-lg px-2 py-1.5 text-base font-semibold text-teal-700 hover:bg-teal-50"
              >
                변경
              </button>
            </div>
          ))}
          <div className="px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-4">
                <p className="text-sm text-navy-400 sm:w-[112px] sm:shrink-0 sm:text-md sm:text-navy-500">
                  전달 내용
                </p>
                <p className="mt-0.5 text-md text-navy-400 sm:mt-0">
                  {note.trim() ? "작성함" : "작성하지 않음"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onEdit(4)}
                className="shrink-0 rounded-lg px-2 py-1.5 text-base font-semibold text-teal-700 hover:bg-teal-50"
              >
                {note.trim() ? "수정" : "작성"}
              </button>
            </div>
            {note.trim() && (
              <p className="mt-2 whitespace-pre-line rounded-xl bg-canvas px-4 py-3 text-md leading-relaxed text-navy-700">
                {note.trim()}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between gap-4 bg-canvas px-5 py-5">
            <p className="text-xl font-bold text-navy-900">결제 예정 금액</p>
            <p className="text-5xl font-extrabold tracking-tight text-navy-900">
              {formatPrice(price)}
              <span className="ml-0.5 text-md font-semibold text-navy-500">원</span>
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 flex items-start gap-2 text-base leading-relaxed text-navy-400">
        <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.2} />
        데모 예약입니다. 실제 결제는 발생하지 않으며 예약은 이 브라우저에 저장됩니다.
      </p>
    </section>
  );
}

/** 데스크톱 우측 요약 — 지금까지의 선택이 항상 보이고, 가 본 단계는 눌러서 돌아간다 */
export function BookingSummary({
  expert,
  rows,
  step,
  maxReached,
  price,
  onJump,
}: {
  expert: Expert;
  rows: SummaryRow[];
  step: number;
  maxReached: number;
  price: number;
  onJump: (step: number) => void;
}) {
  return (
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
            <p className="truncate text-2xl font-bold text-navy-900">{expert.name}</p>
            <p className="flex items-center gap-1.5 text-base text-navy-500">
              <Stars value={expert.rating} size={13} />
              {expert.rating.toFixed(1)} · 후기 {expert.reviewCount}
            </p>
          </div>
        </div>

        <dl className="mt-5 space-y-1 border-t border-navy-100 pt-4">
          {rows.map((row) => {
            const current = row.step === step;
            const reachable = row.step <= maxReached;
            return (
              <div key={row.label}>
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => onJump(row.step)}
                  className={cx(
                    "flex w-full items-start justify-between gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                    current && "bg-teal-50",
                    reachable && !current && "hover:bg-navy-50",
                  )}
                >
                  <dt className={cx("shrink-0 text-md", current ? "font-semibold text-teal-800" : "text-navy-400")}>
                    {row.label}
                  </dt>
                  <dd
                    className={cx(
                      "text-right text-md font-semibold",
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
          <span className="text-lg text-navy-600">총 상담료</span>
          <span className="text-5xl font-extrabold tracking-tight text-navy-900">
            {formatPrice(price)}
            <span className="ml-0.5 text-md font-semibold text-navy-500">원</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
