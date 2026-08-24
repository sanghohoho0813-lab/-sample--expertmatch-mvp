"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cx } from "@/lib/format";

function useLockedBody(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
}

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
}

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** 데스크톱 모달 최대 너비 */
  width?: string;
}

/**
 * 모바일: 바텀시트 / 데스크톱: 중앙 모달.
 * 두 경우 모두 뷰포트를 벗어나지 않고 내부 스크롤을 사용한다.
 */
export function Overlay({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = "max-w-4xl",
}: OverlayProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useLockedBody(open);
  useEscape(open, onClose);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-navy-950/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          "relative flex max-h-[92dvh] w-full animate-slide-up flex-col overflow-hidden rounded-t-3xl bg-white shadow-pop sm:max-h-[86vh] sm:animate-scale-in sm:rounded-3xl",
          width,
        )}
      >
        <header className="flex shrink-0 items-start gap-3 border-b border-navy-100 px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] font-bold text-navy-900 sm:text-xl">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-[13px] text-navy-500 sm:text-sm">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-navy-400 transition-colors hover:bg-navy-50 hover:text-navy-900"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="scroll-slim min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>

        {footer && (
          <footer className="shrink-0 border-t border-navy-100 bg-white px-5 py-4 pb-safe sm:px-6">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
