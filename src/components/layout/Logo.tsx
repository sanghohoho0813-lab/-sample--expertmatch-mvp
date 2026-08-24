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
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-[0_4px_12px_-4px_rgba(14,124,134,0.7)] transition-transform duration-200 group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
          <path d="M15.6 8.4 13.7 13.7 8.4 15.6l1.9-5.3 5.3-1.9Z" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="#0C444B" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cx(
            "text-[23px] font-extrabold tracking-[-0.03em]",
            tone === "dark" ? "text-navy-900" : "text-white",
          )}
        >
          Expert Match
        </span>
        <span
          className={cx(
            "mt-0.5 text-[13px] font-semibold uppercase tracking-[0.14em]",
            tone === "dark" ? "text-navy-300" : "text-teal-300",
          )}
        >
          sample
        </span>
      </span>
    </Link>
  );
}
