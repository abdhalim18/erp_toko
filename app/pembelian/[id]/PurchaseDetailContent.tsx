'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, Calendar } from 'lucide-react';

interface PurchaseDetailContentProps {
  purchase: {
    id: string;
    orderNumber: string;
    supplier: {
      id: string;
      name: string;
    };
    orderDate: string;
    expectedDate?: string;
    receivedDate?: string;
    status: string;
    totalAmount: number;
    items: {
      id: string;
      product: {
        id: string;
        name: string;
        sku: string;
      };
      batch: {
        id: string;
        batchNumber: string;
      } | null;
      quantity: number;
      price: number;
      total: number;
    }[];
    notes?: string;
  };
}

export function PurchaseDetailContent({ purchase }: PurchaseDetailContentProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Detail Pembelian</h1>
            <p className="text-muted-foreground">
              Order #{purchase.orderNumber}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Cetak
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Unduh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Informasi Pemasok</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Nama:</span>{' '}
                  <span className="font-medium">{purchase.supplier.name}</span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Informasi Order</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Tanggal Order:</span>{' '}
                  <span>{new Date(purchase.orderDate).toLocaleDateString('id-ID')}</span>
                </p>
                {purchase.expectedDate && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Tanggal Diterima:</span>{' '}
                    <span>{new Date(purchase.expectedDate).toLocaleDateString('id-ID')}</span>
                  </p>
                )}
                <p className="text-sm">
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <Badge
                    variant={
                      purchase.status === 'COMPLETED'
                        ? 'secondary'
                        : purchase.status === 'CANCELLED'
                        ? 'destructive'
                        : 'outline'
                    }
                  >
                    {purchase.status === 'COMPLETED'
                      ? 'Selesai'
                      : purchase.status === 'CANCELLED'
                      ? 'Dibatalkan'
                      : 'Diproses'}
                  </Badge>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Daftar Produk</h3>
            <div className="border rounded-md">
              <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-5">Produk</div>
                <div className="col-span-2 text-right">Harga Satuan</div>
                <div className="col-span-2 text-center">Kuantitas</div>
                <div className="col-span-3 text-right">Total</div>
              </div>
              <div className="divide-y">
                {purchase.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 p-3 text-sm">
                    <div className="col-span-5">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.product.sku}
                        {item.batch && ` • Batch: ${item.batch.batchNumber}`}
                      </p>
                    </div>
                    <div className="col-span-2 text-right">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(item.price)}
                    </div>
                    <div className="col-span-2 text-center">{item.quantity}</div>
                    <div className="col-span-3 text-right font-medium">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(item.total)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0,
                        }).format(purchase.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0,
                        }).format(purchase.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {purchase.notes && (
            <div>
              <h3 className="font-medium mb-2">Catatan</h3>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-sm whitespace-pre-line">{purchase.notes}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
