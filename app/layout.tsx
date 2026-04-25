import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "커먼 웨이브 : COMMON WAVE",
  description: "시민이 주주가 되고, 이웃이 기자가 되는 공동체의 진짜 목소리 - COMMON WAVE",
  keywords: "커먼 웨이브, COMMON WAVE, 독립언론, 지역 뉴스, 시민 기자",
  openGraph: {
    title: "커먼 웨이브 : COMMON WAVE",
    description: "시민이 주주가 되고, 이웃이 기자가 되는 공동체의 진짜 목소리 - COMMON WAVE",
    url: "https://www.commonwave.kr",
    images: [{ url: "https://www.commonwave.kr/og-image.png", width: 1200, height: 630 }],
    siteName: "커먼 웨이브",
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    google: "FafkuE0YBRZtLsqTthBQeQT2wWpk90jfoLvp5OGXhCw",
  },
  other: {
    "naver-site-verification": "b791cfcfeb56042ca8f327c4929200f1ece79f05",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} ${notoSerifKR.variable}`}>
      <body>{children}</body>
    </html>
  );
}
