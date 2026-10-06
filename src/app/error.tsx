"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

/** 화면 단위 오류 경계 — 흰 화면 대신 다시 시도할 수 있는 안내를 보여 준다 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell py-20 text-center">
      <p className="text-[19px] font-bold text-teal-700">일시적인 오류</p>
      <h1 className="mt-3 text-[34px] font-extrabold tracking-tight text-navy-900 sm:text-[40px]">
        화면을 불러오지 못했어요
      </h1>
      <p className="mt-3 text-[21px] text-navy-500">
        잠시 후 다시 시도해 주세요. 예약·찜 내역은 그대로 남아 있어요.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-navy-900 px-6 text-[21px] font-bold text-white transition-colors hover:bg-navy-800"
        >
          <RotateCcw className="h-5 w-5" strokeWidth={2.2} />
          다시 시도
        </button>
        <Link
          href="/"
          className="inline-flex h-14 items-center justify-center rounded-xl border border-navy-200 bg-white px-6 text-[21px] font-semibold text-navy-700 transition-colors hover:bg-navy-50"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
