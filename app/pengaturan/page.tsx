'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Store, Users, Package, Tag, Ruler, UserCircle, KeyRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function SettingsPage() {
  const pathname = usePathname();
  
  const settingsMenu = [
    {
      title: "Pengaturan Toko",
      href: "/pengaturan/toko",
      icon: <Store className="h-5 w-5" />,
      description: "Kelola informasi toko, alamat, dan kontak"
    },
    {
      title: "Kategori Produk",
      href: "/pengaturan/kategori",
      icon: <Tag className="h-5 w-5" />,
      description: "Kelola kategori produk"
    },
    {
      title: "Satuan Produk",
      href: "/pengaturan/satuan",
      icon: <Ruler className="h-5 w-5" />,
      description: "Kelola satuan produk (pcs, kg, liter, dll)"
    },
    {
      title: "Profil Akun",
      href: "/pengaturan/profil",
      icon: <UserCircle className="h-5 w-5" />,
      description: "Kelola profil akun Anda"
    },
    {
      title: "Keamanan",
      href: "/pengaturan/keamanan",
      icon: <KeyRound className="h-5 w-5" />,
      description: "Kelola kata sandi dan keamanan akun"
    }
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
          <p className="text-sm text-muted-foreground">
            Kelola pengaturan toko dan akun Anda
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsMenu.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="h-full hover:bg-accent/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {item.icon}
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="pt-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
