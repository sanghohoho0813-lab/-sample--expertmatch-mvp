import { Portrait } from "@/components/ui/Portrait";
import { Stars } from "@/components/ui/Stars";
import { TESTIMONIALS } from "@/lib/data/reviews";
import { EXPERT_MAP } from "@/lib/data/experts";

export function Testimonials() {
  return (
    <section
      id="reviews"
      className="scroll-mt-24 border-y border-cream-200 bg-cream-50 py-12 sm:py-20"
    >
      <div className="shell">
        <h2 className="section-title">상담을 받은 분들의 이야기</h2>
        <p className="section-sub">상담 후 남겨주신 후기예요.</p>

        {/* 모바일: 옆으로 넘겨 보기 / 데스크톱: 4열 */}
        <ul className="no-scrollbar -mx-5 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:mt-9 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {TESTIMONIALS.map((t) => {
            const expert = EXPERT_MAP[t.expertId];
            return (
              <li
                key={t.id}
                className="flex w-[82%] max-w-[340px] shrink-0 snap-start flex-col rounded-2xl border border-cream-200 bg-white p-5 shadow-card sm:p-6 lg:w-auto lg:max-w-none"
              >
                <Stars value={t.rating} size={17} />
                <p className="mt-3 flex-1 text-md leading-relaxed text-navy-700">
                  {t.quote}
                </p>
                <p className="mt-4 text-base text-navy-500">
                  <span className="font-bold text-navy-900">{t.name}</span> · {t.role}
                </p>
                {expert && (
                  <div className="mt-3 flex items-center gap-2.5 border-t border-cream-200 pt-3">
                    <Portrait
                      name={expert.name}
                      accent={expert.accent}
                      photo={expert.photo}
                      rounded="rounded-lg"
                      sizes="40px"
                      className="h-10 w-10 shrink-0"
                    />
                    <p className="min-w-0 truncate text-sm text-navy-500">
                      <span className="font-semibold text-navy-700">{expert.name} 전문가</span>와 상담
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
