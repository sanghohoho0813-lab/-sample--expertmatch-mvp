import { CATEGORIES } from "@/lib/data/categories";
import { EXPERTS } from "@/lib/data/experts";
import type { CategoryId, Expert, Filters, SortOption } from "@/lib/types";

export const EMPTY_FILTERS: Filters = {
  categories: [],
  priceMax: null,
  ratingMin: null,
  methods: [],
  minYears: null,
  availableOnly: false,
  languages: [],
};

/** 검색어 → 매칭되는 카테고리 id 추론 */
export function categoriesForQuery(query: string): CategoryId[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.toLowerCase().includes(q) || q.includes(k.toLowerCase())),
  ).map((c) => c.id);
}

function matchesQuery(expert: Expert, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    expert.name,
    expert.title,
    expert.affiliation,
    expert.headline,
    ...expert.skills,
    ...expert.strengths,
    ...expert.specialties.map((s) => s.title),
    ...expert.categories.flatMap((id) => {
      const c = CATEGORIES.find((x) => x.id === id);
      return c ? [c.name, ...c.keywords] : [];
    }),
  ]
    .join(" ")
    .toLowerCase();
  // 공백으로 나눈 토큰 중 하나라도 맞으면 노출 (한국어 짧은 질의 대응)
  return q
    .split(/\s+/)
    .some((token) => token.length > 0 && haystack.includes(token));
}

function matchesFilters(expert: Expert, filters: Filters): boolean {
  if (
    filters.categories.length > 0 &&
    !expert.categories.some((c) => filters.categories.includes(c))
  ) {
    return false;
  }
  if (filters.priceMax && expert.priceFrom > filters.priceMax) return false;
  if (filters.ratingMin && expert.rating < filters.ratingMin) return false;
  if (
    filters.methods.length > 0 &&
    !expert.methods.some((m) => filters.methods.includes(m))
  ) {
    return false;
  }
  if (filters.minYears && expert.yearsOfExperience < filters.minYears) return false;
  if (filters.availableOnly && !expert.availableThisWeek) return false;
  if (
    filters.languages.length > 0 &&
    !expert.languages.some((l) => filters.languages.includes(l))
  ) {
    return false;
  }
  return true;
}

export function sortExperts(list: Expert[], sort: SortOption["id"]): Expert[] {
  const out = [...list];
  switch (sort) {
    case "rating":
      return out.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      );
    case "consults":
      return out.sort((a, b) => b.consultCount - a.consultCount);
    case "priceAsc":
      return out.sort((a, b) => a.priceFrom - b.priceFrom || b.rating - a.rating);
    default:
      return out.sort((a, b) => a.featuredRank - b.featuredRank);
  }
}

export interface SearchArgs {
  query: string;
  filters: Filters;
  sort: SortOption["id"];
}

export function searchExperts({ query, filters, sort }: SearchArgs): Expert[] {
  const matched = EXPERTS.filter(
    (e) => matchesQuery(e, query) && matchesFilters(e, filters),
  );
  return sortExperts(matched, sort);
}

export function activeFilterCount(filters: Filters): number {
  return (
    filters.categories.length +
    (filters.priceMax ? 1 : 0) +
    (filters.ratingMin ? 1 : 0) +
    filters.methods.length +
    (filters.minYears ? 1 : 0) +
    (filters.availableOnly ? 1 : 0) +
    filters.languages.length
  );
}
