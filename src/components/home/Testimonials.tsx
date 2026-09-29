import { Quote } from "lucide-react";
import { Portrait } from "@/components/ui/Portrait";
import { Stars } from "@/components/ui/Stars";
import { TESTIMONIALS } from "@/lib/data/reviews";
import { EXPERT_MAP } from "@/lib/data/experts";

export function Testimonials() {
  return (
    <section
      id="reviews"
      className="scroll-mt-24 border-y border-cream-200 bg-cream-50 py-16 sm:py-20"
    >
      <div className="shell">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-[18px] font-bold uppercase tracking-[0.14em] text-teal-700">
            <span className="h-px w-6 bg-teal-500" aria-hidden />
            Reviews
          </span>
          <h2 className="section-title mt-2.5">상담을 받은 분들의 이야기</h2>
          <p className="section-sub">
            실제 상담 후 남겨주신 후기를 그대로 옮겼습니다.
          </p>
        </div>

        <ul className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => {
            const expert = EXPERT_MAP[t.expertId];
            return (
              <li
                key={t.id}
                className="relative flex flex-col rounded-2xl border border-cream-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <Quote
                  className="h-8 w-8 text-gold-300"
                  fill="currentColor"
                  strokeWidth={0}
                />
                <p className="mt-4 flex-1 text-[20.5px] leading-relaxed text-navy-700">
                  {t.quote}
                </p>

                <div className="mt-5 border-t border-cream-200 pt-4">
                  <Stars value={t.rating} size={17} />
                  <p className="mt-2.5 text-[20.5px] font-bold text-navy-900">
                    {t.name}
                  </p>
                  <p className="mt-0.5 text-[18px] text-navy-400">{t.role}</p>

                  {expert && (
                    <div className="mt-3.5 flex items-center gap-2.5 rounded-xl bg-cream-100 p-2">
                      <Portrait
                        name={expert.name}
                        accent={expert.accent}
                        photo={expert.photo}
                        rounded="rounded-lg"
                        sizes="40px"
                        className="h-10 w-10 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[17.5px] font-semibold text-navy-700">
                          {expert.name} 전문가
                        </p>
                        <p className="truncate text-[16.5px] text-navy-400">
                          {expert.title}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
