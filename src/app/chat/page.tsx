import type { Metadata } from "next";
import { Suspense } from "react";
import { ChatClient } from "@/components/chat/ChatClient";

export const metadata: Metadata = {
  title: "상담방",
};

export default function ChatPage() {
  return (
    <div className="shell py-10 pb-32 sm:py-16 lg:pb-16">
      <Suspense fallback={<div className="mx-auto h-72 max-w-2xl animate-pulse rounded-3xl bg-navy-100/70" />}>
        <ChatClient />
      </Suspense>
    </div>
  );
}
