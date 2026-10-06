"use client";

import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { CATEGORY_MAP } from "@/lib/data/categories";
import { EXPERT_MAP } from "@/lib/data/experts";
import { useExpertAvailability } from "@/lib/useAvailability";
import { formatPrice, formatSlotLabel } from "@/lib/format";
import type { Expert } from "@/lib/types";

function Earliest({ expert, className }: { expert: Expert; className?: string }) {
  const avail = useExpertAvailability(expert);
  return (
    <span className={className}>
      {!avail
        ? "예약 가능 시간 확인 중"
        : avail.earliest
          ? `${formatSlotLabel(avail.earliest.dateKey, avail.earliest.time, avail.now)} 예약 가능`
          : "이번 주 예약 마감"}
    </span>
  );
}

/**
 * Hero 우측 — 실제 전문가 사진과 가장 빠른 예약 시간.
 * 장식 대신 '지금 예약할 수 있는 사람'을 보여준다.
 */
export function HeroShowcase() {
  const main = EXPERT_MAP["kim-dohyun"];
  const others = [EXPERT_MAP["jung-mina"], EXPERT_MAP["park-jaehyung"]];

  return (
    <div className="w-full max-w-[380px] rounded-[26px] border border-white/12 bg-white/[0.05] p-2.5">
      <Link href={`/experts/${main.id}`} className="group relative block overflow-hidden rounded-[18px]">
        <Portrait
          name={main.name}
          accent={main.accent}
          photo={main.photo}
          rounded="rounded-[18px]"
          sizes="(min-width: 1024px) 380px, 100vw"
          className="aspect-[5/5.4] w-full"
        />
        <div
          className="absolute inset-x-0 bottom-0 z-10 h-3/5 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 z-20 p-5">
          <p className="text-3xl font-extrabold tracking-tight text-white">
            {main.name}
            <span className="ml-1.5 text-sm font-semibold text-navy-200">전문가</span>
          </p>
          <p className="mt-0.5 text-sm text-navy-200">{main.title}</p>
          <div className="mt-2 flex items-center gap-2.5 text-sm">
            <span className="inline-flex items-center gap-1 font-bold text-white">
              <Star className="h-4 w-4 text-gold-300" fill="currentColor" strokeWidth={0} />
              {main.rating.toFixed(1)}
            </span>
            <span className="h-3 w-px bg-white/25" aria-hidden />
            <span className="font-semibold text-white">
              {formatPrice(main.products[0].price)}원
              <span className="ml-0.5 font-normal text-navy-200">/ {main.products[0].minutes}분</span>
            </span>
          </div>
          <Earliest expert={main} className="mt-2 block text-sm font-bold text-teal-300" />
        </div>
      </Link>

      <p className="px-2.5 pb-1.5 pt-3.5 text-xs font-bold text-navy-300">지금 예약 가능한 전문가</p>
      <ul className="space-y-1">
        {others.map((e) => (
          <li key={e.id}>
            <Link
              href={`/experts/${e.id}`}
              className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-white/[0.06]"
            >
              <Portrait
                name={e.name}
                accent={e.accent}
                photo={e.photo}
                rounded="rounded-xl"
                sizes="48px"
                className="h-12 w-12 shrink-0"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-bold text-white">
                  {e.name}
                  <span className="ml-1.5 text-xs font-medium text-navy-300">
                    {CATEGORY_MAP[e.categories[0]].name}
                  </span>
                </span>
                <Earliest expert={e} className="block truncate text-xs font-semibold text-teal-300" />
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-navy-400" strokeWidth={2.2} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
