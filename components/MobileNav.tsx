'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, Users, BarChart2, Settings, List, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { name: 'Beranda', href: '/beranda', icon: <Home className="h-5 w-5" /> },
  { name: 'Produk', href: '/produk', icon: <Package className="h-5 w-5" /> },
  { name: 'Kategori', href: '/kategori', icon: <List className="h-5 w-5" /> },
  { name: 'Penjualan', href: '/penjualan', icon: <ShoppingCart className="h-5 w-5" /> },
  { name: 'Pembelian', href: '/pembelian', icon: <Package className="h-5 w-5" /> },
  { name: 'Pemasok', href: '/pemasok', icon: <Users className="h-5 w-5" /> },
  { name: 'Laporan', href: '/laporan', icon: <BarChart2 className="h-5 w-5" /> },
  { name: 'Pengguna', href: '/pengguna', icon: <User className="h-5 w-5" /> },
  { name: 'Pengaturan', href: '/pengaturan', icon: <Settings className="h-5 w-5" /> },
];

type MobileNavProps = {
  isAdmin?: boolean;
};

export function MobileNav({ isAdmin = false }: MobileNavProps) {
  const pathname = usePathname();
  
  // Filter menu items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!isAdmin && (item.href === '/pengguna' || item.href === '/kategori')) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="grid grid-cols-4 gap-1 p-1">
        {filteredNavItems.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center py-2 text-xs font-medium',
              'transition-colors hover:bg-muted/50',
              pathname === item.href ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <div className="mb-1">{item.icon}</div>
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
      
      {/* Dropdown for more items */}
      {filteredNavItems.length > 4 && (
        <div className="relative">
          <div className="grid grid-cols-4 gap-1 p-1 border-t">
            {filteredNavItems.slice(4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-2 text-xs font-medium',
                  'transition-colors hover:bg-muted/50',
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <div className="mb-1">{item.icon}</div>
                <span className="text-xs">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
