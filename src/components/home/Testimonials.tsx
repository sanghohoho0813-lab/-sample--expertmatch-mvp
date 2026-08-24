import { Quote } from "lucide-react";
import { Stars } from "@/components/ui/Stars";
import { TESTIMONIALS } from "@/lib/data/reviews";

export function Testimonials() {
  return (
    <section
      id="reviews"
      className="scroll-mt-24 border-y border-navy-100 bg-white py-14 sm:py-16 lg:py-20"
    >
      <div className="shell">
        <div className="max-w-xl">
          <h2 className="section-title">상담을 받은 분들의 이야기</h2>
          <p className="section-sub">
            실제 상담 후 남겨주신 후기를 그대로 옮겼습니다.
          </p>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <li
              key={t.id}
              className="flex flex-col rounded-2xl border border-navy-100 bg-canvas p-5 transition-all duration-200 hover:border-navy-200 hover:bg-white hover:shadow-card"
            >
              <Quote className="h-6 w-6 text-teal-500/70" strokeWidth={2} />
              <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-navy-700">
                {t.quote}
              </p>
              <div className="mt-4 border-t border-navy-100 pt-3.5">
                <Stars value={t.rating} size={13} />
                <p className="mt-2 text-[14px] font-bold text-navy-900">{t.name}</p>
                <p className="mt-0.5 text-[12.5px] text-navy-400">
                  {t.role} · {t.expert}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
