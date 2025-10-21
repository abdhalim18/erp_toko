'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Receipt, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from 'sonner';

interface Sale {
  id: string;
  no_faktur: string;
  nama_pelanggan: string;
  tanggal: string;
  total: number;
  status: 'SELESAI' | 'DRAFT' | 'BATAL';
  created_at: string;
  updated_at: string;
}

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/penjualan');
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data penjualan');
      }
      
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Gagal memuat data penjualan');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredSales = sales.filter(sale => 
    (sale.no_faktur || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.nama_pelanggan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SELESAI':
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary">Draft</Badge>;
      case 'BATAL':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data penjualan...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Daftar Penjualan</h1>
          <p className="text-sm text-muted-foreground">Kelola transaksi penjualan toko Anda</p>
        </div>
        <Button asChild>
          <Link href="/penjualan/baru">
            <Plus className="h-4 w-4 mr-2" />
            Transaksi Baru
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">No. Faktur</th>
                  <th className="text-left p-4 font-medium">Tanggal</th>
                  <th className="text-left p-4 font-medium">Pelanggan</th>
                  <th className="text-right p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <tr key={sale.id} className="border-b hover:bg-muted/50">
                      <td className="p-4 font-medium">
                        <Link 
                          href={`/penjualan/${sale.id}`}
                          className="hover:underline text-blue-600"
                        >
                          {sale.no_faktur}
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(sale.tanggal).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="p-4">{sale.nama_pelanggan}</td>
                      <td className="p-4 text-right font-medium">
                        {formatCurrency(sale.total)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(sale.status)}
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/penjualan/${sale.id}`}>
                            <Receipt className="h-4 w-4" />
                            <span className="sr-only">Lihat Detail</span>
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      {searchTerm ? 'Tidak ada hasil pencarian' : 'Belum ada data penjualan'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
