'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Receipt, Filter, Download } from "lucide-react";
import Link from "next/link";

export default function SalesPage() {
  const router = useRouter();
  
  // Data dummy penjualan
  const [sales] = useState([
    { 
      id: "INV-001", 
      date: "2023-10-15",
      customer: "Pelanggan Umum",
      items: 3,
      total: 450000,
      status: "completed",
      payment: "Tunai"
    },
    { 
      id: "INV-002", 
      date: "2023-10-14",
      customer: "Budi Santoso",
      items: 5,
      total: 1200000,
      status: "completed",
      payment: "Transfer Bank"
    },
    { 
      id: "INV-003", 
      date: "2023-10-14",
      customer: "Siti Aminah",
      items: 2,
      total: 350000,
      status: "pending",
      payment: "QRIS"
    },
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Selesai</Badge>;
      case 'pending':
        return <Badge variant="outline">Menunggu</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Daftar Penjualan</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/penjualan/baru">
              <Plus className="mr-2 h-4 w-4" /> Transaksi Baru
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Riwayat Transaksi</CardTitle>
              <CardDescription>Daftar transaksi penjualan terbaru</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari transaksi..."
                className="pl-9 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sales.map((sale) => (
              <div key={sale.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4 sm:gap-0">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Receipt className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{sale.id}</h3>
                      {getStatusBadge(sale.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {sale.customer} • {sale.date}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {sale.items} item • {sale.payment}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-semibold">{formatCurrency(sale.total)}</p>
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/penjualan/${sale.id}`)}
                    >
                      Detail
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.print()}
                    >
                      Cetak
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
