import { getDictionary } from "@/lib/dictionary";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ lang: "en" | "ko" | "ja" | "th" }> }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return {
    metadataBase: new URL("https://k-face-reading.com"),
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    keywords: dictionary.metadata.keywords.split(", "),
    alternates: {
      canonical: `https://k-face-reading.com/${lang}`,
      languages: {
        'en': 'https://k-face-reading.com/en',
        'ko': 'https://k-face-reading.com/ko',
        'ja': 'https://k-face-reading.com/ja',
        'th': 'https://k-face-reading.com/th',
        'x-default': 'https://k-face-reading.com',
      },
    },
    openGraph: {
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      type: "website",
      locale: lang === "ko" ? "ko_KR" : lang === "ja" ? "ja_JP" : lang === "th" ? "th_TH" : "en_US",
      siteName: "K-Face Reading",
      url: `https://k-face-reading.com/${lang}`,
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "ko" | "ja" | "th" }>;
}>) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  
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
    "description": dictionary.metadata.description,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "32402"
    }
  };

  return (
    <html lang={lang}>
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
