/**
 * Hero 우측 일러스트 — 전문가를 찾아주는 나침반 모티프.
 * 외부 이미지 없이 인라인 SVG로 구성해 어떤 환경에서도 동일하게 렌더링된다.
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 380"
      className={className}
      fill="none"
      role="img"
      aria-label="전문가 매칭을 상징하는 나침반 일러스트"
    >
      <defs>
        <radialGradient id="hi-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#33BDC7" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#33BDC7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hi-orb" x1="0.2" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#3FD3DC" />
          <stop offset="45%" stopColor="#159CA8" />
          <stop offset="100%" stopColor="#0B5A66" />
        </linearGradient>
        <linearGradient id="hi-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6DD5DC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#159CA8" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="hi-needle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CFF3F6" />
        </linearGradient>
      </defs>

      <circle cx="212" cy="188" r="168" fill="url(#hi-glow)" />

      {/* 궤도 */}
      <ellipse
        cx="212"
        cy="190"
        rx="150"
        ry="150"
        stroke="url(#hi-ring)"
        strokeWidth="1.4"
        strokeDasharray="5 9"
        opacity="0.7"
      />
      <ellipse
        cx="212"
        cy="190"
        rx="118"
        ry="118"
        stroke="url(#hi-ring)"
        strokeWidth="1.2"
        opacity="0.45"
      />

      {/* 받침 그림자 */}
      <ellipse cx="212" cy="316" rx="96" ry="16" fill="#0B5A66" opacity="0.28" />

      {/* 나침반 본체 */}
      <circle cx="212" cy="190" r="92" fill="url(#hi-orb)" />
      <circle cx="212" cy="190" r="92" stroke="#8FE6EC" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="212" cy="190" r="72" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1.2" />
      <path
        d="M212 98a92 92 0 0 1 60 162A118 118 0 0 0 212 98Z"
        fill="#062F37"
        opacity="0.22"
      />
      <ellipse cx="182" cy="152" rx="34" ry="24" fill="#FFFFFF" opacity="0.2" transform="rotate(-28 182 152)" />

      {/* 눈금 */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <rect
          key={deg}
          x="211"
          y="106"
          width="2"
          height={deg % 90 === 0 ? 12 : 7}
          rx="1"
          fill="#FFFFFF"
          opacity={deg % 90 === 0 ? 0.85 : 0.45}
          transform={`rotate(${deg} 212 190)`}
        />
      ))}

      {/* 바늘 */}
      <path d="M212 128 236 190 212 178 188 190 212 128Z" fill="url(#hi-needle)" />
      <path d="M212 252 188 190 212 202 236 190 212 252Z" fill="#0A3C45" opacity="0.85" />
      <circle cx="212" cy="190" r="9" fill="#FFFFFF" />
      <circle cx="212" cy="190" r="4" fill="#0E7C86" />

      {/* 떠 있는 카드 — 전문가 프로필 */}
      <g transform="translate(292 84)">
        <rect width="96" height="40" rx="12" fill="#FFFFFF" opacity="0.96" />
        <circle cx="21" cy="20" r="11" fill="#22385C" />
        <path d="M21 15a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 9c4 0 7 2 7 4.6V30h-14v-1.4c0-2.6 3-4.6 7-4.6Z" fill="#8FE6EC" />
        <rect x="39" y="12" width="42" height="5" rx="2.5" fill="#16294B" opacity="0.85" />
        <rect x="39" y="23" width="28" height="5" rx="2.5" fill="#16294B" opacity="0.35" />
      </g>

      {/* 떠 있는 카드 — 평점 */}
      <g transform="translate(24 138)">
        <rect width="86" height="38" rx="12" fill="#FFFFFF" opacity="0.94" />
        <path
          d="M19 10.5 22 17l7 1-5 4.9 1.2 7-6.2-3.3L12.8 30 14 23 9 18.1l7-1 3-6.6Z"
          fill="#F5A524"
        />
        <rect x="36" y="12" width="38" height="5" rx="2.5" fill="#16294B" opacity="0.85" />
        <rect x="36" y="22" width="24" height="5" rx="2.5" fill="#16294B" opacity="0.32" />
      </g>

      {/* 떠 있는 카드 — 예약 완료 */}
      <g transform="translate(276 268)">
        <rect width="104" height="42" rx="13" fill="#FFFFFF" opacity="0.96" />
        <circle cx="23" cy="21" r="12" fill="#0E7C86" />
        <path
          d="M17.5 21.2 21.6 25.3 29 17.9"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="42" y="13" width="46" height="5" rx="2.5" fill="#16294B" opacity="0.85" />
        <rect x="42" y="24" width="30" height="5" rx="2.5" fill="#16294B" opacity="0.32" />
      </g>

      {/* 반짝임 */}
      {[
        [70, 84, 7],
        [356, 176, 5.5],
        [116, 300, 6],
        [330, 44, 4.5],
      ].map(([x, y, r]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x} ${y - r}c.6 ${r * 0.6} ${r * 0.4} ${r * 0.8} ${r} ${r}-.6 0-${r * 0.4} ${r * 0.4}-${r} ${r}-.6-${r * 0.6}-${r * 0.4}-${r * 0.8}-${r}-${r} .6 0 ${r * 0.4}-${r * 0.4} ${r}-${r}Z`}
          fill="#8FE6EC"
          opacity="0.65"
        />
      ))}
    </svg>
  );
}
