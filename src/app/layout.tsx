import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import JsonLd from "@/components/seo/JsonLd";
import { generateStructuredData } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "10xNews - Breaking Tech News & Insights",
    template: "%s | 10xNews"
  },
  description: "Stay ahead with 10xNews - Your premier source for breaking tech news, startup insights, Pakistan news, and industry analysis that matters. Get the latest updates on technology, business, politics, and more.",
  keywords: [
    "tech news", "startup news", "technology", "innovation", "breaking news", 
    "tech insights", "industry analysis", "Pakistan news", "politics", "economy", 
    "sports", "culture", "business news", "AI news", "startup updates"
  ],
  authors: [{ name: "10xNews Team" }],
  creator: "10xNews",
  publisher: "10xNews",
  applicationName: "10xNews",
  category: "News & Media",
  classification: "Technology News",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: '10xNews - Breaking Tech News & Insights',
    description: 'Stay ahead with 10xNews - Your premier source for breaking tech news, startup insights, Pakistan news, and industry analysis that matters.',
    siteName: '10xNews',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '10xNews - Breaking Tech News & Insights',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '10xNews - Breaking Tech News & Insights',
    description: 'Stay ahead with 10xNews - Your premier source for breaking tech news, startup insights, Pakistan news, and industry analysis that matters.',
    creator: '@10xnews',
    site: '@10xnews',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  other: {
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd data={generateStructuredData('website', {})} />
        <JsonLd data={generateStructuredData('organization', {})} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <AdminAuthProvider>
              <Layout>
                {children}
              </Layout>
            </AdminAuthProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
