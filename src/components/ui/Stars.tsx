import { Star } from "lucide-react";
import { cx } from "@/lib/format";

export function Stars({
  value,
  size = 14,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cx("inline-flex items-center gap-0.5", className)} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = value >= i + 0.75;
        const half = !filled && value >= i + 0.25;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              className="absolute inset-0 text-navy-200"
              style={{ width: size, height: size }}
              fill="currentColor"
              strokeWidth={0}
            />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? size / 2 : size }}
              >
                <Star
                  className="text-amber-500"
                  style={{ width: size, height: size }}
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export function RatingInline({
  rating,
  reviewCount,
  className,
  size = 14,
}: {
  rating: number;
  reviewCount: number;
  className?: string;
  size?: number;
}) {
  return (
    <span className={cx("inline-flex items-center gap-1.5", className)}>
      <Stars value={rating} size={size} />
      <span className="text-[17.5px] font-semibold text-navy-900">
        {rating.toFixed(1)}
      </span>
      <span className="text-[17.5px] text-navy-400">({reviewCount})</span>
    </span>
  );
}
