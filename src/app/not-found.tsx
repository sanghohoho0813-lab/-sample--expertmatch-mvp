import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-24 text-center">
      <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-teal-700">
        404
      </p>
      <h1 className="mt-3 text-[26px] font-extrabold tracking-tight text-navy-900 sm:text-[32px]">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 text-[15px] text-navy-500">
        주소가 변경되었거나 삭제된 페이지일 수 있습니다.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-navy-900 px-6 text-[15px] font-bold text-white transition-colors hover:bg-navy-800"
        >
          홈으로
        </Link>
        <Link
          href="/experts"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-navy-200 bg-white px-6 text-[15px] font-semibold text-navy-700 transition-colors hover:bg-navy-50"
        >
          전문가 찾기
        </Link>
      </div>
    </div>
  );
}
