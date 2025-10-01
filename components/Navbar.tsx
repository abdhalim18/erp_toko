'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Home, Package, ShoppingCart, Users, BarChart2, Settings, LogOut, List, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/beranda', icon: <Home className="h-5 w-5" /> },
  { name: 'Produk', href: '/produk', icon: <Package className="h-5 w-5" /> },
  { name: 'Kategori', href: '/kategori', icon: <List className="h-5 w-5" /> },
  { name: 'Penjualan', href: '/penjualan', icon: <ShoppingCart className="h-5 w-5" /> },
  { name: 'Pembelian', href: '/pembelian', icon: <Package className="h-5 w-5" /> },
  { name: 'Pemasok', href: '/pemasok', icon: <Users className="h-5 w-5" /> },
  { name: 'Laporan', href: '/laporan', icon: <BarChart2 className="h-5 w-5" /> },
  { name: 'Pengguna', href: '/pengguna', icon: <User className="h-5 w-5" /> },
  { name: 'Pengaturan', href: '/pengaturan', icon: <Settings className="h-5 w-5" /> },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="hidden h-full w-64 flex-shrink-0 border-r bg-gradient-to-b from-blue-900 to-blue-800 text-white md:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-blue-700 px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">VetMed ERP</span>
          </Link>
        </div>
        
        {/* Menu Navigasi */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                'hover:bg-blue-700 hover:text-white',
                pathname === item.href 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-blue-100'
              )}
            >
              <span className="flex h-6 w-6 items-center justify-center">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Tombol Logout */}
        <div className="border-t border-blue-700 p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-blue-100 hover:bg-blue-700 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
