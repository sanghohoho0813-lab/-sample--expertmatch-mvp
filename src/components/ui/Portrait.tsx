import { cx } from "@/lib/format";

/**
 * 전문가 프로필 이미지 자리에 사용하는 일관된 professional placeholder.
 *
 * 외부 이미지에 의존하지 않아 어떤 환경에서도 깨지지 않고, 어떤 비율의
 * 프레임에서도 인물이 중앙에 유지된다(preserveAspectRatio slice).
 * 실제 사진이 준비되면 Expert 데이터에 photoUrl 을 추가하고
 * 이 컴포넌트만 교체하면 된다.
 */

interface Palette {
  bgFrom: string;
  bgTo: string;
  glow: string;
  figureFrom: string;
  figureTo: string;
  shirt: string;
  accent: string;
}

const PALETTES: Palette[] = [
  // 네이비 · 라이트 블루
  {
    bgFrom: "#E6EEFA",
    bgTo: "#C3D6EE",
    glow: "#FFFFFF",
    figureFrom: "#2A4C82",
    figureTo: "#14294B",
    shirt: "#EEF4FC",
    accent: "#0E7C86",
  },
  // 딥 틸 · 라이트 틸
  {
    bgFrom: "#DDF2F2",
    bgTo: "#B2DFE0",
    glow: "#FFFFFF",
    figureFrom: "#166067",
    figureTo: "#0A3A3F",
    shirt: "#E9F7F7",
    accent: "#2C4A78",
  },
  // 인디고 · 라벤더
  {
    bgFrom: "#E9E7F7",
    bgTo: "#C9C4EA",
    glow: "#FFFFFF",
    figureFrom: "#453C7E",
    figureTo: "#241E4C",
    shirt: "#F1EFFB",
    accent: "#159CA8",
  },
  // 포레스트 · 민트
  {
    bgFrom: "#DFF0E7",
    bgTo: "#B6DBC7",
    glow: "#FFFFFF",
    figureFrom: "#1F5340",
    figureTo: "#0F3325",
    shirt: "#ECF7F1",
    accent: "#2C4A78",
  },
  // 차콜 · 웜 그레이
  {
    bgFrom: "#EEEAE5",
    bgTo: "#D5CCC2",
    glow: "#FFFFFF",
    figureFrom: "#4A4A55",
    figureTo: "#26262E",
    shirt: "#F4F1EE",
    accent: "#0E7C86",
  },
  // 스틸 블루 · 스카이
  {
    bgFrom: "#DEEBF9",
    bgTo: "#B0CFEC",
    glow: "#FFFFFF",
    figureFrom: "#1C5B84",
    figureTo: "#0D3352",
    shirt: "#ECF4FC",
    accent: "#33BDC7",
  },
];

/** 헤어 실루엣 변형 6종 — 카드가 복사한 것처럼 보이지 않도록 */
const HAIR = [
  // 짧은 머리
  "M58 74c0-16 11-28 26-28s26 12 26 28c0 3-1 6-2 8-2-9-8-13-16-14-8-1-14 1-20 1s-11 4-12 13c-1-2-2-5-2-8Z",
  // 단발
  "M56 84c0-19 12-38 28-38s28 19 28 38c0 8-2 16-4 22l-7-3c3-8 4-17 3-23-2-11-9-16-20-16s-18 5-20 16c-1 6 0 15 3 23l-7 3c-2-6-4-14-4-22Z",
  // 가르마
  "M58 76c1-18 11-30 26-30 14 0 25 11 26 27 0 4-1 8-2 11-2-9-6-15-14-17-7-2-12 4-19 4-7 0-11-3-15 3-3 4-4 8-4 12-1-3-2-7-2-10Z",
  // 포니테일
  "M57 82c0-19 12-36 27-36s27 17 27 36c0 5-1 10-2 14l-7-2c1-6 2-13 1-18-2-12-9-17-19-17s-17 5-19 17c-1 5 0 12 1 18l-7 2c-1-4-2-9-2-14Z M110 82c7 3 11 11 11 20 0 8-3 15-9 19l-6-6c4-3 6-8 6-13s-2-10-6-13l4-7Z",
  // 볼륨 웨이브
  "M54 86c0-22 13-40 30-40s30 18 30 40c0 7-1 13-3 18l-8-4c2-6 3-14 2-20-3-13-11-19-21-19s-18 6-21 19c-1 6 0 14 2 20l-8 4c-2-5-3-11-3-18Z",
  // 스타일링한 짧은 머리
  "M60 78c0-19 10-32 24-32s25 13 25 32c0 3-1 6-2 8-2-7-5-12-11-14-7-2-13 2-21 1-7-1-12 4-13 14-1-3-2-6-2-9Z",
];

