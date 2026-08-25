import { CATEGORIES } from "@/lib/data/categories";
import { EXPERTS } from "@/lib/data/experts";
import type { Category, Expert } from "@/lib/types";

export interface Suggestions {
  categories: Category[];
  experts: Expert[];
  keywords: string[];
}

const ALL_KEYWORDS = Array.from(
  new Set([
    ...CATEGORIES.flatMap((c) => c.keywords),
    ...EXPERTS.flatMap((e) => e.skills),
  ]),
);

/** 검색창 입력에 대한 자동완성 후보 */
export function suggestFor(input: string): Suggestions {
  const q = input.trim().toLowerCase();
  if (q.length === 0) return { categories: [], experts: [], keywords: [] };

  const categories = CATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.toLowerCase().includes(q)),
  ).slice(0, 3);

  const experts = EXPERTS.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      e.skills.some((s) => s.toLowerCase().includes(q)) ||
      e.strengths.some((s) => s.toLowerCase().includes(q)),
  )
    .sort((a, b) => a.featuredRank - b.featuredRank)
    .slice(0, 4);

  const keywords = ALL_KEYWORDS.filter(
    (k) => k.toLowerCase().includes(q) && k.toLowerCase() !== q,
  ).slice(0, 4);

  return { categories, experts, keywords };
}

export function hasSuggestions(s: Suggestions): boolean {
  return s.categories.length + s.experts.length + s.keywords.length > 0;
}
