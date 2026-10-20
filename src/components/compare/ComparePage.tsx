"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ArrowLeft, ListChecks, Plus } from "lucide-react";
import { CompareView } from "@/components/compare/CompareView";
import { FitList } from "@/components/match/FitList";
import { Portrait } from "@/components/ui/Portrait";
import { Bone, CompareSkeleton } from "@/components/ui/Skeleton";
import { earliestSlot } from "@/lib/availability";
import { compareDifferences, compareVerdicts, type Earliest } from "@/lib/compareInsights";
import { CATEGORY_MAP } from "@/lib/data/categories";
import { EXPERTS, EXPERT_MAP } from "@/lib/data/experts";
import { cx, formatPrice } from "@/lib/format";
import { evaluateFit, needsSummary } from "@/lib/needs";
import { MAX_COMPARE, useAppStore } from "@/lib/store/AppStore";
import { shortestMinutes, useNow } from "@/lib/useAvailability";
import type { Expert } from "@/lib/types";

/**
 * 비교 — 표를 보여 주는 데서 끝나지 않고 '누구에게 받을지' 정하도록 돕는다.
 * 1) 한눈에 보는 차이  2) 이런 경우에는 이 전문가  3) 항목별 비교표
 */
export function ComparePage() {
  const router = useRouter();
  const params = useSearchParams();
  const now = useNow();
  const { compare, removeCompare, replaceCompare, toggleCompare, clearCompare, bookings, ready, needs } =
    useAppStore();

  // 공유된 주소(?ids=a,b)로 들어오면 그 목록으로 바꾼다
  const idsParam = params.get("ids");
  useEffect(() => {
    if (!ready || idsParam === null) return;
    replaceCompare(idsParam.split(",").filter((id) => EXPERT_MAP[id]));
    router.replace("/compare", { scroll: false });
  }, [ready, idsParam, replaceCompare, router]);

  const experts = useMemo(() => compare.map((id) => EXPERT_MAP[id]).filter(Boolean), [compare]);

  const earliest = useMemo<Earliest>(() => {
    const out: Earliest = {};
    if (now && ready) for (const e of experts) out[e.id] = earliestSlot(e.id, now, bookings, shortestMinutes(e));
    return out;
  }, [experts, now, ready, bookings]);
  const known = now && ready ? now : null;

  const differences = useMemo(() => compareDifferences(experts, earliest, known), [experts, earliest, known]);
  const verdicts = useMemo(() => compareVerdicts(experts, earliest, known), [experts, earliest, known]);

  // 맞춤 찾기에서 답한 조건이 있으면 같은 기준으로 대조해 보여 준다
  const hasNeeds = !!needs && (needs.topic !== null || needsSummary(needs).length > 1);
  const fits = useMemo(() => {
    if (!needs || !hasNeeds || !known) return null;
    return Object.fromEntries(experts.map((e) => [e.id, evaluateFit(e, needs, earliest[e.id] ?? null, known).fits]));
  }, [needs, hasNeeds, known, experts, earliest]);

  // 함께 비교해 볼 만한 전문가 — 담은 분들의 주력 분야가 같은 사람부터
  const suggestions = useMemo(() => {
    if (experts.length >= MAX_COMPARE) return [];
    const cats = new Set(experts.flatMap((e) => e.categories));
    return EXPERTS.filter((e) => !compare.includes(e.id))
      .map((e) => ({ e, s: e.categories.filter((c) => cats.has(c)).length * 10 - e.featuredRank }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((x) => x.e);
  }, [experts, compare]);

  if (!ready || idsParam !== null) return <CompareSkeleton />;

  return (
    <div className="shell py-8 pb-32 sm:py-12">
      <button
        type="button"
        onClick={() => (window.history.length > 1 ? router.back() : router.push("/experts"))}
        className="-ml-2 inline-flex h-10 items-center gap-1.5 rounded-lg px-2 text-base font-semibold text-navy-500 transition-colors hover:bg-navy-50 hover:text-navy-900"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
        계속 둘러보기
      </button>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bold leading-tight text-navy-900 sm:text-7xl">
            {experts.length >= 2 ? `전문가 ${experts.length}명 비교` : "전문가 비교"}
          </h1>
          <p className="mt-2 text-lg text-navy-500">
            상담료·예약 가능 시간·경력처럼 확인할 수 있는 사실끼리만 견줬어요.
          </p>
        </div>
        {experts.length > 0 && (
          <button
            type="button"
            onClick={clearCompare}
            className="inline-flex h-11 items-center rounded-xl border border-navy-200 px-4 text-md font-semibold text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900"
          >
            비교 목록 비우기
          </button>
        )}
      </header>

      {experts.length < 2 ? (
        <EmptyCompare experts={experts} onRemove={removeCompare} />
      ) : (
        <>
          {/* 1. 한눈에 보는 차이 */}
          <section className="mt-8" aria-labelledby="cmp-diff">
            <h2 id="cmp-diff" className="text-3xl font-bold text-navy-900">
              한눈에 보는 차이
            </h2>
            <dl className="mt-4 divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white">
              {differences.map((d) => (
                <div key={d.key} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-6">
                  <dt className="shrink-0 text-md font-semibold text-navy-400 sm:w-36">{d.label}</dt>
                  <dd className="text-lg leading-snug text-navy-800">{d.text}</dd>
                </div>
              ))}
              {!known && (
                <div className="px-5 py-4">
                  <Bone className="h-5 w-2/3" />
                </div>
              )}
            </dl>
          </section>

          {/* 2. 이런 경우에는 이 전문가 */}
          <section className="mt-10" aria-labelledby="cmp-verdict">
            <h2 id="cmp-verdict" className="text-3xl font-bold text-navy-900">
              이런 경우에는 이 전문가
            </h2>
            {fits && needs && (
              <p className="mt-1.5 text-md text-navy-500">
                맞춤 찾기에서 답한 조건({needsSummary(needs).join(" · ")})과도 함께 대조했어요.
              </p>
            )}
            <ul
              className={cx(
                "mt-4 grid grid-cols-1 gap-4",
                experts.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
              )}
            >
              {verdicts.map(({ expert, cases }) => (
                <li key={expert.id} className="flex flex-col rounded-2xl border border-navy-100 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <Portrait
                      name={expert.name}
                      accent={expert.accent}
                      photo={expert.photo}
                      rounded="rounded-xl"
                      sizes="56px"
                      className="h-14 w-14 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-2xl font-bold text-navy-900">{expert.name}</p>
                      <p className="text-base leading-snug text-navy-500">
                        {CATEGORY_MAP[expert.categories[0]].name} · 경력 {expert.yearsOfExperience}년
                        <span className="block">{formatPrice(expert.priceFrom)}원부터</span>
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {cases.map((c) => (
                      <li key={c.when} className="border-l-2 border-teal-500 pl-3">
                        <p className="text-lg font-bold leading-snug text-navy-900">{c.when}</p>
                        <p className="mt-0.5 text-base leading-snug text-navy-500">{c.because}</p>
                      </li>
                    ))}
                  </ul>

                  {fits?.[expert.id] && (
                    <div className="mt-4">
                      <FitList fits={fits[expert.id]} compact label="맞춤 찾기 조건" />
                    </div>
                  )}

                  <div className="mt-auto flex gap-2 pt-5">
                    <Link
                      href={`/experts/${expert.id}`}
                      className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-navy-200 text-md font-semibold text-navy-700 transition-colors hover:bg-navy-50"
                    >
                      프로필
                    </Link>
                    <Link
                      href={`/booking/${expert.id}`}
                      className="inline-flex h-12 flex-[2] items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white transition-[color,background-color,border-color,transform] hover:bg-teal-700 active:scale-[0.98]"
                    >
                      예약하기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. 항목별 비교 */}
          <section className="mt-10" aria-labelledby="cmp-table">
            <h2 id="cmp-table" className="text-3xl font-bold text-navy-900">
              항목별 비교
            </h2>
            <div className="mt-4 md:overflow-hidden md:rounded-2xl md:border md:border-navy-100 md:bg-white">
              <CompareView experts={experts} onRemove={removeCompare} />
            </div>
          </section>
        </>
      )}

      {suggestions.length > 0 && (
        <section className="mt-10" aria-labelledby="cmp-more">
          <h2 id="cmp-more" className="text-2xl font-bold text-navy-900">
            {experts.length === 0 ? "이런 전문가부터 비교해 보세요" : "함께 비교해 볼 만한 전문가"}
          </h2>
          <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            {suggestions.map((e) => (
              <SuggestRow key={e.id} expert={e} onAdd={() => toggleCompare(e.id, e.name)} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function SuggestRow({ expert, onAdd }: { expert: Expert; onAdd: () => void }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-navy-100 bg-white p-3.5">
      <Portrait
        name={expert.name}
        accent={expert.accent}
        photo={expert.photo}
        rounded="rounded-xl"
        sizes="48px"
        className="h-12 w-12 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <Link href={`/experts/${expert.id}`} className="text-lg font-bold text-navy-900 hover:text-teal-700">
          {expert.name}
        </Link>
        <p className="truncate text-base text-navy-500">
          {CATEGORY_MAP[expert.categories[0]].name} · {formatPrice(expert.priceFrom)}원부터
        </p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        aria-label={`${expert.name} 비교에 담기`}
        className="inline-flex h-11 shrink-0 items-center gap-1 rounded-xl border border-navy-200 px-3 text-md font-semibold text-navy-700 transition-colors hover:border-teal-600 hover:text-teal-700"
      >
        <Plus className="h-4 w-4" strokeWidth={2.4} />
        담기
      </button>
    </li>
  );
}

function EmptyCompare({ experts, onRemove }: { experts: Expert[]; onRemove: (id: string) => void }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-12 text-center">
      <p className="text-2xl font-bold text-navy-900">
        {experts.length === 1 ? "한 명만 더 담으면 비교할 수 있어요" : "아직 비교할 전문가가 없어요"}
      </p>
      <p className="mx-auto mt-2 max-w-md text-lg text-navy-500">
        전문가 목록의 &lsquo;비교&rsquo; 버튼으로 2~3명을 담거나, 맞춤 찾기로 추천받은 분들을 한 번에 비교해 보세요.
      </p>
      {experts.length === 1 && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-canvas px-3 py-2 text-md text-navy-700">
          담은 전문가: <b>{experts[0].name}</b>
          <button type="button" onClick={() => onRemove(experts[0].id)} className="text-navy-400 underline hover:text-navy-700">
            빼기
          </button>
        </p>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <Link
          href="/match"
          className="inline-flex h-12 items-center gap-1.5 rounded-xl bg-navy-900 px-5 text-lg font-bold text-white hover:bg-navy-800 transition-[color,background-color,border-color,transform] active:scale-[0.98]"
        >
          <ListChecks className="h-4 w-4 text-teal-300" strokeWidth={2.2} />
          맞춤 찾기
        </Link>
        <Link
          href="/experts"
          className="inline-flex h-12 items-center rounded-xl border border-navy-200 px-5 text-lg font-semibold text-navy-700 hover:bg-navy-50"
        >
          전문가 둘러보기
        </Link>
      </div>
    </div>
  );
}
