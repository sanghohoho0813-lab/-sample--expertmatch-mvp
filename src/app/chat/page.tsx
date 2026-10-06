import type { Metadata } from "next";
import { ChatClient } from "@/components/chat/ChatClient";

export const metadata: Metadata = {
  title: "채팅",
};

export default function ChatPage() {
  return (
    <div className="shell py-10 pb-32 sm:py-16 lg:pb-16">
      <ChatClient />
    </div>
  );
}
