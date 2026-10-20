"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, GitCompareArrows, Info, SlidersHorizontal } from "lucide-react";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { earliestSlot } from "@/lib/availability";
import { CATEGORY_MAP } from "@/lib/data/categories";
import {
  EMPTY_NEEDS,
  conditionLabel,
  fitsAll,
  needsFromParams,
  needsSummary,
  needsToParams,
  recommend,
  relaxSuggestion,
  withoutCondition,
  type Needs,
} from "@/lib/needs";
import { useAppStore } from "@/lib/store/AppStore";
import { shortestMinutes, useNow } from "@/lib/useAvailability";

const NEED_KEYS = ["topic", "who", "method", "budget", "when"];
const MAX_MEMO = 300;
const TOP = 3;

/** 질문 화면으로 돌아가 답을 고칠 때 — 기존 답을 모두 유지 */
function editHref(needs: Needs): string {
  const p = new URLSearchParams(needsToParams(needs));
  for (let i = 1; i <= 5; i++) p.set(`a${i}`, "1");
  p.set("q", "1");
  return `/match?${p.toString()}`;
}

export function MatchResult() {
  const router = useRouter();
  const params = useSearchParams();
  const now = useNow();
  const { needs: saved, setNeeds, bookings, ready, replaceCompare } = useAppStore();

  // 주소에 조건이 있으면 주소가 기준 (새로고침·공유), 없으면 마지막으로 저장한 답
  const hasParams = NEED_KEYS.some((k) => params.has(k));
  const fromUrl = useMemo(() => needsFromParams(new URLSearchParams(params.toString())), [params]);
  const base: Needs = hasParams ? fromUrl : saved ?? EMPTY_NEEDS;
  const key = needsToParams(base);
  const needs = useMemo<Needs>(() => ({ ...base, memo: saved?.memo }), [key, saved?.memo]); // eslint-disable-line react-hooks/exhaustive-deps

  // 예약 화면이 상담 방식·고민 메모를 이어받을 수 있게 저장해 둔다
  useEffect(() => {
    if (!ready || !hasParams) return;
    if (saved && needsToParams(saved) === needsToParams(fromUrl)) return;
    setNeeds({ ...fromUrl, memo: saved?.memo });
  }, [ready, hasParams, fromUrl, saved, setNeeds]);

  const recs = useMemo(() => {
    if (!ready || !now) return null;
    return recommend(needs, (e) => earliestSlot(e.id, now, bookings, shortestMinutes(e)), now);
  }, [needs, ready, now, bookings]);

  const summary = needsSummary(needs);
  const answered = recs ? recs.some((r) => r.fits.length > 0) : false;
  const perfect = recs ? recs.filter(fitsAll).length : 0;
  const top = recs?.slice(0, TOP) ?? [];
  const rest = recs?.slice(TOP) ?? [];
  const relax = recs && perfect < TOP ? relaxSuggestion(recs) : null;
  const topic = needs.topic ? CATEGORY_MAP[needs.topic] : null;

  const heading = !recs
    ? "조건에 맞는 전문가를 찾고 있어요"
    : !answered
      ? "평점과 후기가 좋은 전문가부터 골랐어요"
      : perfect > 0
        ? `조건에 모두 맞는 전문가 ${perfect}명을 찾았어요`
        : "모든 조건에 맞는 전문가는 없어서, 가장 가까운 분을 골랐어요";

  const compareTop = () => {
    replaceCompare(top.map((r) => r.expert.id));
    router.push("/compare");
  };

  return (
    <div className="shell py-8 pb-32 sm:py-12">
      <nav aria-label="현재 위치" className="text-base text-navy-400">
        <Link href={editHref(needs)} className="link-quiet underline decoration-navy-200 underline-offset-4">
          맞춤 찾기
        </Link>
        <span className="mx-1.5" aria-hidden>
          /
        </span>
        <span className="text-navy-600">추천 결과</span>
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="text-5xl font-bold leading-tight text-navy-900 sm:text-7xl" aria-live="polite">
          {heading}
        </h1>
        <p className="mt-3 flex items-start gap-2 text-md leading-relaxed text-navy-500 sm:text-lg">
          <Info className="mt-1 h-4 w-4 shrink-0 text-navy-400" strokeWidth={2.2} />
          <span>
            내 답변을 전문가의 분야·대상·방식·상담료·빈 시간과 하나씩 대조했어요. 매칭 점수는 만들지 않아요.
          </span>
        </p>
      </header>

      {/* 내 조건 */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-base font-semibold text-navy-500">내 조건</span>
        {summary.map((s) => (
          <span key={s} className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-base font-semibold text-navy-700">
            {s}
          </span>
        ))}
        <Link
          href={editHref(needs)}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-base font-semibold text-teal-700 transition-colors hover:bg-teal-50"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} />
          조건 바꾸기
        </Link>
      </div>

      {relax && (
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-md text-navy-700">
          <span>
            &lsquo;{conditionLabel(needs, relax.key)}&rsquo; 조건을 빼면 <b>{relax.gain}명</b>이 모든 조건에 맞아요.
          </span>
          <Link
            href={`/match/result?${needsToParams(withoutCondition(needs, relax.key))}`}
            className="font-semibold text-teal-700 underline-offset-4 hover:underline"
          >
            이 조건 빼고 보기
          </Link>
        </p>
      )}

      {/* 먼저 볼 전문가 */}
      <section className="mt-8" aria-labelledby="match-top">
        <h2 id="match-top" className="text-3xl font-bold text-navy-900">
          먼저 살펴볼 전문가
        </h2>
        {recs === null ? (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {Array.from({ length: TOP }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : top.length > 0 ? (
          <ol className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {top.map((r) => (
              <li key={r.expert.id} className="flex">
                <div className="flex w-full flex-col [&>article]:flex-1">
                  <ExpertCard expert={r.expert} fits={r.fits} />
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-14 text-center">
            <p className="text-2xl font-bold text-navy-900">이 조건의 전문가가 아직 없어요</p>
            <p className="mt-2 text-lg text-navy-500">분야를 바꾸거나 검색으로 직접 찾아보세요.</p>
            <Link
              href="/experts"
              className="mt-5 inline-flex h-12 items-center rounded-xl bg-navy-900 px-5 text-lg font-bold text-white hover:bg-navy-800"
            >
              전체 전문가 보기
            </Link>
          </div>
        )}
      </section>

      {top.length >= 2 && (
        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-navy-900 px-5 py-5 text-white sm:flex-row sm:items-center sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold">누구에게 상담받을지 고민된다면</p>
            <p className="mt-1 text-md text-navy-200">
              상담료·가장 빠른 예약·경력 차이와 &lsquo;이런 경우엔 누가 맞는지&rsquo;를 한 화면에서 보여 드려요.
            </p>
          </div>
          <button
            type="button"
            onClick={compareTop}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-lg font-bold text-navy-900 transition-colors hover:bg-teal-50"
          >
            <GitCompareArrows className="h-5 w-5 text-teal-700" strokeWidth={2.2} />
            추천 {top.length}명 비교하기
          </button>
        </div>
      )}

      {recs && top.length > 0 && <MemoBox needs={needs} onSave={setNeeds} />}

      {rest.length > 0 && (
        <section className="mt-12" aria-labelledby="match-rest">
          <h2 id="match-rest" className="text-3xl font-bold text-navy-900">
            {topic ? `${topic.name} 분야의 다른 전문가` : "조건에 가까운 다른 전문가"}
            <span className="ml-2 text-xl font-semibold text-navy-400">{rest.length}명</span>
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((r) => (
              <li key={r.expert.id} className="flex">
                <div className="flex w-full flex-col [&>article]:flex-1">
                  <ExpertCard expert={r.expert} fits={r.fits} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-navy-100 pt-6 text-lg">
        {topic && (
          <Link href={`/experts?category=${topic.id}`} className="inline-flex items-center gap-1.5 font-semibold text-navy-700 hover:text-teal-700">
            {topic.name} 전문가 검색 화면에서 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        <Link href="/experts" className="inline-flex items-center gap-1.5 font-semibold text-navy-700 hover:text-teal-700">
          검색어로 직접 찾기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

/** 고민 한 줄 — 예약할 때 '상담 내용'에 미리 채워진다 */
function MemoBox({ needs, onSave }: { needs: Needs; onSave: (n: Needs) => void }) {
  const [memo, setMemo] = useState(needs.memo ?? "");
  const [savedAt, setSavedAt] = useState(false);

  // 다른 탭에서 바뀐 경우 반영
  useEffect(() => {
    setMemo(needs.memo ?? "");
  }, [needs.memo]);

  const save = () => {
    const trimmed = memo.trim();
    if ((needs.memo ?? "") === trimmed) return;
    onSave({ ...needs, memo: trimmed || undefined });
    setSavedAt(true);
  };

  return (
    <section className="mt-6 rounded-2xl border border-navy-100 bg-white p-5 sm:p-6" aria-labelledby="match-memo">
      <h2 id="match-memo" className="text-xl font-bold text-navy-900">
        전문가에게 전할 고민 <span className="font-medium text-navy-400">(선택)</span>
      </h2>
      <p className="mt-1 text-md text-navy-500">
        적어 두면 어느 전문가에게 예약하든 &lsquo;상담 내용&rsquo;에 미리 채워져요. 예약 전에 고칠 수 있어요.
      </p>
      <textarea
        value={memo}
        onChange={(e) => {
          setMemo(e.target.value.slice(0, MAX_MEMO));
          setSavedAt(false);
        }}
        onBlur={save}
        rows={3}
        placeholder="예) 온라인 쇼핑몰을 준비 중인데, 개인사업자와 법인 중 무엇이 나은지 궁금해요."
        className="field mt-3 resize-none leading-relaxed"
        aria-describedby="match-memo-count"
      />
      <div className="mt-1.5 flex items-center justify-between text-base text-navy-400">
        <span aria-live="polite">{savedAt ? "저장했어요" : "입력을 마치면 자동으로 저장돼요"}</span>
        <span id="match-memo-count">
          {memo.length}/{MAX_MEMO}
        </span>
      </div>
    </section>
  );
}
