import type { Metadata } from "next";
import { Suspense } from "react";
import { RoomSkeleton } from "@/components/ui/Skeleton";
import { ChatClient } from "@/components/chat/ChatClient";

export const metadata: Metadata = {
  title: "상담방",
};

export default function ChatPage() {
  return (
    <div className="shell py-10 pb-32 sm:py-16 lg:pb-16">
      <Suspense fallback={<RoomSkeleton />}>
        <ChatClient />
      </Suspense>
    </div>
  );
}
