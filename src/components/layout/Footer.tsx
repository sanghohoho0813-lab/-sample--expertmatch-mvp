import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

const COLUMNS = [
  {
    title: "서비스",
    links: [
      { label: "전문가 찾기", href: "/experts" },
      { label: "상담 분야", href: "/experts?panel=categories" },
      { label: "이용방법", href: "/#how-it-works" },
      { label: "내 예약", href: "/mypage" },
    ],
  },
  {
    title: "인기 분야",
    links: [
      { label: "창업 상담", href: "/experts?category=startup" },
      { label: "마케팅 상담", href: "/experts?category=marketing" },
      { label: "투자유치 상담", href: "/experts?category=investment" },
      { label: "세무 상담", href: "/experts?category=tax" },
    ],
  },
  {
    title: "고객지원",
    links: [
      { label: "자주 묻는 질문", href: "/#how-it-works" },
      { label: "이용약관", href: "/#" },
      { label: "개인정보처리방침", href: "/#" },
      { label: "전문가 지원하기", href: "/#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-navy-100 bg-white pb-24 lg:pb-0">
      <div className="shell py-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-navy-500">
              검증된 전문가와 필요한 순간을 연결합니다. 창업부터 세무·법률까지,
              고민에 맞는 전문가를 찾아 바로 상담을 예약하세요.
            </p>
            <p className="mt-5 inline-flex rounded-lg bg-navy-50 px-2.5 py-1.5 text-[12px] font-medium text-navy-500">
              포트폴리오 데모 · 실제 결제와 상담은 진행되지 않습니다
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[14px] font-bold text-navy-900">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-navy-500 transition-colors duration-200 hover:text-navy-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-navy-100 pt-6 text-[13px] text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 (sample) ExpertMatch. 데모 목적으로 제작된 샘플 서비스입니다.</p>
          <p>모든 전문가 정보와 후기는 예시 데이터입니다.</p>
        </div>
      </div>
    </footer>
  );
}
