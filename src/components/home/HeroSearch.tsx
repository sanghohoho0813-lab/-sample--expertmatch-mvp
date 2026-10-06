"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import {
  SearchSuggest,
  flattenSuggestions,
  type SuggestItem,
} from "@/components/experts/SearchSuggest";
import { SUGGESTED_KEYWORDS } from "@/lib/data/categories";
import { hasSuggestions, suggestFor } from "@/lib/suggest";
import { cx } from "@/lib/format";

export function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => suggestFor(value), [value]);
  const flat = useMemo(() => flattenSuggestions(suggestions), [suggestions]);
  const open = focused && hasSuggestions(suggestions);

  const submit = (query: string) => {
    const q = query.trim();
    setFocused(false);
    inputRef.current?.blur();
    router.push(q ? `/experts?q=${encodeURIComponent(q)}` : "/experts");
  };

  const pick = (item: SuggestItem) => {
    setFocused(false);
    inputRef.current?.blur();
    if (item.kind === "expert") router.push(`/experts/${item.id}`);
    else if (item.kind === "category") router.push(`/experts?category=${item.id}`);
    else submit(item.label);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? flat.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      pick(flat[active]);
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
          role="search"
          className={cx(
            "flex flex-col gap-2 rounded-2xl bg-white p-2 transition-all duration-300 sm:flex-row sm:items-center sm:rounded-[20px]",
            focused
              ? "shadow-[0_0_0_4px_rgba(18,179,168,0.35),0_24px_50px_-24px_rgba(0,0,0,0.6)]"
              : "shadow-[0_20px_44px_-24px_rgba(0,0,0,0.55)]",
          )}
        >
          <label htmlFor="hero-search" className="sr-only">
            어떤 분야의 전문가가 필요하신가요?
          </label>
          <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3">
            <Search className="h-6 w-6 shrink-0 text-navy-300" strokeWidth={2.2} />
            <input
              id="hero-search"
              ref={inputRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setActive(-1);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={onKeyDown}
              placeholder="분야·고민을 검색해 보세요"
              className="h-14 w-full min-w-0 bg-transparent text-lg text-navy-900 outline-none placeholder:text-navy-300 sm:h-[60px]"
              autoComplete="off"
              role="combobox"
              aria-expanded={open}
              aria-controls="search-suggest"
              aria-autocomplete="list"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-7 text-md font-bold text-white transition-all duration-200 hover:bg-teal-700 active:scale-[0.98] sm:h-[60px] sm:rounded-[14px] sm:px-8"
          >
            <Search className="h-5 w-5 sm:hidden" strokeWidth={2.6} />
            전문가 찾기
          </button>
        </form>

        {open && (
          <SearchSuggest
            suggestions={suggestions}
            activeIndex={active}
            onPick={pick}
          />
        )}
      </div>

      {/* 모바일은 한 줄 가로 스크롤로 — 히어로 높이를 줄인다 */}
      <div className="no-scrollbar -mx-5 mt-4 flex items-center gap-2 overflow-x-auto px-5 sm:mx-0 sm:mt-5 sm:flex-wrap sm:gap-x-2.5 sm:gap-y-2.5 sm:overflow-visible sm:px-0">
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-teal-300">
          <Sparkles className="h-4 w-4" strokeWidth={2.4} />
          인기 검색어
        </span>
        {SUGGESTED_KEYWORDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setValue(k);
              submit(k);
            }}
            className="min-h-[40px] shrink-0 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-3.5 text-xs font-medium text-white/90 transition-colors duration-200 hover:border-teal-400/60 hover:bg-white/20 hover:text-white"
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
