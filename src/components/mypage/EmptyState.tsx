import Link from "next/link";
import { Search } from "lucide-react";

/** 탭별 빈 화면 — 무엇이 비었는지와 다음 행동 하나 */
export function EmptyState({
  title,
  body,
  actionLabel = "전문가 찾아보기",
  actionHref = "/experts",
  icon: EmptyIcon = Search,
}: {
  title: string;
  body: string;
  icon?: typeof Search;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50">
        <EmptyIcon className="h-6 w-6 text-navy-300" strokeWidth={2} />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-navy-900">{title}</h2>
      <p className="mt-1.5 text-md leading-relaxed text-navy-500">{body}</p>
      <Link
        href={actionHref}
        className="mt-5 inline-flex h-12 items-center rounded-xl bg-navy-900 px-6 text-lg font-bold text-white transition-colors hover:bg-navy-800"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

