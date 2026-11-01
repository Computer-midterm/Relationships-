import type { Metadata } from "next";
import ChatLoader from "@/components/chat/ChatLoader";

export const metadata: Metadata = {
  title: "Coach",
  robots: { index: false },
};

export default function ChatPage() {
  return (
    <div id="main">
      <ChatLoader />
    </div>
  );
}
