import type { MetadataRoute } from "next";
import { EXPERTS } from "@/lib/data/experts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/experts", "/about"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const experts = EXPERTS.map((e) => ({
    url: `${SITE_URL}/experts/${e.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...pages, ...experts];
}
