import Link from "next/link";
import { ChevronRight, Clock3 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { Expert } from "@/lib/types";

/** 모바일 상세 본문의 상담 상품 — 누르면 해당 상품으로 바로 예약을 시작한다 */
export function ProductList({ expert }: { expert: Expert }) {
  return (
    <ul className="space-y-2.5">
      {expert.products.map((p) => (
        <li key={p.id}>
          <Link
            href={`/booking/${expert.id}?product=${p.id}`}
            className="flex items-center gap-3 rounded-2xl border border-navy-100 bg-white p-4 transition-colors hover:border-navy-300"
          >
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-lg font-bold text-navy-900">{p.name}</span>
                {p.recommended && (
                  <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-xs font-bold text-teal-800">
                    가장 많이 선택
                  </span>
                )}
              </span>
              <span className="mt-1 block text-base leading-snug text-navy-500">{p.description}</span>
              <span className="mt-2 flex items-baseline gap-2.5">
                <span className="text-xl font-extrabold text-navy-900">
                  {formatPrice(p.price)}
                  <span className="text-sm font-semibold text-navy-500">원</span>
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-navy-400">
                  <Clock3 className="h-3.5 w-3.5" strokeWidth={2.2} />
                  {p.minutes}분
                </span>
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-navy-300" strokeWidth={2.2} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
