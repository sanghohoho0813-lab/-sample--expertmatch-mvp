import Link from "next/link";
import { cx } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "dark";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-teal-600 text-white shadow-[0_6px_18px_-8px_rgba(5,144,137,0.9)] hover:bg-teal-700 active:bg-teal-700",
  dark: "bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-800",
  secondary:
    "bg-navy-50 text-navy-800 hover:bg-navy-100 active:bg-navy-100 border border-navy-100",
  outline:
    "border border-navy-200 bg-white text-navy-800 hover:border-navy-300 hover:bg-navy-50",
  ghost: "text-navy-600 hover:bg-navy-50 hover:text-navy-900",
};

const SIZES: Record<Size, string> = {
  // 모바일 최소 터치영역 44px 확보
  sm: "h-11 px-4 text-[23px] rounded-xl gap-1.5",
  md: "h-12 px-5 text-[24px] rounded-xl gap-2",
  lg: "h-14 px-7 text-[25px] rounded-2xl gap-2",
};

const BASE =
  "inline-flex select-none items-center justify-center font-semibold transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.985]";

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cx(BASE, VARIANTS[variant], SIZES[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link
      href={href}
      className={buttonClass(variant, size, className)}
      {...props}
    />
  );
}
