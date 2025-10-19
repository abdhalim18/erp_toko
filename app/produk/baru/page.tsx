'use client';

import { useState, useEffect } from 'react';
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
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Category = {
  id: string;
  name: string;
};

type Supplier = {
  id: string;
  name: string;
};

type FormData = {
  name: string;
  sku: string;
  barcode: string;
  categoryId: string;
  supplierId: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  weight: number;
  isActive: boolean;
};

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string>('');
  
  // Supplier states
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState<boolean>(true);
  const [suppliersError, setSuppliersError] = useState<string>('');
  
  const [formData, setFormData] = useState<FormData>({
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

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Fetching categories from /api/kategori...');
        
        const response = await fetch('/api/kategori', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store', // Prevent caching
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
            console.error('Error response from API:', errorData);
          } catch (e) {
            console.error('Failed to parse error response:', e);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const errorMessage = errorData?.error || 'Gagal mengambil data kategori';
          const errorDetails = errorData?.details ? ` (${errorData.details})` : '';
          throw new Error(`${errorMessage}${errorDetails}`);
        }
        
        const responseData = await response.json();
        console.log('Categories API response:', responseData);
        
        // Ensure we have an array of categories
        const categoriesArray = Array.isArray(responseData) ? responseData : [];
        
        if (categoriesArray.length === 0) {
          console.warn('No categories found in the response');
        } else {
          console.log(`Successfully loaded ${categoriesArray.length} categories`);
        }
        
        setCategories(categoriesArray);
      } catch (error) {
        console.error('Error in fetchCategories:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString()
        });
        setError('Gagal memuat data kategori. Silakan periksa koneksi database dan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch suppliers from API
    const fetchSuppliers = async () => {
      try {
        setLoadingSuppliers(true);
        console.log('Fetching suppliers from API...');
        
        const response = await fetch('/api/pemasok', {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Supplier error response:', errorText);
          throw new Error(`Gagal mengambil data pemasok: ${response.status} ${response.statusText}`);
        }
        
        const suppliersData = await response.json();
        console.log('Suppliers data received:', suppliersData);
        
        // Handle both array response and { data: [] } response formats
        const suppliersArray = Array.isArray(suppliersData) 
          ? suppliersData 
          : Array.isArray(suppliersData?.data) 
            ? suppliersData.data 
            : [];
            
        console.log('Processed suppliers:', suppliersArray);
        
        if (suppliersArray.length === 0) {
          console.warn('No suppliers found or empty suppliers array');
          setSuppliersError('Tidak ada pemasok tersedia. Silakan buat pemasok terlebih dahulu.');
        }
        
        setSuppliers(suppliersArray);
      } catch (error) {
        console.error('Error in fetchSuppliers:', error);
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
        setSuppliersError('Gagal memuat data pemasok. ' + errorMessage);
        toast.error('Gagal memuat pemasok', {
          description: errorMessage,
        });
      } finally {
        setLoadingSuppliers(false);
      }
    };

    // Fetch both categories and suppliers in parallel
    Promise.all([fetchCategories(), fetchSuppliers()])
      .catch(error => {
        console.error('Error in parallel fetching:', error);
      });
    
    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, []);

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

    if (!formData.supplierId) {
      setError('Pemasok harus dipilih');
      return;
    }

    if (Number(formData.sellingPrice) < Number(formData.purchasePrice)) {
      setError('Harga jual tidak boleh lebih kecil dari harga beli');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Mengirim data produk:', formData);
      
      const response = await fetch('/api/produk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          sku: formData.sku,
          description: formData.description,
          purchasePrice: formData.purchasePrice,
          sellingPrice: formData.sellingPrice,
          categoryId: formData.categoryId,
          supplierId: formData.supplierId,
          barcode: formData.barcode || null,
          unit: formData.unit,
          minStock: formData.minStock
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        
        let errorMessage = 'Gagal menyimpan produk';
        if (errorData.error) {
          errorMessage = errorData.error;
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`;
          }
        } else if (response.status === 400) {
          errorMessage = 'Permintaan tidak valid. Silakan periksa data yang Anda masukkan.';
        } else if (response.status === 500) {
          errorMessage = 'Terjadi kesalahan server. Silakan coba lagi nanti.';
        }
        
        throw new Error(errorMessage);
      }
      
      // Show success message and redirect
      console.log('Produk berhasil disimpan');
      router.push('/produk');
      router.refresh(); // Refresh the product list
      
    } catch (err) {
      console.error('Gagal menyimpan produk:', err);
      
      // More user-friendly error messages
      let errorMessage = 'Gagal menyimpan produk. Silakan coba lagi.';
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
        } else if (err.message.includes('JSON')) {
          errorMessage = 'Terjadi kesalahan dalam memproses respons dari server.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
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
                    {loadingCategories ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Memuat kategori...</span>
                      </div>
                    ) : categoriesError ? (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {categoriesError}
                          <Button 
                            variant="link" 
                            className="h-auto p-0 ml-2"
                            onClick={() => window.location.reload()}
                          >
                            Coba Lagi
                          </Button>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => handleSelectChange('categoryId', value)}
                        required
                        disabled={categories.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            categories.length === 0 
                              ? 'Tidak ada kategori tersedia' 
                              : 'Pilih Kategori'
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0 ? (
                            categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground p-2">
                              Tidak ada kategori tersedia. 
                              <Link 
                                href="/kategori/baru" 
                                className="text-primary underline ml-1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  router.push('/kategori/baru');
                                }}
                              >
                                Buat kategori baru
                              </Link>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    )}
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
