/**
 * 기본 보안 헤더.
 * - 미래에이아이랩 사이트의 샘플 미리보기(iframe)에 들어가야 하므로 X-Frame-Options 는 두지 않는다.
 * - 인라인 폰트 로더·Next 런타임 스크립트 때문에 CSP 도 두지 않는다.
 * @type {{ key: string; value: string }[]}
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
