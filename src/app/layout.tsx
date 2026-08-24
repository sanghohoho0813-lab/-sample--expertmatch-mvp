import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { CompareBar } from "@/components/compare/CompareBar";
import { Toaster } from "@/components/ui/Toaster";
import { AppStoreProvider } from "@/lib/store/AppStore";

export const metadata: Metadata = {
  title: {
    default: "(sample) ExpertMatch — 전문가 상담·매칭 플랫폼",
    template: "%s | (sample) ExpertMatch",
  },
  description:
    "당신의 고민, 전문가의 경험으로 해결하세요. 창업·마케팅·투자·세무·법률 등 검증된 전문가에게 필요한 순간 바로 상담을 예약하세요.",
};

export const viewport: Viewport = {
  themeColor: "#0B1A33",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <AppStoreProvider>
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Suspense fallback={null}>
            <MobileTabBar />
          </Suspense>
          <CompareBar />
          <Toaster />
        </AppStoreProvider>
      </body>
    </html>
  );
}
