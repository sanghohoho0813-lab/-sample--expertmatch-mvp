"use client";

import Link from "next/link";
import { Check, Info, TriangleAlert, X } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { cx } from "@/lib/format";

const TONE = {
  success: { icon: Check, ring: "bg-teal-500" },
  warn: { icon: TriangleAlert, ring: "bg-amber-500" },
  default: { icon: Info, ring: "bg-navy-400" },
} as const;

export function Toaster() {
  const { toasts, dismissToast } = useAppStore();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[86px] z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-8"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const tone = TONE[t.tone];
        const ToneIcon = tone.icon;
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-[420px] animate-fade-up items-center gap-3 rounded-2xl bg-navy-900 px-4 py-3 text-white shadow-pop"
          >
            <span
              className={cx(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                tone.ring,
              )}
            >
              <ToneIcon className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <p className="min-w-0 flex-1 text-[14px] leading-snug">{t.message}</p>
            {t.action && (
              <Link
                href={t.action.href}
                onClick={() => dismissToast(t.id)}
                className="shrink-0 rounded-lg px-2 py-1 text-[13px] font-semibold text-teal-300 transition-colors hover:bg-white/10"
              >
                {t.action.label}
              </Link>
            )}
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="알림 닫기"
              className="shrink-0 rounded-lg p-1 text-navy-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
