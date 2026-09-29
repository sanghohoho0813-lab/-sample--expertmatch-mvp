import { CATEGORY_MAP, LANGUAGES, METHOD_LABEL } from "@/lib/data/categories";
import { formatCount, formatPrice } from "@/lib/format";
import type { Expert, Filters, SortOption } from "@/lib/types";

/**
 * "왜 이 전문가가 보이는지"를 짧게 설명한다.
 *
 * 사용자가 입력한 검색어·필터·정렬과 전문가 데이터가 실제로 일치하는
 * 경우에만 문구를 만든다. 추정이나 AI 판단처럼 보이는 표현은 쓰지 않는다.
 */
export function matchReasons(
  expert: Expert,
  ctx: { query: string; filters: Filters; sort: SortOption["id"] },
  limit = 2,
): string[] {
  const out: string[] = [];
  const push = (s: string) => {
    if (!out.includes(s)) out.push(s);
  };

  // 1) 검색어 — 전문분야 > 세부 키워드 > 카테고리 순으로 일치 근거를 찾는다
  const tokens = ctx.query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
  for (const token of tokens) {
    const specialty = expert.specialties.find((s) =>
      s.title.toLowerCase().includes(token),
    );
    if (specialty) {
      push(`${specialty.title} 전문`);
      continue;
    }
    const skill = expert.skills.find((s) => s.toLowerCase().includes(token));
    if (skill) {
      push(`'${skill}' 상담 분야`);
      continue;
    }
    const cat = expert.categories
      .map((id) => CATEGORY_MAP[id])
      .find(
        (c) =>
          c.name.toLowerCase().includes(token) ||
          c.keywords.some((k) => k.toLowerCase().includes(token)),
      );
    if (cat) push(`${cat.name} 상담 분야`);
  }

  // 2) 분야 필터
  const f = ctx.filters;
  if (f.categories.length > 0) {
    const primary = expert.categories[0];
    if (f.categories.includes(primary)) {
      push(`${CATEGORY_MAP[primary].name} 주력 전문가`);
    } else {
      const hit = expert.categories.find((c) => f.categories.includes(c));
      if (hit) push(`${CATEGORY_MAP[hit].name} 상담 가능`);
    }
  }

  // 3) 상담 방식
  if (f.methods.length > 0) {
    const hits = f.methods.filter((m) => expert.methods.includes(m));
    if (hits.length > 0) push(`${hits.map((m) => METHOD_LABEL[m]).join("·")} 가능`);
  }

  // 4) 수치 조건 — 선택한 기준을 그대로 보여준다
  if (f.ratingMin || ctx.sort === "rating") {
    push(`평점 ${expert.rating.toFixed(1)} · 후기 ${formatCount(expert.reviewCount)}개`);
  }
  if (f.minYears) push(`경력 ${expert.yearsOfExperience}년`);
  if (f.priceMax || ctx.sort === "priceAsc") {
    push(`${formatPrice(expert.priceFrom)}원부터 상담`);
  }
  if (ctx.sort === "consults") {
    push(`상담 ${formatCount(expert.consultCount)}회 진행`);
  }

  // 5) 언어 (한국어 외)
  const langHits = f.languages.filter(
    (l) => l !== LANGUAGES[0] && expert.languages.includes(l),
  );
  if (langHits.length > 0) push(`${langHits.join("·")} 상담 가능`);

  return out.slice(0, limit);
}
