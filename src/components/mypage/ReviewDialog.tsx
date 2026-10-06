"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";
import { cx } from "@/lib/format";
import type { Booking } from "@/lib/types";

/** 완료된 상담 후기 작성 (별점 + 10자 이상 본문) */
export function ReviewDialog({
  booking,
  onClose,
  onSubmit,
}: {
  booking: Booking | null;
  onClose: () => void;
  onSubmit: (rating: number, body: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const valid = body.trim().length >= 10;

  return (
    <Overlay
      open={Boolean(booking)}
      onClose={onClose}
      title="상담 후기 작성"
      description={booking ? `${booking.expertName} 전문가 · ${booking.productName}` : undefined}
      width="max-w-lg"
      footer={
        <button
          type="button"
          disabled={!valid}
          onClick={() => onSubmit(rating, body.trim())}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-navy-900 text-xl font-bold text-white transition-colors hover:bg-navy-800 disabled:bg-navy-200 disabled:text-navy-500"
        >
          {valid ? "후기 등록" : "10자 이상 작성해 주세요"}
        </button>
      }
    >
      <div className="px-5 py-5 sm:px-6">
        <p className="text-lg font-semibold text-navy-700">상담은 어떠셨나요?</p>
        <div className="mt-2 flex gap-1" role="radiogroup" aria-label="별점">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n}점`}
              onClick={() => setRating(n)}
              className="flex h-12 w-12 items-center justify-center rounded-xl hover:bg-navy-50"
            >
              <Star
                className={cx("h-8 w-8", n <= rating ? "fill-gold-400 text-gold-400" : "text-navy-200")}
                strokeWidth={1.8}
              />
            </button>
          ))}
        </div>
        <label htmlFor="review-body" className="mt-5 block text-lg font-semibold text-navy-700">
          후기 내용
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, 300))}
          rows={5}
          placeholder="어떤 점이 도움이 되었는지 알려주세요."
          className="field mt-2 resize-none leading-relaxed"
        />
        <p className="mt-1.5 text-right text-sm text-navy-400">{body.length} / 300</p>
      </div>
    </Overlay>
  );
}

