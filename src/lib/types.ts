export type CategoryId =
  | "startup"
  | "marketing"
  | "investment"
  | "tax"
  | "legal"
  | "career"
  | "hr"
  | "design"
  | "it"
  | "management";

export type ConsultMethod = "video" | "phone" | "chat";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  /** lucide-react 아이콘 이름 */
  icon: string;
  keywords: string[];
}

export interface ConsultationProduct {
  id: string;
  name: string;
  minutes: number;
  price: number;
  description: string;
  /** 목록/상세에서 대표 상품으로 강조 */
  recommended?: boolean;
}

export interface CareerItem {
  period: string;
  org: string;
  role: string;
  note?: string;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  categories: CategoryId[];
  /** 검색 매칭용 세부 키워드 */
  skills: string[];
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  consultCount: number;
  /** 최저 상담가 (정렬/필터 기준) */
  priceFrom: number;
  methods: ConsultMethod[];
  languages: string[];
  /** false면 오늘부터 7일간은 예약을 받지 않는다 (availability.ts 에서 반영) */
  availableThisWeek: boolean;
  responseMinutes: number;
  headline: string;
  intro: string;
  strengths: string[];
  specialties: { title: string; description: string }[];
  career: CareerItem[];
  products: ConsultationProduct[];
  /** 프로필 사진 경로 (public/experts). 없으면 실루엣 placeholder로 대체된다 */
  photo?: string;
  /** placeholder 그라데이션 시드 (0-5) */
  accent: number;
  badge?: string;
  /** 추천 노출 순위 (낮을수록 상위) */
  featuredRank: number;
}

export interface Review {
  id: string;
  expertId: string;
  author: string;
  rating: number;
  date: string;
  productName: string;
  body: string;
  tags: string[];
}

export interface Booking {
  id: string;
  /** 예약번호 EM-YYYYMMDD-XXXX */
  code: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  expertAccent: number;
  expertPhoto?: string;
  categoryName: string;
  productId: string;
  productName: string;
  minutes: number;
  price: number;
  method: ConsultMethod;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  note: string;
  createdAt: string;
  status: BookingStatus;
  cancelledAt?: string;
  completedAt?: string;
}

export type BookingStatus = "upcoming" | "done" | "cancelled";

/** 사용자가 완료된 상담에 남긴 후기 (데모) */
export interface MyReview {
  id: string;
  bookingId: string;
  expertId: string;
  rating: number;
  body: string;
  productName: string;
  createdAt: string;
}

export interface SortOption {
  id: "recommended" | "rating" | "consults" | "priceAsc";
  label: string;
}

export interface Filters {
  categories: CategoryId[];
  priceMax: number | null;
  ratingMin: number | null;
  methods: ConsultMethod[];
  minYears: number | null;
  availableOnly: boolean;
  languages: string[];
}
