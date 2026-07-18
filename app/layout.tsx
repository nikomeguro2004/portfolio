import type { Metadata, Viewport } from "next";
import { Syne, Epilogue, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AppClientLayout from "./components/AppClientLayout";
import { cn } from "@/lib/utils";

const syne = Syne({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const epilogue = Epilogue({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://adityan.dev/#person",
      "name": "S Adityan",
      "alternateName": ["Adityan Suresh", "S. Adityan"],
      "url": "https://adityan.dev",
      "image": "https://adityan.dev/og-image.png",
      "jobTitle": "Full-Stack Engineer & AI Developer",
      "description": "Full-Stack Engineer with 9+ shipped products across startup, SaaS, and AI domains. Specialises in React, Next.js, TypeScript, Python, AWS, and LLM pipelines.",
      "email": "adihere2000@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Chennai",
        "addressRegion": "Tamil Nadu",
        "addressCountry": "IN"
      },
      "knowsAbout": [
        "Full-Stack Web Development",
        "React", "Next.js", "TypeScript", "Node.js", "NestJS",
        "Python", "FastAPI", "AWS", "Supabase", "PostgreSQL",
        "Docker", "CI/CD", "LLM Integration", "RAG Systems",
        "Prompt Engineering", "Hugging Face", "Ollama",
        "Razorpay", "Stripe", "Flutter", "Framer Motion"
      ],
      "sameAs": [
        "https://github.com/nikomeguro2004",
        "https://linkedin.com/in/adityan-suresh",
        "https://calendly.com/adihere2000/30min"
      ],
      "makesOffer": [
        {
          "@type": "Offer",
          "name": "Full-Stack Development",
          "description": "End-to-end web application development with React, Next.js, Node.js, and cloud infrastructure."
        },
        {
          "@type": "Offer",
          "name": "AI & LLM Engineering",
          "description": "RAG systems, LLM integration, vector search, and ML inference pipelines for production products."
        },
        {
          "@type": "Offer",
          "name": "Cloud Architecture & DevOps",
          "description": "Scalable AWS solutions, Docker, CI/CD pipelines, and reliability engineering."
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://adityan.dev/#website",
      "url": "https://adityan.dev",
      "name": "S Adityan — Full-Stack & AI Engineer",
      "description": "Portfolio of S Adityan — 9+ shipped products, React, Next.js, Python, AWS, LLMs.",
      "author": { "@id": "https://adityan.dev/#person" },
      "inLanguage": "en-US",
      "potentialAction": {
        "@type": "ReadAction",
        "target": "https://adityan.dev"
      }
    },
    {
      "@type": "ProfilePage",
      "@id": "https://adityan.dev/#page",
      "url": "https://adityan.dev",
      "name": "S Adityan | Full-Stack Engineer & AI Developer",
      "isPartOf": { "@id": "https://adityan.dev/#website" },
      "about": { "@id": "https://adityan.dev/#person" },
      "dateModified": "2026-06-01"
    }
  ]
};

export const viewport: Viewport = {
  themeColor: '#FF4F1A',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://adityan.dev'),

  title: {
    default: "S Adityan | Full-Stack & AI Engineer — Chennai",
    template: "%s | S Adityan"
  },
  description: "S Adityan — Full-Stack Engineer with 9+ shipped products across startup, SaaS, and AI domains. Expert in React, Next.js, TypeScript, Python, AWS, and LLM pipelines. Based in Chennai, available globally.",

  keywords: [
    // Core identity
    "S Adityan", "Adityan Suresh", "Adityan Full Stack Developer",
    // Role
    "Full Stack Developer", "Full Stack Engineer", "Software Engineer",
    "AI Engineer", "Machine Learning Engineer", "LLM Developer",
    "RAG Developer", "Backend Engineer", "Frontend Engineer",
    // Stack
    "React Developer", "Next.js Developer", "TypeScript Developer",
    "Node.js Developer", "Python Developer", "NestJS Developer",
    "FastAPI Developer", "Flutter Developer", "Supabase Developer",
    // Cloud
    "AWS Developer", "AWS Solutions", "Cloud Architecture",
    "Docker", "CI/CD Engineer", "DevOps Engineer",
    // AI/ML
    "LLM Integration", "RAG Systems", "Prompt Engineering",
    "Hugging Face", "Ollama", "OpenAI Developer",
    "AI Product Engineer",
    // Commerce
    "Razorpay Integration", "Stripe Integration",
    // Location
    "Chennai Developer", "Tamil Nadu Developer", "India Developer",
    "Remote Developer India", "Freelance Developer India",
    "Full Stack Developer Chennai", "Freelance Full Stack Developer",
    "Independent Web Developer",
    // Hiring intent
    "Hire Full Stack Developer", "Hire React Developer India",
    "Full Stack Developer Portfolio", "Developer Portfolio",
    "Software Engineer Portfolio",
  ],

  authors: [
    { name: "S Adityan", url: "https://github.com/nikomeguro2004" }
  ],
  creator: "S Adityan",
  publisher: "S Adityan",

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

  openGraph: {
    type: 'profile',
    firstName: 'S',
    lastName: 'Adityan',
    username: 'nikomeguro2004',
    locale: 'en_US',
    siteName: 'S Adityan Portfolio',
    title: 'S Adityan | Full-Stack & AI Engineer',
    description: '9+ shipped products. React, Next.js, TypeScript, Python, AWS, LLMs. If it has a deadline and a stack, I ship it.',
    url: 'https://adityan.dev',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'S Adityan — Full-Stack Engineer & AI Developer',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'S Adityan | Full-Stack & AI Engineer',
    description: '9+ shipped products. React, Next.js, Python, AWS, LLMs. Based in Chennai.',
    images: ['/og-image.png'],
    creator: '@adityandev',
  },

  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '48x48' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },

  manifest: '/site.webmanifest',

  alternates: {
    canonical: 'https://adityan.dev',
    languages: { 'en-US': 'https://adityan.dev' },
  },

  category: 'technology',

  other: {
    'geo.region': 'IN-TN',
    'geo.placename': 'Chennai',
    'geo.position': '13.0827;80.2707',
    'ICBM': '13.0827, 80.2707',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(syne.variable, epilogue.variable, jetbrainsMono.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <AppClientLayout>
          <main className="relative z-10">{children}</main>
        </AppClientLayout>
      </body>
    </html>
  );
}
