import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://lrwa-agent-web.cheeky-angel-7701.chatgpt.site",
  ),
  title: {
    default: "LRWA | Evidence Operations",
    template: "%s | LRWA",
  },
  description:
    "把商业主张拆成角色、追问和可追溯证据的调查工作流。",
  applicationName: "LRWA",
  keywords: [
    "evidence agents",
    "commercial diligence",
    "market intelligence",
    "evidence verification",
  ],
  icons: {
    icon: [
      {
        url: "/icon.svg?v=lrwa-mark-20260727",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.svg?v=lrwa-mark-20260727",
  },
  openGraph: {
    title: "LRWA | Evidence Operations",
    description:
      "Design role-based evidence missions before drawing a conclusion.",
    type: "website",
    siteName: "LRWA",
    images: [
      {
        url: "/lrwa-cinematic-hero.webp",
        width: 1672,
        height: 941,
        alt: "LRWA evidence network illustrated across a city",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LRWA | Evidence Operations",
    description:
      "Design role-based evidence missions before drawing a conclusion.",
    images: ["/lrwa-cinematic-hero.webp"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b0b0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} cds--g100`}
      >
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        {children}
      </body>
    </html>
  );
}
