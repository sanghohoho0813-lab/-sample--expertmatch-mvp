"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { EXPERT_MAP } from "@/lib/data/experts";
import { useAppStore } from "@/lib/store/AppStore";
import { formatPrice } from "@/lib/format";

/** 최근 본 전문가 가로 목록 */
export function RecentExperts({ exclude }: { exclude?: string }) {
  const { recent, ready, clearRecent } = useAppStore();
  const experts = recent
    .filter((id) => id !== exclude)
    .map((id) => EXPERT_MAP[id])
    .filter(Boolean);

  if (!ready || experts.length === 0) return null;

  return (
    <section className="mt-6 rounded-2xl border border-navy-100 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-[19px] font-bold text-navy-900">
          <Clock3 className="h-5 w-5 text-navy-300" strokeWidth={2.2} />
          최근 본 전문가
        </h2>
        <button
          type="button"
          onClick={clearRecent}
          className="rounded-lg px-2 py-1 text-[16px] font-medium text-navy-400 transition-colors hover:text-navy-800"
        >
          기록 지우기
        </button>
      </div>

      <ul className="scroll-slim mt-4 flex gap-3 overflow-x-auto pb-1">
        {experts.map((e) => {
          const lead = e.products.reduce((a, b) => (b.price < a.price ? b : a));
          return (
            <li key={e.id} className="shrink-0">
              <Link
                href={`/experts/${e.id}`}
                className="flex w-[212px] items-center gap-3 rounded-xl border border-navy-100 p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-card"
              >
                <Portrait
                  name={e.name}
                  accent={e.accent}
                  photo={e.photo}
                  rounded="rounded-lg"
                  sizes="52px"
                  className="h-[52px] w-[52px] shrink-0"
                />
                <span className="min-w-0">
                  <span className="block truncate text-[18px] font-bold text-navy-900">
                    {e.name}
                  </span>
                  <span className="block truncate text-[15.5px] text-navy-400">
                    {e.title}
                  </span>
                  <span className="mt-0.5 block text-[15.5px] font-semibold text-navy-700">
                    {formatPrice(lead.price)}원 / {lead.minutes}분
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
