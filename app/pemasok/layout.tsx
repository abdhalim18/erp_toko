import { ReactNode } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function PemasokLayout({
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
