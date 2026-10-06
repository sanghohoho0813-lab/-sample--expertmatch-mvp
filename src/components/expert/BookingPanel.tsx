"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarClock, Check, Clock3 } from "lucide-react";
import { METHOD_LABEL } from "@/lib/data/categories";
import { useExpertAvailability } from "@/lib/useAvailability";
import { cx, formatPrice, formatSlotLabel, responseLabel } from "@/lib/format";
import type { Expert } from "@/lib/types";

/**
 * 데스크톱 상세 우측 고정 예약 패널 — 예약 결정에 필요한 것만, CTA는 하나.
 * 상품을 바꾸면 그 길이 기준의 가장 빠른 예약 시간이 바로 갱신된다.
 */
export function BookingPanel({ expert }: { expert: Expert }) {
  const defaultProduct = expert.products.find((p) => p.recommended)?.id ?? expert.products[0].id;
  const [selected, setSelected] = useState(defaultProduct);
  const product = expert.products.find((p) => p.id === selected) ?? expert.products[0];
  const avail = useExpertAvailability(expert, product.minutes);

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-pop">
      {/* 가장 빠른 예약 */}
      <div className="rounded-xl bg-teal-50 px-4 py-3">
        <p className="flex items-center gap-1.5 text-[18px] font-semibold text-teal-800">
          <CalendarClock className="h-4 w-4" strokeWidth={2.2} />
          가장 빠른 예약
        </p>
        <p className="mt-0.5 min-h-[34px] text-[26px] font-bold text-navy-900">
          {!avail
            ? ""
            : avail.earliest
              ? formatSlotLabel(avail.earliest.dateKey, avail.earliest.time, avail.now)
              : "예약 가능한 시간 없음"}
        </p>
        <p className="min-h-[26px] text-[18px] text-navy-500">
          {avail && avail.weekCount > 0 ? `7일 이내 ${avail.weekCount}개 시간 예약 가능` : ""}
        </p>
      </div>

      {/* 상품 선택 */}
      <fieldset className="mt-4">
        <legend className="text-[20px] font-bold text-navy-900">상담 상품</legend>
        <div className="mt-2.5 space-y-2">
          {expert.products.map((p) => {
            const active = p.id === selected;
            return (
              <label
                key={p.id}
                className={cx(
                  "flex cursor-pointer gap-3 rounded-xl border p-3.5 transition-colors duration-150",
                  active
                    ? "border-teal-600 bg-teal-50/50 ring-1 ring-teal-600"
                    : "border-navy-200 bg-white hover:border-navy-300",
                )}
              >
                <input
                  type="radio"
                  name={`product-${expert.id}`}
                  value={p.id}
                  checked={active}
                  onChange={() => setSelected(p.id)}
                  className="sr-only"
                />
                <span
                  className={cx(
                    "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    active ? "border-teal-600 bg-teal-600 text-white" : "border-navy-200 text-transparent",
                  )}
                  aria-hidden
                >
                  <Check className="h-3 w-3" strokeWidth={3.4} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[20.5px] font-bold leading-snug text-navy-900">{p.name}</span>
                    <span className="shrink-0 text-[21px] font-extrabold text-navy-900">
                      {formatPrice(p.price)}
                      <span className="text-[17px] font-semibold text-navy-500">원</span>
                    </span>
                  </span>
                  {/* 설명은 선택한 상품만 — CTA가 첫 화면 안에 들어오도록 */}
                  {active && (
                    <span className="mt-0.5 block text-[18px] leading-snug text-navy-500">{p.description}</span>
                  )}
                  <span className="mt-1 flex items-center gap-2 text-[17px] text-navy-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" strokeWidth={2.2} />
                      {p.minutes}분
                    </span>
                    {p.recommended && <span className="font-semibold text-teal-700">가장 많이 선택</span>}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <Link
        href={`/booking/${expert.id}?product=${product.id}`}
        className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 text-[22px] font-bold text-white transition-colors duration-200 hover:bg-teal-700"
      >
        상담 예약하기
        <ArrowRight className="h-5 w-5" strokeWidth={2.4} />
      </Link>

      <p className="mt-3 text-center text-[17px] text-navy-400">
        {expert.methods.map((m) => METHOD_LABEL[m]).join(" · ")} · {responseLabel(expert.responseMinutes)}
      </p>
    </div>
  );
}
