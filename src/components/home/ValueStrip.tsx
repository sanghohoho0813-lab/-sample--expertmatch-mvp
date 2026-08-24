import { CalendarCheck, ShieldCheck, Sparkles, UserCheck } from "lucide-react";

const VALUES = [
  {
    icon: UserCheck,
    title: "검증된 전문가",
    body: "전문 경력과 실사용자 리뷰를 통해 신뢰할 수 있는 전문가만 엄선했습니다.",
  },
  {
    icon: Sparkles,
    title: "정확한 매칭",
    body: "분야·경력·상담 스타일을 고려한 추천으로 최적의 전문가를 만나보세요.",
  },
  {
    icon: CalendarCheck,
    title: "간편한 예약",
    body: "원하는 시간과 방식으로 쉽게 예약하고, 일정 관리까지 한 번에.",
  },
  {
    icon: ShieldCheck,
    title: "안전한 상담",
    body: "안전한 결제와 개인정보 보호로 안심하고 상담을 진행할 수 있습니다.",
  },
];

export function ValueStrip() {
  return (
    <section className="border-b border-cream-200 bg-cream-50">
      <ul className="shell grid gap-x-8 gap-y-7 py-11 sm:grid-cols-2 lg:grid-cols-4 lg:py-12">
        {VALUES.map((v) => {
          const ValueIcon = v.icon;
          return (
            <li key={v.title} className="flex gap-4">
              <span className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-gold-200 bg-white p-3 text-gold-600 shadow-[0_4px_14px_-8px_rgba(191,144,51,0.55)]">
                <ValueIcon className="h-6 w-6" strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <h3 className="text-[19px] font-bold text-navy-900">{v.title}</h3>
                <p className="mt-1.5 text-[16px] leading-relaxed text-navy-500">
                  {v.body}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
