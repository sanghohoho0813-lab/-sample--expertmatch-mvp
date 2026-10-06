import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // 예약 진행·마이페이지는 개인화된 화면이라 색인하지 않는다
    rules: { userAgent: "*", allow: "/", disallow: ["/booking/", "/mypage"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
