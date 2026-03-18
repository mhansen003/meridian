import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meridian — Where strategy meets observation.',
  description: 'Meridian closes the loop between executive strategy and frontline execution — capturing observation from the ground up and translating strategy from the top down.',
  keywords: 'organizational intelligence, strategy execution, employee observations, leadership',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0f1117] text-white min-h-screen`}>
        <Navigation />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
