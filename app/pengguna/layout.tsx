import DashboardLayout from '@/components/DashboardLayout';

export default function PenggunaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
