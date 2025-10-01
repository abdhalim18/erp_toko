import { ReactNode } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function LaporanLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout>
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </DashboardLayout>
  );
}
