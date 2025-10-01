'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft, Save, Loader2 } from "lucide-react";

type Supplier = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
};

type PurchaseItem = {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export default function NewPurchasePage() {
  const router = useRouter();
  
  // Data dummy pemasok
  const suppliers: Supplier[] = [
    { id: '1', name: 'PT Sumber Sehat Abadi' },
    { id: '2', name: 'CV Pet Lovers' },
    { id: '3', name: 'PT Pet Food Indonesia' },
  ];

  // Data dummy produk
  const products: Product[] = [
    { id: '1', name: 'Obat Cacing', sku: 'OBT-001', stock: 100, price: 25000 },
    { id: '2', name: 'Makanan Kucing 1kg', sku: 'MK-001', stock: 50, price: 50000 },
    { id: '3', name: 'Kandang Kecil', sku: 'KDG-001', stock: 20, price: 150000 },
  ];

  const [formData, setFormData] = useState({
    supplierId: '',
    invoiceNumber: `INV-${Date.now()}`,
    purchaseDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  const [items, setItems] = useState<PurchaseItem[]>([
    { productId: '', quantity: 1, price: 0, subtotal: 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Handler functions will be added here
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (value && fieldErrors[name]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[name];
      setFieldErrors(newErrors);
    }
  };

  const handleSupplierChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      supplierId: value
    }));
    
    // Clear supplier error if exists
    if (fieldErrors.supplierId) {
      const newErrors = { ...fieldErrors };
      delete newErrors.supplierId;
      setFieldErrors(newErrors);
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const newItems = [...items];
    const product = products.find(p => p.id === productId);
    
    if (product) {
      newItems[index] = {
        ...newItems[index],
        productId,
        price: product.price,
        subtotal: product.price * newItems[index].quantity
      };
      setItems(newItems);
    }
    
    // Clear product error if exists
    const fieldName = `items[${index}].productId`;
    if (fieldErrors[fieldName]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[fieldName];
      setFieldErrors(newErrors);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (isNaN(quantity) || quantity < 1) return;
    
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      quantity,
      subtotal: newItems[index].price * quantity
    };
    setItems(newItems);
    
    // Clear quantity error if exists
    const fieldName = `items[${index}].quantity`;
    if (fieldErrors[fieldName]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[fieldName];
      setFieldErrors(newErrors);
    }
  };

  const handlePriceChange = (index: number, price: number) => {
    if (isNaN(price) || price < 0) return;
    
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      price,
      subtotal: price * newItems[index].quantity
    };
    setItems(newItems);
    
    // Clear price error if exists
    const fieldName = `items[${index}].price`;
    if (fieldErrors[fieldName]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[fieldName];
      setFieldErrors(newErrors);
    }
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0, subtotal: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate supplier
    if (!formData.supplierId) {
      errors.supplierId = 'Pilih pemasok terlebih dahulu';
    }
    
    // Validate items
    if (items.length === 0) {
      errors.items = 'Tambah minimal satu item pembelian';
    } else {
      items.forEach((item, index) => {
        if (!item.productId) {
          errors[`items[${index}].productId`] = 'Pilih produk';
        }
        if (item.quantity <= 0) {
          errors[`items[${index}].quantity`] = 'Kuantitas harus lebih dari 0';
        }
        if (item.price < 0) {
          errors[`items[${index}].price`] = 'Harga tidak valid';
        }
      });
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      console.log('Submitting purchase data:', { ...formData, items });
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/pembelian');
    } catch (err) {
      console.error('Failed to save purchase:', err);
      setError('Gagal menyimpan pembelian. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Pembelian Baru</h1>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full pb-24">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Supplier Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pemasok</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Pemasok *</Label>
                  <Select 
                    value={formData.supplierId} 
                    onValueChange={handleSupplierChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Pemasok" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldErrors.supplierId && (
                    <p className="text-sm text-red-600 mt-1">{fieldErrors.supplierId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">No. Faktur</Label>
                  <Input 
                    id="invoiceNumber" 
                    name="invoiceNumber" 
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                    placeholder="Masukkan nomor faktur"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Tambahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Tanggal Pembelian</Label>
                    <Input 
                      id="purchaseDate" 
                      type="date" 
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Jatuh Tempo</Label>
                    <Input 
                      id="dueDate" 
                      type="date" 
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      min={formData.purchaseDate}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Catatan tambahan (opsional)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Produk</CardTitle>
                <CardDescription>
                  Tambahkan produk yang dibeli dari pemasok
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Item #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={items.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2 col-span-2 sm:col-span-1">
                          <Label>Produk *</Label>
                          <Select
                            value={item.productId}
                            onValueChange={(value) => handleProductChange(index, value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Produk" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map(product => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} ({product.sku})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {fieldErrors[`items[${index}].productId`] && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors[`items[${index}].productId`]}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Kuantitas *</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(index, Math.max(1, item.quantity - 1))}
                              className="h-9 w-9 shrink-0"
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                              className="text-center"
                              required
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(index, item.quantity + 1)}
                              className="h-9 w-9 shrink-0"
                            >
                              +
                            </Button>
                          </div>
                          {fieldErrors[`items[${index}].quantity`] && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors[`items[${index}].quantity`]}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Harga Satuan (IDR) *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              Rp
                            </span>
                            <Input
                              type="number"
                              min="0"
                              value={item.price}
                              onChange={(e) => handlePriceChange(index, parseFloat(e.target.value) || 0)}
                              className="pl-10"
                              required
                            />
                          </div>
                          {fieldErrors[`items[${index}].price`] && (
                            <p className="text-sm text-red-600 mt-1">{fieldErrors[`items[${index}].price`]}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Subtotal</div>
                          <div className="font-medium">
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Harga</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(calculateTotal())}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2 flex items-center">
              {fieldErrors.items && (
                <p className="text-sm text-red-600">{fieldErrors.items}</p>
              )}
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              disabled={loading}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Tambah Item</span>
              <span className="sm:hidden">Tambah</span>
            </Button>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/pembelian')}
                disabled={loading}
                className="flex-1"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                onClick={handleSubmit}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Menyimpan...</span>
                    <span className="sm:hidden">Simpan</span>
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Simpan Pembelian</span>
                    <span className="sm:hidden">Simpan</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
