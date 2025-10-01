"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Tambah Produk Baru</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk</Label>
                <Input id="name" placeholder="Masukkan nama produk" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="Kode SKU" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  title="Pilih Kategori Produk"
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="obat">Obat</option>
                  <option value="makanan">Makanan</option>
                  <option value="aksesoris">Aksesoris</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Harga</Label>
                <Input id="price" type="number" placeholder="Harga" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stok</Label>
                <Input id="stock" type="number" placeholder="Jumlah stok" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Satuan</Label>
                <Input id="unit" placeholder="Contoh: pcs, box, kg" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" placeholder="Deskripsi produk" />
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/products">Batal</Link>
              </Button>
              <Button type="submit">Simpan Produk</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
