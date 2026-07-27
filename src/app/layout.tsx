import type { Metadata } from 'next';
import { Inter, Hind_Siliguri, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['latin', 'bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${hindSiliguri.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
