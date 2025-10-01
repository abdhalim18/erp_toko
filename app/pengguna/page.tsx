import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, User, Shield, UserCog } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  // Data dummy pengguna
  const users = [
    { 
      id: 1, 
      name: "Admin Utama", 
      email: "admin@vetcare.com",
      role: "admin",
      lastLogin: "2 jam yang lalu",
      status: "active"
    },
    { 
      id: 2, 
      name: "Staff Penjualan", 
      email: "staff@vetcare.com",
      role: "staff",
      lastLogin: "Hari ini, 09:30",
      status: "active"
    },
    { 
      id: 3, 
      name: "Kasir 1", 
      email: "kasir1@vetcare.com",
      role: "cashier",
      lastLogin: "Kemarin, 17:45",
      status: "inactive"
    },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="bg-purple-600">Admin</Badge>;
      case 'staff':
        return <Badge variant="secondary">Staff</Badge>;
      case 'cashier':
        return <Badge variant="outline">Kasir</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge variant="default" className="bg-green-600">Aktif</Badge>
      : <Badge variant="outline">Nonaktif</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        <Button asChild>
          <Link href="/users/new">
            <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Daftar Pengguna</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari pengguna..."
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{user.name}</h3>
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Login terakhir: {user.lastLogin}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(user.status)}
                  <Button variant="outline" size="sm">
                    <UserCog className="h-4 w-4 mr-2" /> Kelola
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
