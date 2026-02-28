'use client';

import AppClientLayout from './AppClientLayout';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return <AppClientLayout>{children}</AppClientLayout>;
}
