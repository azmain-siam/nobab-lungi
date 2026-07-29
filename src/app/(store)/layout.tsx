import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#fbf9f8] flex flex-col justify-between">
      <div>
        <Header variant="light" />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
