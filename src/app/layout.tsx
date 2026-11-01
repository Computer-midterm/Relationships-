import type { Metadata, Viewport } from "next";
import { QuickExitListener } from "@/components/QuickExit";
import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Common Ground — a private AI relationship coach",
    template: "%s · Common Ground",
  },
  description:
    "Talk it through before you talk it out. A free, private AI relationship coach that's fair, not flattering. No signup — your chats stay on your device.",
  applicationName: "Common Ground",
  openGraph: {
    title: "Common Ground — a private AI relationship coach",
    description: "Talk it through before you talk it out. Free, no signup, fair — not flattering.",
    type: "website",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6f1" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1a1f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lift">
          Skip to content
        </a>
        <QuickExitListener />
        {children}
      </body>
    </html>
  );
}
