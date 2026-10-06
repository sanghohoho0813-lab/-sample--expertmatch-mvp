import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MiraeTopBar } from "@/components/brand/MiraeTopBar";
import { SampleBridgeSlot } from "@/components/brand/SampleBridgeSlot";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { CompareBar } from "@/components/compare/CompareBar";
import { Toaster } from "@/components/ui/Toaster";
import { AppStoreProvider } from "@/lib/store/AppStore";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "(sample) ExpertMatch — 전문가 상담·매칭 플랫폼 | 미래에이아이랩",
    template: "%s | (sample) ExpertMatch · 미래에이아이랩",
  },
  description:
    "당신의 고민, 전문가의 경험으로 해결하세요. 창업·마케팅·투자·세무·법률 등 검증된 전문가에게 필요한 순간 바로 상담을 예약하세요. 미래에이아이랩(MIRAE AI LAB)이 제작한 서비스 레퍼런스 데모입니다.",
  applicationName: "(sample) ExpertMatch",
  authors: [{ name: "미래에이아이랩 (MIRAE AI LAB)" }],
  creator: "미래에이아이랩",
  publisher: "미래에이아이랩",
  openGraph: {
    title: "(sample) ExpertMatch — 전문가 상담·매칭 플랫폼",
    description: "미래에이아이랩이 제작한 전문가 매칭 서비스 레퍼런스 데모",
    siteName: "(sample) ExpertMatch · 미래에이아이랩",
    locale: "ko_KR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const PRETENDARD_HREF =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

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
        {/*
          Pretendard는 렌더를 막지 않도록 비동기로 불러온다.
          로드 전/실패 시에는 시스템 한글 폰트 스택으로 정상 표시된다.
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          id="font-pretendard"
          rel="stylesheet"
          media="print"
          href={PRETENDARD_HREF}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var f=document.getElementById('font-pretendard');if(f){f.media='all'}",
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link rel="stylesheet" href={PRETENDARD_HREF} />
        </noscript>
      </head>
      <body>
        {/* 미래AI랩 데모 공용 뒤로·앞으로 버튼 */}
        <Script src="/mirae-history-nav.js" strategy="beforeInteractive" />
        <AppStoreProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-navy-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
          >
            본문으로 건너뛰기
          </a>
          <div className="flex min-h-dvh flex-col">
            <MiraeTopBar />
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SampleBridgeSlot />
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
