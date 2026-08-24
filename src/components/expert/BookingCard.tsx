"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, Clock3, ShieldCheck } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { METHOD_ICON, METHOD_LABEL } from "@/lib/data/categories";
import { cx, formatPrice, responseLabel } from "@/lib/format";
import type { Expert } from "@/lib/types";

export function BookingCard({ expert }: { expert: Expert }) {
  const router = useRouter();
  const defaultProduct =
    expert.products.find((p) => p.recommended)?.id ?? expert.products[0].id;
  const [selected, setSelected] = useState(defaultProduct);

  const product = expert.products.find((p) => p.id === selected)!;

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[16px] font-bold text-navy-900">상담 상품 선택</h2>
        <span className="text-[12.5px] text-navy-400">
          {expert.products.length}개 상품
        </span>
      </div>

      <ul className="mt-3.5 space-y-2.5">
        {expert.products.map((p) => {
          const active = p.id === selected;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelected(p.id)}
                aria-pressed={active}
                className={cx(
                  "w-full rounded-xl border p-3.5 text-left transition-all duration-200",
                  active
                    ? "border-teal-600 bg-teal-50/70 ring-1 ring-teal-600"
                    : "border-navy-200 bg-white hover:border-navy-300 hover:bg-navy-50/60",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[14.5px] font-bold text-navy-900">
                        {p.name}
                      </span>
                      {p.recommended && (
                        <span className="rounded-md bg-navy-900 px-1.5 py-0.5 text-[10.5px] font-bold text-white">
                          추천
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[12.5px] leading-snug text-navy-500">
                      {p.description}
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-1 text-[12px] text-navy-400">
                      <Clock3 className="h-3 w-3" strokeWidth={2.2} />
                      {p.minutes}분
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[16px] font-extrabold text-navy-900">
                      {formatPrice(p.price)}
                    </span>
                    <span className="text-[12px] font-semibold text-navy-500">원</span>
                    <span
                      className={cx(
                        "mt-1.5 flex h-5 w-5 items-center justify-center justify-self-end rounded-full border transition-colors ml-auto",
                        active
                          ? "border-teal-600 bg-teal-600 text-white"
                          : "border-navy-200 bg-white text-transparent",
                      )}
                      aria-hidden
                    >
                      <Check className="h-3 w-3" strokeWidth={3.2} />
                    </span>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {expert.methods.map((m) => (
          <span
            key={m}
            className="inline-flex items-center gap-1 rounded-lg bg-navy-50 px-2 py-1 text-[12px] font-medium text-navy-600"
          >
            <Icon name={METHOD_ICON[m]} className="h-3.5 w-3.5 text-teal-600" />
            {METHOD_LABEL[m]}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-navy-100 pt-4">
        <span className="text-[13.5px] text-navy-500">선택한 상담료</span>
        <span className="text-[20px] font-extrabold tracking-tight text-navy-900">
          {formatPrice(product.price)}
          <span className="ml-0.5 text-[13px] font-semibold text-navy-500">원</span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => router.push(`/booking/${expert.id}?product=${product.id}`)}
        className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-[16px] font-bold text-white shadow-[0_8px_20px_-10px_rgba(5,144,137,0.9)] transition-all duration-200 hover:bg-teal-700 active:scale-[0.98]"
      >
        상담 예약하기
        <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
      </button>

      <ul className="mt-4 space-y-2 text-[12.5px] text-navy-500">
        <li className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-teal-600" strokeWidth={2.2} />
          경력·자격 검증을 마친 전문가입니다
        </li>
        <li className="flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5 shrink-0 text-teal-600" strokeWidth={2.2} />
          {responseLabel(expert.responseMinutes)}
        </li>
      </ul>
    </div>
  );
}
