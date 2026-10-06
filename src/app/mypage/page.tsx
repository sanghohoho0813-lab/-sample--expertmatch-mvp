import type { Metadata } from "next";
import { Suspense } from "react";
import { MyPageClient } from "@/components/mypage/MyPageClient";
import { MyPageSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "예정된 상담과 찜한 전문가, 상담 히스토리를 확인하세요.",
  robots: { index: false },
};

export default function MyPage() {
  return (
    <Suspense
      fallback={<MyPageSkeleton />}
    >
      <MyPageClient />
    </Suspense>
  );
}
