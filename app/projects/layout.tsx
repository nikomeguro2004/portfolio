import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A selection of production projects with scope, implementation details, and delivery outcomes.',
  openGraph: {
    title: 'Projects | S Adityan',
    description: 'A selection of production projects with scope, implementation details, and delivery outcomes.',
    url: 'https://adityan.dev/projects',
  },
  alternates: {
    canonical: 'https://adityan.dev/projects',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
