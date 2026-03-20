'use client';

import dynamic from 'next/dynamic';

const AuthProvider = dynamic(
  () => import('@/context/AuthContext').then((m) => ({ default: m.AuthProvider })),
  { ssr: false, loading: () => null }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
