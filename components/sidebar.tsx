import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  ShoppingBag,
  FileText,
  Layers,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Produk",
    icon: Package,
    href: "/products",
    submenu: [
      { name: "Daftar Produk", href: "/products" },
      { name: "Tambah Produk", href: "/products/new" },
    ],
  },
  {
    name: "Kategori",
    icon: Layers,
    href: "/categories",
  },
  {
    name: "Supplier",
    icon: Users,
    href: "/suppliers",
  },
  {
    name: "Pengguna",
    icon: Users,
    href: "/users",
  },
  {
    name: "Penjualan",
    icon: ShoppingCart,
    href: "/sales",
  },
  {
    name: "Pembelian",
    icon: ShoppingBag,
    href: "/purchases",
  },
  {
    name: "Laporan",
    icon: FileText,
    href: "/reports",
  },
  {
    name: "Batch Produk",
    icon: Layers,
    href: "/batches",
  },
  {
    name: "Pengaturan",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6" />
            <span className="">VetERP</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {menuItems.map((item) => (
              <div key={item.name} className="w-full">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    "group relative flex items-center justify-between"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </div>
                  {item.submenu && (
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </Link>
                {item.submenu && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary"
                      >
                        <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
