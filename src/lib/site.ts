/**
 * 배포 주소. OG 이미지·사이트맵의 절대 경로에 쓰인다.
 * NEXT_PUBLIC_SITE_URL > Vercel 배포 주소 > 로컬 순서로 정한다.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
).replace(/\/$/, "");
