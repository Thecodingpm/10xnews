import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

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
  description: "Stay ahead with 10xNews - Your premier source for breaking tech news, startup insights, and industry analysis that matters.",
  keywords: ["tech news", "startup news", "technology", "innovation", "breaking news", "tech insights", "industry analysis"],
  authors: [{ name: "10xNews Team" }],
  creator: "10xNews",
  publisher: "10xNews",
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
    title: '10xNews - Breaking Tech News & Insights',
    description: 'Stay ahead with 10xNews - Your premier source for breaking tech news, startup insights, and industry analysis that matters.',
    siteName: '10xNews',
  },
  twitter: {
    card: 'summary_large_image',
    title: '10xNews - Breaking Tech News & Insights',
    description: 'Stay ahead with 10xNews - Your premier source for breaking tech news, startup insights, and industry analysis that matters.',
    creator: '@10xnews',
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
