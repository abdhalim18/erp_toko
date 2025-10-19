'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, PackagePlus, Filter, Download, Truck, Loader2 } from "lucide-react";
import Link from "next/link";

interface Purchase {
  id: string;
  no_faktur: string;
  nama_pemasok: string;
  tanggal: string;
  total: number;
  status: string;
  created_at: string;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch('/api/pembelian');
        if (!response.ok) {
          throw new Error('Gagal memuat data pembelian');
        }
        const data = await response.json();
        setPurchases(data);
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'diterima':
      case 'selesai':
        return <Badge variant="default" className="bg-green-600">Diterima</Badge>;
      case 'dipesan':
      case 'diproses':
        return <Badge variant="secondary">Dipesan</Badge>;
      case 'sebagian':
      case 'diterima sebagian':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Sebagian</Badge>;
      case 'dibatalkan':
      case 'batal':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredPurchases = purchases.filter(purchase => 
    purchase.no_faktur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.nama_pemasok.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Pembelian</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button asChild>
            <Link href="/pembelian/baru">
              <PackagePlus className="mr-2 h-4 w-4" /> Pembelian Baru
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Daftar Pembelian</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari pembelian..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Memuat data pembelian...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Gagal memuat data pembelian</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </Button>
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada data pembelian</p>
              <Button asChild className="mt-4">
                <Link href="/pembelian/baru">
                  <PackagePlus className="mr-2 h-4 w-4" /> Buat Pembelian Baru
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPurchases.map((purchase) => (
                <Link 
                  key={purchase.id} 
                  href={`/pembelian/${purchase.id}`} 
                  className="block hover:bg-muted/50 rounded-lg transition-colors p-2 -m-2"
                >
                  <div className="flex items-start sm:items-center space-x-4">
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <p className="font-medium truncate">{purchase.no_faktur}</p>
                        <div className="hidden sm:block">•</div>
                        <p className="text-sm text-muted-foreground truncate">
                          {purchase.nama_pemasok || 'Tanpa Pemasok'}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(purchase.tanggal || purchase.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-medium">{formatCurrency(purchase.total || 0)}</p>
                      <div className="mt-1">
                        {getStatusBadge(purchase.status || 'diproses')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
