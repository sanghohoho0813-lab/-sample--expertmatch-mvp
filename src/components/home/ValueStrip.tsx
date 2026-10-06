import { CalendarCheck, GitCompareArrows, MessageSquareText, UserCheck } from "lucide-react";

/** 히어로 바로 아래 신뢰 요소 — 짧은 한 줄로만 */
const VALUES = [
  { icon: UserCheck, title: "검증 전문가", body: "경력·자격·후기를 확인했어요" },
  { icon: GitCompareArrows, title: "한눈에 비교", body: "경력·가격·예약일을 나란히" },
  { icon: CalendarCheck, title: "바로 예약", body: "원하는 시간에 30초면 끝" },
  { icon: MessageSquareText, title: "사전 질문", body: "궁금한 점을 미리 전달" },
];

export function ValueStrip() {
  return (
    <section className="border-b border-cream-200 bg-cream-50">
      <ul className="shell grid grid-cols-2 gap-x-3 gap-y-4 py-6 lg:grid-cols-4 lg:gap-x-8 lg:py-10">
        {VALUES.map((v) => {
          const ValueIcon = v.icon;
          return (
            <li key={v.title} className="flex min-w-0 items-center gap-2.5 lg:gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-200 bg-white text-gold-600 lg:h-[52px] lg:w-[52px] lg:rounded-2xl">
                <ValueIcon className="h-5 w-5 lg:h-6 lg:w-6" strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <p className="whitespace-nowrap text-[19.5px] font-bold leading-tight text-navy-900 lg:text-[23px]">{v.title}</p>
                <p className="mt-0.5 hidden text-[19px] leading-snug text-navy-500 lg:block">{v.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
