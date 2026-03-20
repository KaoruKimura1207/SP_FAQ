import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/ClientProviders';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'SP FAQ',
  description: 'FAQ Chatbot',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geist.variable} h-full`}>
      <body className="h-full font-sans">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
