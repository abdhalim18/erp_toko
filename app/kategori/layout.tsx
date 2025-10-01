import DashboardLayout from '@/components/DashboardLayout';

export default function KategoriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
