import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { METHOD_LABEL } from "@/lib/data/categories";
import { cx, formatPrice } from "@/lib/format";
import type { Expert } from "@/lib/types";

/**
 * 상담 상품 안내 — 상품마다 '이런 경우에 고르세요 · 끝나면 받는 것 · 준비할 것'을 같은 순서로 보여 줘
 * 옵션 이름만 보고 고르지 않게 한다. 데스크톱은 나란히, 모바일은 위아래로.
 */
export function ProductGuide({ expert }: { expert: Expert }) {
  return (
    <section id="products" className="scroll-mt-32" aria-labelledby="products-title">
      <h2 id="products-title" className="text-4xl font-bold text-navy-900 sm:text-5xl">
        상담 상품
      </h2>
      <p className="mt-2 text-lg text-navy-500">
        모든 상품은 {expert.methods.map((m) => METHOD_LABEL[m]).join("·")}으로 받을 수 있어요. 고민의 크기에 맞춰 고르세요.
      </p>

      {/* 모바일: 위아래 카드 / 태블릿 이상: 왼쪽 이름·가격·예약, 오른쪽 범위 — 상품이 늘어도 칸이 좁아지지 않는다 */}
      <ul className="mt-5 space-y-3">
        {expert.products.map((p) => (
          <li
            key={p.id}
            className={cx(
              "flex flex-col rounded-2xl border bg-white p-5 md:grid md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:grid-rows-[auto_1fr] md:gap-x-8 md:p-6",
              p.recommended ? "border-navy-900" : "border-navy-100",
            )}
          >
            <div className="md:col-start-1 md:row-start-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="text-2xl font-bold text-navy-900">{p.name}</h3>
                {p.recommended && <span className="text-sm font-bold text-teal-700">가장 많이 선택</span>}
              </div>
              <p className="mt-1.5 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-navy-900">
                  {formatPrice(p.price)}
                  <span className="ml-0.5 text-md font-semibold text-navy-500">원</span>
                </span>
                <span className="inline-flex items-center gap-1 text-md text-navy-500">
                  <Clock3 className="h-4 w-4" strokeWidth={2.2} />
                  {p.minutes}분
                </span>
              </p>
            </div>

            <dl className="mt-4 space-y-3.5 border-t border-navy-100 pt-4 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <div>
                <dt className="text-base font-semibold text-navy-400">이런 경우에 고르세요</dt>
                <dd className="mt-0.5 text-lg leading-snug text-navy-800">{p.recommendedFor}</dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-navy-400">상담이 끝나면</dt>
                <dd className="mt-0.5 text-lg leading-snug text-navy-800">{p.deliverable}</dd>
              </div>
              <div>
                <dt className="text-base font-semibold text-navy-400">준비하면 좋은 것</dt>
                <dd className="mt-1">
                  <ul className="space-y-1">
                    {p.prepare.map((item) => (
                      <li key={item} className="flex gap-2 text-md leading-snug text-navy-600">
                        <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-navy-300" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <div className="mt-auto pt-5 md:col-start-1 md:row-start-2 md:mt-0 md:self-end">
              <Link
                href={`/booking/${expert.id}?product=${p.id}`}
                className={cx(
                  "inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-xl text-lg font-bold transition-colors",
                  p.recommended
                    ? "bg-navy-900 text-white hover:bg-navy-800"
                    : "border border-navy-200 bg-white text-navy-800 hover:bg-navy-50",
                )}
                aria-label={`이 상담으로 예약 — ${p.name}`}
              >
                이 상담으로 예약
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
