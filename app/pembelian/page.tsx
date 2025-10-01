import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, PackagePlus, Filter, Download, Truck } from "lucide-react";
import Link from "next/link";

export default function PurchasesPage() {
  // Data dummy pembelian
  const purchases = [
    { 
      id: "PUR-001", 
      date: "2023-10-15",
      supplier: "PT Sumber Sehat Abadi",
      items: 5,
      total: 2500000,
      status: "received",
      payment: "Transfer"
    },
    { 
      id: "PUR-002", 
      date: "2023-10-14",
      supplier: "CV Pet Lovers",
      items: 3,
      total: 1800000,
      status: "ordered",
      payment: "Kredit"
    },
    { 
      id: "PUR-003", 
      date: "2023-10-13",
      supplier: "PT Pet Food Indonesia",
      items: 8,
      total: 3500000,
      status: "partial",
      payment: "Transfer"
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return <Badge variant="default" className="bg-green-600">Diterima</Badge>;
      case 'ordered':
        return <Badge variant="secondary">Dipesan</Badge>;
      case 'partial':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Sebagian</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {purchases.map((purchase) => (
              <Link key={purchase.id} href={`/pembelian/${purchase.id}`} className="block hover:bg-muted/50 rounded-lg transition-colors p-2 -m-2">
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Truck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium">{purchase.id}</h3>
                      {getStatusBadge(purchase.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {purchase.supplier}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(purchase.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      • {purchase.items} item{purchase.items > 1 ? 's' : ''} • {purchase.payment}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-semibold">{formatCurrency(purchase.total)}</p>
                  <div className="flex space-x-2 mt-2">
                    <Button variant="outline" size="sm">Cetak</Button>
                  </div>
                </div>
              </Link>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
