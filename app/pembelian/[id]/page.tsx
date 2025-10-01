'use client';

import { notFound, useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { PurchaseDetailContent } from './PurchaseDetailContent';

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface Batch {
  id: string;
  batchNumber: string;
}

interface PurchaseItem {
  id: string;
  product: Product;
  batch: Batch | null;
  quantity: number;
  price: number;
  total: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Purchase {
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
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string | null;
  user: User;
  createdAt: string;
  updatedAt: string;
}

async function fetchPurchase(id: string): Promise<Purchase | null> {
  try {
    const response = await fetch(`/api/purchases/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to fetch purchase:', response.status, response.statusText, errorData);
      return null;
    }

    const data = await response.json();
    return {
      ...data,
      orderDate: new Date(data.orderDate).toISOString(),
      expectedDate: data.expectedDate ? new Date(data.expectedDate).toISOString() : undefined,
      receivedDate: data.receivedDate ? new Date(data.receivedDate).toISOString() : undefined,
    };
  } catch (error) {
    console.error('Error fetching purchase:', error);
    return null;
  }
}

export default function PurchaseDetailPage() {
  const params = useParams();
  const purchaseId = params.id as string;
  const router = useRouter();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!purchaseId) {
      setLoading(false);
      setError('ID pembelian tidak valid');
      return;
    }

    const loadPurchase = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPurchase(purchaseId);
        
        if (!data) {
          setError('Gagal memuat data pembelian');
          toast.error('Gagal memuat data pembelian');
          router.push('/pembelian');
          return;
        }
        
        setPurchase(data);
      } catch (error) {
        console.error('Error loading purchase:', error);
        setError('Terjadi kesalahan saat memuat data pembelian');
      } finally {
        setLoading(false);
      }
    };

    loadPurchase();
  }, [purchaseId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
      </div>
    );
  }

  if (!purchase) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/pembelian">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Detail Pembelian</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Unduh PDF
          </Button>
        </div>
      </div>
      <PurchaseDetailContent purchase={purchase} />
    </div>
  );
}
