import { cx } from "@/lib/format";

/** 전문가별 고정 그라데이션 (Deep Navy ~ Teal 계열) */
const GRADIENTS = [
  "from-navy-800 to-navy-600",
  "from-teal-700 to-teal-500",
  "from-navy-700 to-teal-700",
  "from-navy-600 to-sky-600",
  "from-teal-800 to-navy-700",
  "from-navy-900 to-teal-600",
];

const SIZES = {
  sm: "h-10 w-10 text-[15px]",
  md: "h-14 w-14 text-lg",
  lg: "h-[72px] w-[72px] text-2xl",
  xl: "h-24 w-24 text-3xl sm:h-28 sm:w-28 sm:text-4xl",
} as const;

export function Avatar({
  name,
  accent,
  size = "md",
  className,
  ring = true,
}: {
  name: string;
  accent: number;
  size?: keyof typeof SIZES;
  className?: string;
  ring?: boolean;
}) {
  // 한국어 이름은 성을 제외한 이름 앞 글자를 사용 (김도현 → 도현)
  const initials = name.length > 2 ? name.slice(1) : name;
  return (
    <div
      className={cx(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br font-bold tracking-tight text-white",
        GRADIENTS[accent % GRADIENTS.length],
        SIZES[size],
        ring && "ring-1 ring-inset ring-white/15",
        className,
      )}
      aria-hidden
    >
      <span
        className="absolute -right-3 -top-4 h-12 w-12 rounded-full bg-white/10"
        aria-hidden
      />
      <span
        className="absolute -bottom-5 -left-2 h-10 w-10 rounded-full bg-black/10"
        aria-hidden
      />
      <span className="relative">{initials}</span>
    </div>
  );
}
