import type { Metadata } from 'next';
import { Inter, Hanken_Grotesk } from 'next/font/google';
import { CartProvider } from '@/context/cart-context';
import { ToastProvider } from '@/providers/toast-provider';
import { CartDrawer } from '@/components/shared/cart-drawer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nabab Lungi — Traditional Bangladeshi Lungi & Saree Store',
  description:
    'Wear Tradition with Pride. Premium handcrafted lungis made with exceptional fabrics, timeless craftsmanship, and modern comfort.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${hankenGrotesk.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-[#fbf9f8] text-[#1b1c1c] font-sans antialiased">
        <ToastProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
