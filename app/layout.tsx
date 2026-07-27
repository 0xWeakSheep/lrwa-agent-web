import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/components/locale-provider";
import { chooseLocale, localeHtmlLang } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n-server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const description = chooseLocale(
    locale,
    "Turn commercial claims into role-based, multi-stage, traceable evidence missions.",
    "把商业主张拆成角色、追问和可追溯证据的调查工作流。",
  );

  return {
    metadataBase: new URL(
      "https://lrwa-agent-web.cheeky-angel-7701.chatgpt.site",
    ),
    title: {
      default: "LRWA | Evidence Operations",
      template: "%s | LRWA",
    },
    description,
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
      description,
      type: "website",
      siteName: "LRWA",
      images: [
        {
          url: "/lrwa-cinematic-hero.webp",
          width: 1672,
          height: 941,
          alt: chooseLocale(
            locale,
            "LRWA evidence network illustrated across a city",
            "LRWA 城市证据网络概念插画",
          ),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "LRWA | Evidence Operations",
      description,
      images: ["/lrwa-cinematic-hero.webp"],
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b0b0b",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={localeHtmlLang(locale)}>
      <body className={`${geistSans.variable} ${geistMono.variable} cds--g100`}>
        <LocaleProvider initialLocale={locale}>
          <a className="skip-link" href="#main-content">
            {chooseLocale(locale, "Skip to main content", "跳到主要内容")}
          </a>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
