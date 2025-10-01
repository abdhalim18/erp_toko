'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Calendar, Package, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSuppliers } from "@/context/SupplierContext";

export default function SupplierHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const { suppliers } = useSuppliers();
  const [isLoading, setIsLoading] = useState(true);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [supplier, setSupplier] = useState<any>(null);

  // Format date to Indonesian locale
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Load supplier and history data
  useEffect(() => {
    const loadData = async () => {
      try {
        const supplierId = parseInt(params.id as string);
        
        if (isNaN(supplierId)) {
          router.push('/pemasok');
          return;
        }
        
        // Find the supplier
        const foundSupplier = suppliers.find(s => s.id === supplierId);
        
        if (!foundSupplier) {
          router.push('/pemasok');
          return;
        }
        
        setSupplier(foundSupplier);
        
        // Simulate loading history data (in a real app, this would be an API call)
        const mockHistory = [
          {
            id: 1,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'pembelian',
            items: [
              { name: 'Royal Canin Kitten 1kg', quantity: 10, price: 150000 },
              { name: 'Whiskas Adult 1.2kg', quantity: 5, price: 90000 }
            ],
            total: 240000,
            status: 'selesai'
          },
          {
            id: 2,
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            type: 'pembelian',
            items: [
              { name: 'Royal Canin Kitten 1kg', quantity: 5, price: 150000 },
              { name: 'Whiskas Adult 1.2kg', quantity: 3, price: 90000 }
            ],
            total: 1020000,
            status: 'selesai'
          }
        ];
        
        setHistoryData(mockHistory);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.id, router, suppliers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/suppliers">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Kembali</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Tidak Ditemukan</h1>
            <p className="text-sm text-muted-foreground">
              Data supplier tidak dapat dimuat
            </p>
          </div>
        </div>
        <div className="border rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Supplier tidak ditemukan</h3>
          <p className="text-muted-foreground mb-4">
            Data supplier yang Anda cari tidak dapat ditemukan atau telah dihapus.
          </p>
          <Button asChild>
            <Link href="/pemasok">Kembali ke Daftar Supplier</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/pemasok">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Riwayat Transaksi</h1>
          <p className="text-sm text-muted-foreground">
            Riwayat transaksi dengan {supplier.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Informasi Supplier</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nama Supplier</p>
                <p className="font-medium">{supplier.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Telepon</p>
                <p className="font-medium">{supplier.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{supplier.email || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="font-medium">
                  {supplier.address ? (
                    `${supplier.address}, ${supplier.city} ${supplier.postalCode}`
                  ) : (
                    '-'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Riwayat Transaksi</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {historyData.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Belum ada riwayat transaksi</h3>
                <p className="text-muted-foreground mt-1">
                  Tidak ada data transaksi yang tercatat untuk supplier ini.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {historyData.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(transaction.date)}</span>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          <span>{transaction.items.length} item</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span className="capitalize px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {transaction.status}
                        </span>
                      </div>
                      <div className="text-lg font-semibold">
                        Rp {new Intl.NumberFormat('id-ID').format(transaction.total)}
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">Detail Produk:</h4>
                      <ul className="space-y-2">
                        {transaction.items.map((item: any, index: number) => (
                          <li key={index} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span className="text-muted-foreground">
                              {item.quantity} x Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
