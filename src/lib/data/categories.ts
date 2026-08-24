import type { Category, ConsultMethod, SortOption } from "@/lib/types";

export const CATEGORIES: Category[] = [
  {
    id: "startup",
    name: "창업",
    tagline: "아이템 검증부터 초기 실행까지",
    icon: "Rocket",
    keywords: ["창업", "사업계획", "사업계획서", "비즈니스모델", "BM", "정부지원사업", "린스타트업", "초기창업"],
  },
  {
    id: "marketing",
    name: "마케팅",
    tagline: "브랜드와 성장 채널 설계",
    icon: "Megaphone",
    keywords: ["마케팅", "브랜딩", "퍼포먼스", "광고", "콘텐츠", "그로스", "SNS", "퍼널"],
  },
  {
    id: "investment",
    name: "투자",
    tagline: "IR과 투자유치 전략",
    icon: "TrendingUp",
    keywords: ["투자", "투자유치", "IR", "밸류에이션", "시드", "시리즈A", "VC", "피칭"],
  },
  {
    id: "tax",
    name: "세무",
    tagline: "절세와 신고 실무",
    icon: "Receipt",
    keywords: ["세무", "세금", "부가세", "종합소득세", "법인세", "절세", "회계", "기장"],
  },
  {
    id: "legal",
    name: "법률",
    tagline: "계약과 분쟁 리스크 점검",
    icon: "Scale",
    keywords: ["법률", "계약", "계약서", "분쟁", "지식재산", "상표", "약관", "자문"],
  },
  {
    id: "career",
    name: "커리어",
    tagline: "이직·경력 전환 설계",
    icon: "Compass",
    keywords: ["커리어", "이직", "면접", "이력서", "경력", "포트폴리오", "연봉협상"],
  },
  {
    id: "hr",
    name: "인사·노무",
    tagline: "채용과 조직 운영",
    icon: "Users",
    keywords: ["인사", "노무", "채용", "조직", "근로계약", "평가", "취업규칙", "HR"],
  },
  {
    id: "design",
    name: "디자인",
    tagline: "제품·브랜드 경험 설계",
    icon: "PenTool",
    keywords: ["디자인", "UX", "UI", "브랜드디자인", "프로토타입", "리서치"],
  },
  {
    id: "it",
    name: "IT·개발",
    tagline: "제품 개발과 기술 선택",
    icon: "Code2",
    keywords: ["IT", "개발", "MVP", "외주", "아키텍처", "데이터", "기술스택", "앱"],
  },
  {
    id: "management",
    name: "경영",
    tagline: "운영 구조와 수익성 개선",
    icon: "LineChart",
    keywords: ["경영", "운영", "수익성", "KPI", "전략", "프로세스", "원가"],
  },
];

/** 카테고리별 아이콘 톤 — 화면이 파랑/청록 일변도가 되지 않도록 */
export const CATEGORY_TONE: Record<string, { tile: string; hover: string }> = {
  startup: { tile: "bg-teal-50 text-teal-700", hover: "group-hover:bg-teal-600" },
  marketing: { tile: "bg-rose-50 text-rose-600", hover: "group-hover:bg-rose-500" },
  investment: { tile: "bg-gold-100 text-gold-600", hover: "group-hover:bg-gold-500" },
  tax: { tile: "bg-sky-100 text-sky-600", hover: "group-hover:bg-sky-600" },
  legal: { tile: "bg-indigo-50 text-indigo-600", hover: "group-hover:bg-indigo-600" },
  career: { tile: "bg-emerald-50 text-emerald-600", hover: "group-hover:bg-emerald-600" },
  hr: { tile: "bg-violet-50 text-violet-600", hover: "group-hover:bg-violet-600" },
  design: { tile: "bg-orange-50 text-orange-600", hover: "group-hover:bg-orange-500" },
  it: { tile: "bg-cyan-50 text-cyan-700", hover: "group-hover:bg-cyan-600" },
  management: { tile: "bg-navy-100 text-navy-600", hover: "group-hover:bg-navy-800" },
};

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

/** 홈 인기 카테고리 (8개) */
export const POPULAR_CATEGORY_IDS = [
  "startup",
  "marketing",
  "investment",
  "tax",
  "legal",
  "career",
  "hr",
  "design",
] as const;

export const METHOD_LABEL: Record<ConsultMethod, string> = {
  video: "화상상담",
  phone: "전화상담",
  chat: "채팅상담",
};

export const METHOD_ICON: Record<ConsultMethod, string> = {
  video: "Video",
  phone: "Phone",
  chat: "MessageSquare",
};

export const METHOD_HINT: Record<ConsultMethod, string> = {
  video: "화면 공유로 자료를 함께 보며 진행합니다",
  phone: "이동 중에도 편하게 통화로 진행합니다",
  chat: "텍스트로 기록을 남기며 진행합니다",
};

export const SORT_OPTIONS: SortOption[] = [
  { id: "recommended", label: "추천순" },
  { id: "rating", label: "평점순" },
  { id: "consults", label: "상담 많은 순" },
  { id: "priceAsc", label: "낮은 가격순" },
];

export const LANGUAGES = ["한국어", "영어", "일본어", "중국어"];

export const PRICE_STEPS = [
  { label: "5만원 이하", value: 50000 },
  { label: "8만원 이하", value: 80000 },
  { label: "12만원 이하", value: 120000 },
  { label: "전체", value: 0 },
];

/** 홈 검색창 추천 키워드 */
export const SUGGESTED_KEYWORDS = [
  "사업계획",
  "마케팅",
  "세금",
  "투자",
  "노무",
  "계약",
  "커리어",
];
