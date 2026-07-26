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
  metadataBase: new URL("https://lrwa-agent-web.openai.site"),
  title: {
    default: "LRWA | Live Real-World Assurance",
    template: "%s | LRWA",
  },
  description:
    "Turn business claims into bounded, auditable real-world verification missions.",
  applicationName: "LRWA",
  keywords: [
    "autonomous agents",
    "commercial diligence",
    "market intelligence",
    "evidence verification",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "LRWA | Live Real-World Assurance",
    description:
      "Test the world behind the spreadsheet with governed verification agents.",
    type: "website",
    siteName: "LRWA",
    images: [
      {
        url: "/og.png",
        width: 1672,
        height: 941,
        alt: "LRWA evidence network across a dark city map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LRWA | Live Real-World Assurance",
    description:
      "Test the world behind the spreadsheet with governed verification agents.",
    images: ["/og.png"],
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} cds--g100`}
      >
        {children}
      </body>
    </html>
  );
}
