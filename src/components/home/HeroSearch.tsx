"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { SUGGESTED_KEYWORDS } from "@/lib/data/categories";
import { cx } from "@/lib/format";

export function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (query: string) => {
    const q = query.trim();
    router.push(q ? `/experts?q=${encodeURIComponent(q)}` : "/experts");
  };

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className={cx(
          "flex flex-col gap-2 rounded-2xl bg-white p-2 transition-all duration-300 sm:flex-row sm:items-center sm:rounded-[20px]",
          focused
            ? "shadow-[0_0_0_4px_rgba(18,179,168,0.35),0_24px_50px_-24px_rgba(0,0,0,0.6)]"
            : "shadow-[0_20px_44px_-24px_rgba(0,0,0,0.55)]",
        )}
      >
        <label htmlFor="hero-search" className="sr-only">
          어떤 도움이 필요하신가요?
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3">
          <Search className="h-5 w-5 shrink-0 text-navy-300" strokeWidth={2.2} />
          <input
            id="hero-search"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="어떤 분야의 전문가가 필요하신가요?"
            className="h-12 w-full min-w-0 bg-transparent text-[21px] text-navy-900 outline-none placeholder:text-navy-300 sm:h-[52px]"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 text-[20px] font-bold text-white transition-all duration-200 hover:bg-teal-700 active:scale-[0.98] sm:h-[52px] sm:rounded-[14px] sm:px-7"
        >
          <Search className="h-4 w-4 sm:hidden" strokeWidth={2.6} />
          전문가 찾기
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
        <span className="inline-flex items-center gap-1 text-[17.5px] font-semibold text-teal-300">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
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
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[17.5px] font-medium text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-teal-400/60 hover:bg-white/20 hover:text-white"
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