export function Portrait({
  name,
  accent,
  className,
  rounded = "rounded-2xl",
}: {
  name: string;
  accent: number;
  className?: string;
  rounded?: string;
}) {
  const p = PALETTES[accent % PALETTES.length];
  const uid = `pf${accent}`;

  return (
    <div
      className={cx("relative overflow-hidden bg-navy-50", rounded, className)}
      role="img"
      aria-label={`${name} 전문가 프로필 이미지`}
    >
      <svg
        viewBox="0 0 168 168"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${uid}-bg`} x1="0.1" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor={p.bgFrom} />
            <stop offset="100%" stopColor={p.bgTo} />
          </linearGradient>
          <linearGradient id={`${uid}-fig`} x1="0.15" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor={p.figureFrom} />
            <stop offset="100%" stopColor={p.figureTo} />
          </linearGradient>
          <radialGradient id={`${uid}-glow`} cx="62%" cy="26%" r="60%">
            <stop offset="0%" stopColor={p.glow} stopOpacity="0.55" />
            <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}-clip`}>
            <rect width="168" height="168" />
          </clipPath>
        </defs>

        <g clipPath={`url(#${uid}-clip)`}>
          <rect width="168" height="168" fill={`url(#${uid}-bg)`} />
          <rect width="168" height="168" fill={`url(#${uid}-glow)`} />
          <circle cx="84" cy="96" r="62" fill="#FFFFFF" opacity="0.28" />

          {/* 어깨 · 자켓 */}
          <path
            d="M84 116c28 0 50 17 54 43 1 5 1 9 1 9H29s0-4 1-9c4-26 26-43 54-43Z"
            fill={`url(#${uid}-fig)`}
          />
          {/* 셔츠 */}
          <path d="M73 113h22l8 55H65l8-55Z" fill={p.shirt} />
          {/* 라펠 */}
          <path d="M73 113 84 134 66 168H56l6-42 11-13Z" fill={p.figureFrom} opacity="0.92" />
          <path d="M95 113 84 134l18 34h10l-6-42-11-13Z" fill={p.figureFrom} opacity="0.92" />
          {/* 넥타이 / 포인트 */}
          <path d="M84 129l6 7-4 32h-4l-4-32 6-7Z" fill={p.accent} />
          {/* 목 */}
          <path d="M73 96h22v22c0 6-22 6-22 0V96Z" fill={`url(#${uid}-fig)`} />
          {/* 머리 */}
          <ellipse cx="84" cy="72" rx="26" ry="30" fill={`url(#${uid}-fig)`} />
          <path d={HAIR[accent % HAIR.length]} fill={p.figureTo} opacity="0.95" />
          {/* 림 라이트 */}
          <path
            d="M84 42c15 0 26 13 26 30 0 8-2 15-6 21 2-6 3-13 3-20 0-16-10-27-23-27Z"
            fill="#FFFFFF"
            opacity="0.16"
          />
          {/* 하단 비네트 */}
          <rect y="128" width="168" height="40" fill={p.figureTo} opacity="0.06" />
        </g>
      </svg>
    </div>
  );
}
