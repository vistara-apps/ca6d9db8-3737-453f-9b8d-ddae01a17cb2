import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Energy Flow - Sync your energy, master your day',
  description: 'A Base MiniApp that suggests real-time micro-habits aligned with your energy levels',
  openGraph: {
    title: 'Energy Flow',
    description: 'Sync your energy, master your day with micro-habits',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
