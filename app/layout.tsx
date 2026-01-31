import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: '#0B0F14',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://adityan.dev'),
  title: {
    default: "S Adityan | Full-Stack Engineer & AI Developer",
    template: "%s | S Adityan"
  },
  description: "Full-Stack Engineer specializing in AI systems, cloud architecture, and scalable web applications. Expertise in Python, TypeScript, React, Next.js, AWS, and Machine Learning.",
  keywords: [
    "Full Stack Developer",
    "Software Engineer",
    "AI Engineer",
    "Machine Learning Developer",
    "React Developer",
    "Next.js Developer",
    "Python Developer",
    "TypeScript Developer",
    "AWS Solutions",
    "Cloud Architecture",
    "Web Development",
    "LLM Development",
    "RAG Systems",
    "DevOps Engineer"
  ],
  authors: [{ name: "S Adityan", url: "https://github.com/nikomeguro2004" }],
  creator: "S Adityan",
  publisher: "S Adityan",
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'S Adityan Portfolio',
    title: 'S Adityan | Full-Stack Engineer & AI Developer',
    description: 'Full-Stack Engineer specializing in AI systems, cloud architecture, and scalable web applications.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'S Adityan - Full-Stack Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S Adityan | Full-Stack Engineer & AI Developer',
    description: 'Full-Stack Engineer specializing in AI systems, cloud architecture, and scalable web applications.',
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          <div className="grid-bg" />
          <main className="relative z-10">{children}</main>
        </ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
