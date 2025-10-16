import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import SessionProvider from "@/components/providers/SessionProvider";

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
    default: "BlogSite - Your Source for Quality Content",
    template: "%s | BlogSite"
  },
  description: "Discover insightful articles, tutorials, and industry insights on our modern blogging platform.",
  keywords: ["blog", "articles", "tutorials", "technology", "programming", "web development"],
  authors: [{ name: "BlogSite Team" }],
  creator: "BlogSite",
  publisher: "BlogSite",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'BlogSite - Your Source for Quality Content',
    description: 'Discover insightful articles, tutorials, and industry insights on our modern blogging platform.',
    siteName: 'BlogSite',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlogSite - Your Source for Quality Content',
    description: 'Discover insightful articles, tutorials, and industry insights on our modern blogging platform.',
    creator: '@blogsite',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <SessionProvider>
          <Layout>
            {children}
          </Layout>
        </SessionProvider>
      </body>
    </html>
  );
}
