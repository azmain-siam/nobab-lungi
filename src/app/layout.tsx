import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Nobab Lungi — Premium Bangladeshi Lungi & Saree',
    template: '%s | Nobab Lungi',
  },
  description:
    'Bangladesh\'s finest lungi and saree store. Shop premium cotton, handloom, Jamdani, and export-quality products. Fast delivery across Bangladesh.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  ),
  openGraph: {
    siteName: 'Nobab Lungi',
    type: 'website',
    locale: 'bn_BD',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
