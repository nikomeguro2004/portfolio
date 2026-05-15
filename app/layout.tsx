import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope, Sora, Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import AppClientLayout from "./components/AppClientLayout";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body-alt",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sora = Sora({
  variable: "--font-heading-alt",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
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
    icon: '/favicon.svg',
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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${interSans.variable} ${manrope.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} ${sora.variable} antialiased`}
      >
        <AppClientLayout>
          <main className="relative z-10">{children}</main>
        </AppClientLayout>
      </body>
    </html>
  );
}
