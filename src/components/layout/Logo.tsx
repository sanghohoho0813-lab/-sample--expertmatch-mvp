import Link from "next/link";
import { cx } from "@/lib/format";

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Link
      href="/"
      className={cx("group inline-flex items-center gap-2.5", className)}
      aria-label="(sample) ExpertMatch 홈"
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy-900 to-teal-600 text-white shadow-[0_4px_12px_-4px_rgba(11,26,51,0.6)] transition-transform duration-200 group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
          <path
            d="M4 15.5 9.2 9l4 4.4L20 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9.2" cy="9" r="1.9" fill="currentColor" />
          <circle cx="19.4" cy="6.4" r="2.1" fill="#67E4D8" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cx(
            "text-[17px] font-extrabold tracking-[-0.03em]",
            tone === "dark" ? "text-navy-900" : "text-white",
          )}
        >
          ExpertMatch
        </span>
        <span
          className={cx(
            "mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
            tone === "dark" ? "text-navy-300" : "text-teal-300",
          )}
        >
          sample
        </span>
      </span>
    </Link>
  );
}
