'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
};

type Batch = {
  id: string;
  batchNumber: string;
};

interface SaleItem {
  id: string;
  product: Product;
  batch: Batch | null;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
  discount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'CANCELLED' | 'REFUNDED';
type OrderStatus = 'DRAFT' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'PARTIALLY_RECEIVED';

interface Sale {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes: string | null;
  userId: string;
  user: User;
  items: SaleItem[];
  createdAt: string;
  updatedAt: string;
}

export default function SaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSale = async () => {
      try {
        console.log('Mengambil data transaksi dengan ID:', params.id);
        const response = await fetch(`/api/sales/${params.id}`);
        
        if (!response.ok) {
          let errorMessage = `Gagal mengambil data transaksi (${response.status} ${response.statusText})`;
          
          try {
            const responseText = await response.text();
            
            // Cek jika responseText kosong atau hanya whitespace
            if (responseText && responseText.trim() !== '') {
              try {
                const responseBody = JSON.parse(responseText);
                console.error('Error response (JSON):', responseBody);
                errorMessage = responseBody.error || responseBody.message || errorMessage;
              } catch (jsonError) {
                // Jika bukan JSON, gunakan teks biasa
                console.error('Error response (text):', responseText);
                errorMessage = responseText || errorMessage;
              }
            } else {
              console.error('Empty response body');
            }
          } catch (readError) {
            console.error('Gagal membaca response body:', readError);
          }
          
          throw new Error(errorMessage);
        }
        
        // Jika response OK, parse body sebagai JSON
        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('Data transaksi berhasil diambil:', data);
          setSale(data);
        } catch (parseError) {
          console.error('Gagal memparses response JSON:', parseError, 'Response text:', responseText);
          throw new Error('Format data transaksi tidak valid');
        }
      } catch (err) {
        console.error('Error saat mengambil data transaksi:', err);
        
        // Menangani error 404 khusus
        if (err instanceof Error && err.message.includes('tidak ditemukan')) {
          setError('Transaksi tidak ditemukan. Pastikan ID transaksi benar atau transaksi sudah dihapus.');
        } else {
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data transaksi');
        }
        
        // Kembali ke halaman daftar penjualan setelah 3 detik
        const timer = setTimeout(() => {
          router.push('/penjualan');
        }, 3000);
        
        return () => clearTimeout(timer);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSale();
    } else {
      setError('ID transaksi tidak valid');
      setLoading(false);
      router.push('/penjualan');
    }
  }, [params.id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-600">Selesai</Badge>;
      case 'PENDING':
        return <Badge variant="outline">Menunggu</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      case 'PARTIALLY_RECEIVED':
        return <Badge className="bg-blue-600">Sebagian Diterima</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-600">Lunas</Badge>;
      case 'PENDING':
        return <Badge variant="outline">Menunggu Pembayaran</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      case 'PARTIALLY_PAID':
        return <Badge className="bg-blue-600">Dibayar Sebagian</Badge>;
      case 'REFUNDED':
        return <Badge className="bg-purple-600">Dikembalikan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data transaksi...</span>
      </div>
    );
  }

  if (error || !sale) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">
          {error || 'Transaksi Tidak Ditemukan'}
        </h2>
        <Button onClick={() => router.push('/penjualan')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Penjualan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Detail Transaksi</h1>
            <p className="text-sm text-muted-foreground">
              No. Invoice: {sale.invoiceNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" />
            Cetak
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Transaksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">No. Invoice</span>
                    <span className="font-medium">{sale.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tanggal</span>
                    <span className="font-medium">
                      {new Date(sale.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kasir</span>
                    <span className="font-medium">{sale.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    {getStatusBadge(sale.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status Pembayaran</span>
                    {getPaymentStatusBadge(sale.paymentStatus)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Pelanggan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nama</span>
                    <span className="font-medium">{sale.customerName}</span>
                  </div>
                  {sale.customerPhone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Telepon</span>
                      <span className="font-medium">{sale.customerPhone}</span>
                    </div>
                  )}
                  {sale.customerEmail && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{sale.customerEmail}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metode Pembayaran</span>
                    <span className="font-medium">{sale.paymentMethod}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="border-t">
              <div className="grid grid-cols-12 gap-4 py-3 px-4 font-medium border-b">
                <div className="col-span-6 md:col-span-6">Produk</div>
                <div className="col-span-2 text-right">Harga Satuan</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-3 text-right">Subtotal</div>
              </div>
              {sale.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 py-3 px-4 border-b">
                  <div className="col-span-6 md:col-span-6">
                    <div className="font-medium">{item.product.name}</div>
                    {item.batch && (
                      <div className="text-sm text-muted-foreground">
                        Batch: {item.batch.batchNumber}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 text-right">{formatCurrency(Number(item.pricePerUnit))}</div>
                  <div className="col-span-1 text-center">{item.quantity}</div>
                  <div className="col-span-3 text-right">
                    <div className="font-medium">{formatCurrency(Number(item.subtotal))}</div>
                    {item.discount > 0 && (
                      <div className="text-sm text-red-600">
                        Diskon: {formatCurrency(Number(item.discount))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="w-40">{formatCurrency(Number(sale.subtotal))}</span>
              </div>
              {sale.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pajak</span>
                  <span className="w-40">{formatCurrency(Number(sale.tax))}</span>
                </div>
              )}
              {sale.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diskon</span>
                  <span className="w-40 text-red-600">-{formatCurrency(Number(sale.discount))}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 font-bold border-t">
                <span>Total</span>
                <span className="w-40 text-lg">{formatCurrency(Number(sale.total))}</span>
              </div>
            </div>
            
            {sale.notes && (
              <div className="mt-4 p-4 bg-muted/50 rounded-md">
                <h4 className="font-medium mb-2">Catatan:</h4>
                <p className="text-sm text-muted-foreground">{sale.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
