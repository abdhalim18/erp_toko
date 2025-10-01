'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
};

type Supplier = {
  id: string;
  name: string;
};

export default function NewProductPage() {
  const router = useRouter();
  
  // Data dummy kategori (nanti bisa diganti dengan data dari API)
  const categories: Category[] = [
    { id: '1', name: 'Obat' },
    { id: '2', name: 'Makanan' },
    { id: '3', name: 'Aksesoris' },
    { id: '4', name: 'Perlengkapan' },
  ];

  // Data dummy pemasok (nanti bisa diganti dengan data dari API)
  const suppliers: Supplier[] = [
    { id: '1', name: 'PT Sumber Sehat Abadi' },
    { id: '2', name: 'CV Pet Lovers' },
    { id: '3', name: 'PT Pet Food Indonesia' },
  ];

  const [formData, setFormData] = useState({
    name: '',
    sku: `PRD-${Date.now().toString().slice(-6)}`,
    barcode: '',
    categoryId: '',
    supplierId: '',
    description: '',
    purchasePrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStock: 0,
    unit: 'pcs',
    weight: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBarcode = () => {
    // Generate random barcode (contoh sederhana)
    const randomBarcode = 'BC' + Math.floor(1000000000000 + Math.random() * 9000000000000);
    setFormData(prev => ({
      ...prev,
      barcode: randomBarcode
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.name || !formData.categoryId) {
      setError('Nama produk dan kategori harus diisi');
      return;
    }

    if (formData.sellingPrice < formData.purchasePrice) {
      setError('Harga jual tidak boleh lebih kecil dari harga beli');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulasi API call
      console.log('Mengirim data produk:', formData);
      
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect ke halaman daftar produk setelah berhasil
      router.push('/produk');
    } catch (err) {
      console.error('Gagal menyimpan produk:', err);
      setError('Gagal menyimpan produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/produk">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Tambah Produk Baru</h1>
        </div>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link href="/produk">Batal</Link>
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Produk
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informasi Dasar */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
                <CardDescription>
                  Lengkapi informasi dasar produk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Produk *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Obat Cacing Kucing"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Kode SKU"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="barcode">Barcode</Label>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-sm"
                        onClick={generateBarcode}
                      >
                        Generate
                      </Button>
                    </div>
                    <Input
                      id="barcode"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      placeholder="Kode barcode"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Kategori *</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => handleSelectChange('categoryId', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplierId">Pemasok</Label>
                    <Select
                      value={formData.supplierId}
                      onValueChange={(value) => handleSelectChange('supplierId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Pemasok (opsional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Produk</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Deskripsi lengkap produk"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Harga & Stok */}
            <Card>
              <CardHeader>
                <CardTitle>Harga & Stok</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Harga Beli (IDR)</Label>
                    <Input
                      id="purchasePrice"
                      name="purchasePrice"
                      type="number"
                      min="0"
                      value={formData.purchasePrice}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Harga Jual (IDR) *</Label>
                    <Input
                      id="sellingPrice"
                      name="sellingPrice"
                      type="number"
                      min={formData.purchasePrice}
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stok Awal</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Stok Minimum</Label>
                    <Input
                      id="minStock"
                      name="minStock"
                      type="number"
                      min="0"
                      value={formData.minStock}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit">Satuan</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => handleSelectChange('unit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">PCS</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="pack">Pack</SelectItem>
                        <SelectItem value="kg">Kilogram</SelectItem>
                        <SelectItem value="g">Gram</SelectItem>
                        <SelectItem value="l">Liter</SelectItem>
                        <SelectItem value="ml">Mililiter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gambar Produk & Pengaturan */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gambar Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto max-h-48 object-contain"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 rounded-full bg-white shadow"
                          onClick={() => setImagePreview('')}
                        >
                          <span className="sr-only">Hapus gambar</span>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Upload gambar produk
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, atau GIF (maks. 2MB)
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => document.getElementById('product-image')?.click()}
                        >
                          Pilih Gambar
                        </Button>
                        <input
                          id="product-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Status Produk</Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.isActive ? 'Aktif' : 'Nonaktif'}
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
