/**
 * 미래AI랩 브랜드 상수.
 *
 * 샘플 페이지 하단 공통 CTA(SampleBridgeCTA)가 쓰는 링크와 문구를 한곳에 모았다.
 * 링크나 문구를 바꿀 일이 생기면 이 파일만 수정하면 모든 샘플 페이지에 반영된다.
 */

export const MIRAE_BRAND = {
  /** CTA 본문에서 쓰는 짧은 이름 */
  name: "미래AI랩",
  /** 로고·저작권 등 정식 표기 */
  fullName: "미래에이아이랩",
  latin: "MIRAE AI LAB",
} as const;

/**
 * 이동 링크.
 *
 * 외부 주소(https://...)는 자동으로 새 탭에서 열립니다.
 * 링크를 바꿀 일이 생기면 이 값만 수정하면 모든 샘플 페이지에 반영됩니다.
 */
export const MIRAE_LINKS = {
  /** 상담 요청 — 메인 CTA "우리 회사도 만들어보기" */
  consult: "https://miraeailab.com/business-diagnosis",
  /** 다른 샘플 모아보기 */
  samples: "https://miraeailab.com/business-services",
  /** 미래AI랩 홈페이지 */
  home: "https://miraeailab.com/",
} as const;

/**
 * CTA 문구.
 *
 * 메인 CTA 라벨(`consultLabel`)은 모든 샘플에서 "우리 회사도 만들어보기"로 통일한다.
 */
export const MIRAE_CTA_COPY = {
  badge: MIRAE_BRAND.latin,
  eyebrow: `이 샘플은 ${MIRAE_BRAND.name}이 기획·제작했습니다`,
  headline:
    "이 샘플이 마음에 드셨다면,\n대표님 회사도 이렇게 설계해볼 수 있습니다.",
  description: `${MIRAE_BRAND.name}은 평범한 회사를 기술·데이터·AI 기반의 성장형 기업으로 바꾸는 AX / MVP / 플랫폼 기획·개발을 진행합니다.`,
  consultLabel: "우리 회사도 만들어보기",
  consultHint: "상담은 무료이며, 보통 1영업일 안에 회신드립니다.",
  samplesLabel: "다른 샘플 보기",
  homeLabel: `${MIRAE_BRAND.name} 홈페이지`,
} as const;

/** 외부 링크 여부 — 새 탭 처리에 사용 */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}
