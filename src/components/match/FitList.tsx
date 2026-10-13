import { Check, Minus } from "lucide-react";
import { cx } from "@/lib/format";
import type { Fit } from "@/lib/needs";

/**
 * 내 조건과 대조한 결과 — 맞는 조건을 먼저, 아닌 조건은 흐리게.
 * compact: 카드용 짧은 표기 / 기본: 문장형 근거
 */
export function FitList({ fits, compact = false, label = "내 조건과 비교" }: { fits: Fit[]; compact?: boolean; label?: string }) {
  if (fits.length === 0) return null;
  const sorted = [...fits].sort((a, b) => Number(b.ok) - Number(a.ok));
  const met = fits.filter((f) => f.ok).length;
  return (
    <div className="rounded-xl bg-canvas px-3.5 py-3">
      <p className="text-sm font-semibold text-navy-400">
        {label} · {met === fits.length ? "모두 맞아요" : `${fits.length}개 중 ${met}개 맞아요`}
      </p>
      <ul
        className={cx("mt-1.5", compact ? "flex flex-wrap gap-x-3 gap-y-1" : "space-y-1.5")}
        aria-label={label}
      >
        {sorted.map((f) => (
          <li
            key={f.key}
            className={cx(
              "flex items-start gap-1.5 text-base leading-snug",
              f.ok ? "font-semibold text-navy-800" : "text-navy-400",
            )}
          >
            {f.ok ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" strokeWidth={3} />
            ) : (
              <Minus className="mt-0.5 h-4 w-4 shrink-0 text-navy-300" strokeWidth={3} />
            )}
            <span>
              <span className="sr-only">{f.ok ? "맞음: " : "다름: "}</span>
              {compact ? f.short : f.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
