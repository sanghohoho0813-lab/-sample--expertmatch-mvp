"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, SlidersHorizontal, Search, X } from "lucide-react";
import {
  SearchSuggest,
  flattenSuggestions,
  type SuggestItem,
} from "@/components/experts/SearchSuggest";
import { hasSuggestions, suggestFor } from "@/lib/suggest";
import { ExpertCard } from "@/components/experts/ExpertCard";
import { matchReasons } from "@/lib/matchReasons";
import { FilterPanel } from "@/components/experts/FilterPanel";
import { ActiveFilterChips } from "@/components/experts/ActiveFilterChips";
import { RecentExperts } from "@/components/experts/RecentExperts";
import { Overlay } from "@/components/ui/Overlay";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES, SORT_OPTIONS, SUGGESTED_KEYWORDS } from "@/lib/data/categories";
import { EXPERTS } from "@/lib/data/experts";
import {
  EMPTY_FILTERS,
  activeFilterCount,
  categoriesForQuery,
  searchExperts,
} from "@/lib/search";
import { cx } from "@/lib/format";
import type { CategoryId, Filters, SortOption } from "@/lib/types";

export function ExpertSearchClient() {
  const router = useRouter();
  const params = useSearchParams();

  const initialQuery = params.get("q") ?? "";
  const initialCategory = params.get("category") as CategoryId | null;
  const panel = params.get("panel");

  const [query, setQuery] = useState(initialQuery);
  const [input, setInput] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption["id"]>("recommended");
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [activeSuggest, setActiveSuggest] = useState(-1);
  const [categoryOpen, setCategoryOpen] = useState(panel === "categories");
  const searchRef = useRef<HTMLInputElement>(null);

  // 헤더의 검색 아이콘으로 들어오면 바로 입력할 수 있게
  useEffect(() => {
    if (params.get("focus") === "search") searchRef.current?.focus();
  }, [params]);

  // URL이 바뀌면(홈에서 진입 등) 상태를 다시 맞춘다
  useEffect(() => {
    const q = params.get("q") ?? "";
    const cat = params.get("category") as CategoryId | null;
    setQuery(q);
    setInput(q);
    setFilters((prev) => ({
      ...prev,
      categories: cat ? [cat] : prev.categories,
    }));
    // 이미 이 페이지에 있을 때 헤더의 '상담 분야'를 눌러도 열리도록
    if (params.get("panel") === "categories") setCategoryOpen(true);
  }, [params]);

  /** 분야 모달을 닫으면 주소의 panel 표시도 지워, 같은 링크를 다시 눌러도 열린다 */
  const closeCategory = useCallback(() => {
    setCategoryOpen(false);
    if (params.get("panel")) {
      const next = new URLSearchParams(params.toString());
      next.delete("panel");
      router.replace(next.toString() ? `/experts?${next}` : "/experts", { scroll: false });
    }
  }, [params, router]);

  const suggestedCategories = useMemo(() => categoriesForQuery(query), [query]);

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((c) => [
          c.id,
          EXPERTS.filter((e) => e.categories.includes(c.id)).length,
        ]),
      ),
    [],
  );

  const results = useMemo(
    () => searchExperts({ query, filters, sort }),
    [query, filters, sort],
  );

  const filterCount = activeFilterCount(filters);

  const suggestions = useMemo(() => suggestFor(input), [input]);
  const flatSuggest = useMemo(
    () => flattenSuggestions(suggestions),
    [suggestions],
  );
  const showSuggest = suggestOpen && hasSuggestions(suggestions);

  const pickSuggest = (item: SuggestItem) => {
    setSuggestOpen(false);
    if (item.kind === "expert") {
      router.push(`/experts/${item.id}`);
    } else if (item.kind === "category") {
      setFilters({ ...EMPTY_FILTERS, categories: [item.id as CategoryId] });
      setInput("");
      submitSearch("");
    } else {
      setInput(item.label);
      submitSearch(item.label);
    }
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggest) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggest((i) => (i + 1) % flatSuggest.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggest((i) => (i <= 0 ? flatSuggest.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeSuggest >= 0) {
      e.preventDefault();
      pickSuggest(flatSuggest[activeSuggest]);
    } else if (e.key === "Escape") {
      setSuggestOpen(false);
    }
  };

  const submitSearch = useCallback(
    (value: string) => {
      const q = value.trim();
      setQuery(q);
      const next = new URLSearchParams();
      if (q) next.set("q", q);
      router.replace(next.toString() ? `/experts?${next}` : "/experts", {
        scroll: false,
      });
    },
    [router],
  );

  const resetAll = () => {
    setFilters(EMPTY_FILTERS);
    setQuery("");
    setInput("");
    router.replace("/experts", { scroll: false });
  };

  const toggleCategory = (id: CategoryId) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((c) => c !== id)
        : [...f.categories, id],
    }));
  };

  return (
    <div className="shell py-6 pb-40 lg:py-10 lg:pb-32">
      <h1 className="sr-only">전문가 찾기</h1>
      {/* 검색 바 */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSuggestOpen(false);
            submitSearch(input);
          }}
          role="search"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-navy-200 bg-white px-3 shadow-card transition-all duration-200 focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10"
        >
          <Search className="h-5 w-5 shrink-0 text-navy-300" strokeWidth={2.2} />
          <label htmlFor="expert-search" className="sr-only">
            전문가 검색
          </label>
          <input
            id="expert-search"
            ref={searchRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setActiveSuggest(-1);
            }}
            onFocus={() => setSuggestOpen(true)}
            onBlur={() => setSuggestOpen(false)}
            onKeyDown={onSearchKeyDown}
            role="combobox"
            aria-expanded={showSuggest}
            aria-controls="search-suggest"
            aria-autocomplete="list"
            placeholder="분야·고민·이름 검색"
            className="h-12 w-full min-w-0 bg-transparent text-[22px] outline-none placeholder:text-navy-300 sm:text-[24px]"
            autoComplete="off"
          />
          {input && (
            <button
              type="button"
              onClick={() => {
                setInput("");
                submitSearch("");
              }}
              aria-label="검색어 지우기"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-navy-300 hover:bg-navy-50 hover:text-navy-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className="h-9 shrink-0 rounded-lg bg-navy-900 px-4 text-[23px] font-semibold text-white transition-colors hover:bg-navy-800"
          >
            검색
          </button>
        </form>

          {showSuggest && (
            <SearchSuggest
              suggestions={suggestions}
              activeIndex={activeSuggest}
              onPick={pickSuggest}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label={
              filterCount > 0 ? `필터 열기 (적용 ${filterCount}개)` : "필터 열기"
            }
            className={cx(
              "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border px-4 text-[23.5px] font-semibold transition-colors lg:hidden",
              filterCount > 0
                ? "border-teal-600 bg-teal-50 text-teal-800"
                : "border-navy-200 bg-white text-navy-700",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} />
            필터
            {filterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1 text-[17.5px] font-bold text-white">
                {filterCount}
              </span>
            )}
          </button>

          <div className="relative flex-1 lg:flex-none">
            <label htmlFor="sort-select" className="sr-only">
              정렬 기준
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption["id"])}
              className="h-12 w-full appearance-none rounded-2xl border border-navy-200 bg-white pl-4 pr-9 text-[23.5px] font-semibold text-navy-800 outline-none transition-colors hover:border-navy-300 focus:border-teal-500 lg:w-[152px]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400"
              strokeWidth={2.4}
            />
          </div>
        </div>
      </div>

      {/* 검색어 기반 분야 추천 */}
      {query && suggestedCategories.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-teal-100 bg-teal-50/60 px-4 py-3">
          <span className="text-[21.5px] font-semibold text-teal-900">
            &lsquo;{query}&rsquo; 관련 분야
          </span>
          {suggestedCategories.map((id) => {
            const cat = CATEGORIES.find((c) => c.id === id)!;
            const active = filters.categories.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleCategory(id)}
                className={cx(
                  "inline-flex min-h-[34px] items-center gap-1 rounded-lg border px-2.5 text-[21px] font-semibold transition-colors",
                  active
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-teal-200 bg-white text-teal-800 hover:bg-teal-100",
                )}
              >
                <Icon name={cat.icon} className="h-3.5 w-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex gap-6 xl:gap-8">
        {/* 데스크톱 필터 사이드바 */}
        <aside className="hidden w-[272px] shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-2xl border border-navy-100 bg-white p-4 shadow-card scroll-slim">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(EMPTY_FILTERS)}
              counts={categoryCounts}
            />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p
              className="text-[24px] text-navy-500"
              role="status"
              aria-live="polite"
            >
              검색 결과{" "}
              <span className="text-[27.5px] font-extrabold text-navy-900">
                {results.length}명
              </span>
              {query && (
                <span className="ml-1.5 text-[23px] text-navy-400">
                  · &lsquo;{query}&rsquo; 검색
                </span>
              )}
            </p>
          </div>

          <ActiveFilterChips
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(EMPTY_FILTERS)}
          />

          <h2 className="sr-only">검색 결과</h2>
          {results.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {results.map((expert) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  reasons={matchReasons(expert, { query, filters, sort })}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-navy-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50">
                <Search className="h-6 w-6 text-navy-300" strokeWidth={2} />
              </div>
              <h3 className="mt-4 text-[27.5px] font-bold text-navy-900">
                조건에 맞는 전문가가 없습니다
              </h3>
              <p className="mt-1.5 text-[23.5px] text-navy-500">
                검색어를 바꾸거나 필터를 완화해 보세요.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {SUGGESTED_KEYWORDS.slice(0, 5).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setInput(k);
                      setFilters(EMPTY_FILTERS);
                      submitSearch(k);
                    }}
                    className="min-h-[40px] rounded-xl border border-navy-200 bg-white px-3.5 text-[21.5px] font-medium text-navy-600 transition-colors hover:border-navy-300 hover:bg-navy-50"
                  >
                    {k}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={resetAll}
                className="mt-4 text-[23px] font-semibold text-teal-700 hover:text-teal-800"
              >
                전체 전문가 다시 보기
              </button>
            </div>
          )}
          <RecentExperts />
        </div>
      </div>

      {/* 모바일 필터 바텀시트 */}
      <Overlay
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="필터"
        description={`조건에 맞는 전문가 ${results.length}명`}
        width="max-w-lg"
        footer={
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="h-12 flex-1 rounded-xl border border-navy-200 bg-white text-[24px] font-semibold text-navy-600 transition-colors hover:bg-navy-50"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="h-12 flex-[2] rounded-xl bg-teal-600 text-[24px] font-bold text-white transition-colors hover:bg-teal-700"
            >
              전문가 {results.length}명 보기
            </button>
          </div>
        }
      >
        <div className="px-5 pb-4">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(EMPTY_FILTERS)}
            counts={categoryCounts}
            showHeader={false}
          />
        </div>
      </Overlay>

      {/* 상담 분야 바로가기 (헤더 '상담 분야' 진입) */}
      <Overlay
        open={categoryOpen}
        onClose={closeCategory}
        title="상담 분야"
        description="분야를 선택하면 해당 전문가만 모아 보여드려요."
        width="max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setFilters({ ...EMPTY_FILTERS, categories: [c.id] });
                closeCategory();
              }}
              className="flex flex-col items-start gap-2 rounded-2xl border border-navy-100 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-card"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <span className="text-[24px] font-bold text-navy-900">{c.name}</span>
              <span className="text-[20.5px] leading-snug text-navy-500">
                {c.tagline}
              </span>
            </button>
          ))}
        </div>
      </Overlay>
    </div>
  );
}
