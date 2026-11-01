"use client";

import dynamic from "next/dynamic";

// The chat lives entirely in the browser (history is in localStorage), so it
// renders client-side only.
const ChatApp = dynamic(() => import("./ChatApp"), {
  ssr: false,
  loading: () => (
    <div className="grid h-dvh place-items-center bg-bg" role="status">
      <span className="breathe inline-block h-3 w-3 rounded-full bg-primary" />
      <span className="sr-only">Loading…</span>
    </div>
  ),
});

export default function ChatLoader() {
  return <ChatApp />;
}
