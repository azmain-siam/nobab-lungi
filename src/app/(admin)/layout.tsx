import { AdminSidebar } from '@/components/layout/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
