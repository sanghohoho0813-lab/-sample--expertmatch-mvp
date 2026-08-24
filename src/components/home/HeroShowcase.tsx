import { Star } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { EXPERT_MAP } from "@/lib/data/experts";
import { formatPrice } from "@/lib/format";

/**
 * Hero 우측 — 실제 전문가 사진으로 구성한 매칭 카드 스택.
 * 일러스트 대신 사람이 보이도록 해 신뢰감과 온기를 준다.
 */
export function HeroShowcase() {
  const main = EXPERT_MAP["kim-dohyun"];
  const sub1 = EXPERT_MAP["jung-mina"];
  const sub2 = EXPERT_MAP["park-jaehyung"];

  return (
    <div className="relative mx-auto w-full max-w-[368px]">
      {/* 뒤쪽 광원 */}
      <div
        className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(51,189,199,0.30),transparent_72%)] blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-6 top-10 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgba(214,172,78,0.30),transparent_70%)] blur-2xl"
        aria-hidden
      />

      {/* 메인 카드 */}
      <div className="relative rotate-[-2deg] rounded-[26px] border border-white/15 bg-white/[0.07] p-2.5 shadow-pop backdrop-blur-md">
        <div className="relative overflow-hidden rounded-[18px]">
          <Portrait
            name={main.name}
            accent={main.accent}
            photo={main.photo}
            rounded="rounded-[18px]"
            priority
            sizes="(min-width: 1024px) 368px, 100vw"
            className="aspect-[5/6] w-full"
          />
          <div
            className="absolute inset-x-0 bottom-0 z-10 h-3/5 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 z-20 p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300/40 bg-gold-300/15 px-2.5 py-1 text-[14px] font-bold text-gold-200 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
              지금 상담 가능
            </span>
            <p className="mt-2.5 text-[22px] font-extrabold tracking-tight text-white">
              {main.name}
              <span className="ml-1.5 text-[15px] font-semibold text-navy-200">
                전문가
              </span>
            </p>
            <p className="mt-0.5 text-[15px] text-navy-200">{main.title}</p>
            <div className="mt-2.5 flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1 text-[15px] font-bold text-white">
                <Star className="h-4 w-4 text-gold-300" fill="currentColor" strokeWidth={0} />
                {main.rating.toFixed(1)}
              </span>
              <span className="h-3 w-px bg-white/25" />
              <span className="text-[15px] font-semibold text-white">
                {formatPrice(main.products[0].price)}원
                <span className="ml-0.5 font-normal text-navy-200">
                  / {main.products[0].minutes}분
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 좌하단 작은 카드 */}
      <div className="absolute -bottom-14 -left-12 z-20 w-[196px] rotate-[3deg] rounded-2xl border border-white/15 bg-navy-900/70 p-2 shadow-pop backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Portrait
            name={sub1.name}
            accent={sub1.accent}
            photo={sub1.photo}
            rounded="rounded-xl"
            sizes="56px"
            className="h-14 w-14 shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate text-[16px] font-bold text-white">{sub1.name}</p>
            <p className="truncate text-[13px] text-navy-300">브랜드 · 마케팅</p>
            <span className="mt-1 inline-flex items-center gap-0.5 text-[13px] font-bold text-gold-300">
              <Star className="h-3 w-3" fill="currentColor" strokeWidth={0} />
              {sub1.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* 우상단 작은 카드 */}
      <div className="absolute -right-9 -top-7 z-20 w-[184px] rotate-[4deg] rounded-2xl border border-white/15 bg-navy-900/70 p-2 shadow-pop backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Portrait
            name={sub2.name}
            accent={sub2.accent}
            photo={sub2.photo}
            rounded="rounded-xl"
            sizes="56px"
            className="h-14 w-14 shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate text-[16px] font-bold text-white">{sub2.name}</p>
            <p className="truncate text-[13px] text-navy-300">투자유치 · IR</p>
            <span className="mt-1 inline-flex items-center gap-0.5 text-[13px] font-bold text-gold-300">
              <Star className="h-3 w-3" fill="currentColor" strokeWidth={0} />
              {sub2.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
