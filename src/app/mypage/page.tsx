import type { Metadata } from "next";
import { Suspense } from "react";
import { MyPageClient } from "@/components/mypage/MyPageClient";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "예정된 상담과 찜한 전문가, 상담 히스토리를 확인하세요.",
};

export default function MyPage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-10">
          <div className="h-40 animate-pulse rounded-3xl bg-navy-100/70" />
        </div>
      }
    >
      <MyPageClient />
    </Suspense>
  );
}
