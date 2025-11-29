import type { Metadata } from "next";
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
  metadataBase: new URL("https://k-face-reading.com"),
  title: "K-Face Reading | AI 팩트 관상 분석 (Korean Physiognomy)",
  description: "AI가 분석하는 소름돋는 팩트 관상. 당신의 얼굴에 숨겨진 운명과 진실을 마주하세요. 300자 구체적 고민 상담과 냉철한 조언.",
  keywords: ["관상", "AI관상", "얼굴분석", "운세", "사주", "K-Face Reading", "Physiognomy", "Korean Fortune Telling", "팩트폭격"],
  openGraph: {
    title: "K-Face Reading | AI 팩트 관상 분석",
    description: "당신의 얼굴에 쓰여진 잔혹한 진실. 지금 바로 확인하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "K-Face Reading",
    url: "https://k-face-reading.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Face Reading | AI 팩트 관상",
    description: "AI가 분석하는 당신의 운명과 진실.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "K-Face Reading (AI 팩트 관상)",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    },
    "description": "AI가 분석하는 냉철한 팩트 관상 서비스. 얼굴 분석을 통해 운명과 성격을 파악합니다.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "32402"
    }
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
