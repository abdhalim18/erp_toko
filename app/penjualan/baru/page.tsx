'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Search, ArrowLeft, Loader2, ShoppingCart, User, CreditCard, AlertCircle, Minus, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// Data dummy produk
const products = [
  { id: 1, name: "Royal Canin Kitten 1kg", price: 150000, stock: 50 },
  { id: 2, name: "Whiskas Adult 1.2kg", price: 90000, stock: 30 },
  { id: 3, name: "Pasir Kucing Super 5kg", price: 60000, stock: 20 },
  { id: 4, name: "Kandang Kucing Besar", price: 800000, stock: 5 },
  { id: 5, name: "Tas Carrier Kucing", price: 250000, stock: 8 },
  { id: 6, name: "Tempat Makan Kucing", price: 75000, stock: 15 },
  { id: 7, name: "Kalung Kucing", price: 50000, stock: 25 },
  { id: 8, name: "Mainan Kucing", price: 100000, stock: 12 }
];

// Data dummy pelanggan
const customers = [
  { id: 1, name: "Pelanggan Umum", phone: "-", email: "-" },
  { id: 2, name: "Budi Santoso", phone: "081234567890", email: "budi@example.com" },
  { id: 3, name: "Siti Aminah", phone: "082345678901", email: "siti@example.com" },
  { id: 4, name: "Andi Wijaya", phone: "083456789012", email: "andi@example.com" },
  { id: 5, name: "Dewi Lestari", phone: "084567890123", email: "dewi@example.com" }
];

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export default function NewSalePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState(customers[0].id.toString());
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [searchProduct, setSearchProduct] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Hitung total belanja
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.11; // PPN 11%
  const total = subtotal + tax;

  // Filter produk berdasarkan pencarian
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // Tambah produk ke keranjang
  const addToCart = (product: typeof products[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Jika produk sudah ada di keranjang, tambah jumlahnya
        return prevCart.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price
              }
            : item
        );
      } else {
        // Jika produk belum ada di keranjang, tambahkan produk baru
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          subtotal: product.price
        }];
      }
    });
    setSearchProduct(''); // Reset pencarian setelah menambahkan produk
  };

  // Update jumlah produk di keranjang
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * item.price
            }
          : item
      )
    );
  };

  // Hapus produk dari keranjang
  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Format mata uang
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Validasi form sebelum submit
  const validateForm = () => {
    if (cart.length === 0) {
      toast.error("Tambahkan setidaknya satu produk untuk melanjutkan transaksi");
      return false;
    }
    return true;
  };

  // Simpan transaksi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate ID transaksi acak
      const newTransactionId = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Simpan data transaksi (dalam aplikasi nyata, ini akan mengirim ke API)
      const transactionData = {
        id: newTransactionId,
        date: new Date().toISOString(),
        customerId: parseInt(customer),
        items: cart,
        subtotal,
        tax,
        total,
        payment: paymentMethod,
        notes,
        status: 'completed'
      };

      console.log('Transaksi berhasil:', transactionData);
      
      toast.success(`Transaksi ${newTransactionId} berhasil disimpan`);
      
      // Redirect ke halaman detail transaksi
      router.push(`/penjualan/${newTransactionId}`);
    } catch (error) {
      console.error('Gagal menyimpan transaksi:', error);
      toast.error("Gagal menyimpan transaksi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hitung total item di keranjang
  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Dapatkan nama pelanggan yang dipilih
  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id.toString() === customer) || customers[0];
  }, [customer]);

  // Format metode pembayaran
  const paymentMethodLabel = useMemo(() => {
    switch (paymentMethod) {
      case 'cash': return 'Tunai';
      case 'transfer': return 'Transfer Bank';
      case 'qris': return 'QRIS';
      case 'debit': return 'Kartu Debit';
      case 'credit': return 'Kartu Kredit';
      default: return paymentMethod;
    }
  }, [paymentMethod]);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/penjualan">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Kembali</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Transaksi Baru</h1>
            <p className="text-sm text-muted-foreground">
              Buat transaksi penjualan baru untuk pelanggan
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <span className="font-medium">{totalItems} Item</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="font-bold text-lg">{formatCurrency(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom kiri: Form input */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Informasi Pelanggan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer" className="font-medium">Pelanggan</Label>
                    <Select 
                      value={customer} 
                      onValueChange={setCustomer}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Pilih pelanggan" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem 
                            key={customer.id} 
                            value={customer.id.toString()}
                            className="py-2"
                          >
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-xs text-muted-foreground">{customer.phone}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground mt-1">
                      {selectedCustomer.email}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment" className="font-medium">Metode Pembayaran</Label>
                    <Select 
                      value={paymentMethod} 
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger className="h-11">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Pilih metode pembayaran" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash" className="py-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Tunai</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="transfer" className="py-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Transfer Bank</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="qris" className="py-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>QRIS</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="debit" className="py-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Kartu Debit</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="credit" className="py-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Kartu Kredit</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground mt-1">
                      {paymentMethod === 'cash' 
                        ? 'Pembayaran tunai di tempat' 
                        : paymentMethod === 'transfer'
                          ? 'Transfer ke rekening yang terdaftar'
                          : 'Pembayaran non-tunai'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="font-medium">Ringkasan</Label>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Item</span>
                        <span className="font-medium">{totalItems} item</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">PPN (11%)</span>
                        <span>{formatCurrency(tax)}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span className="text-lg">{formatCurrency(total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span>Daftar Produk</span>
                </CardTitle>
                <CardDescription className="pt-1">
                  Cari dan tambahkan produk ke keranjang
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <div className="relative">
                    <Search className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                      searchFocused ? "text-primary" : "text-muted-foreground"
                    )} />
                    <Input
                      type="search"
                      placeholder="Cari produk berdasarkan nama..."
                      className="pl-9 h-11 text-base"
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                    />
                  </div>
                  {searchProduct && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Menampilkan hasil untuk: <span className="font-medium">{searchProduct}</span>
                    </p>
                  )}
                </div>

                <div className={cn(
                  "border rounded-lg mb-6 transition-all duration-200",
                  searchProduct ? "max-h-80 overflow-y-auto" : "border-transparent"
                )}>
                  {searchProduct ? (
                    filteredProducts.length > 0 ? (
                      filteredProducts.map(product => {
                        const inCart = cart.some(item => item.id === product.id);
                        const cartItem = cart.find(item => item.id === product.id);
                        const availableStock = product.stock - (cartItem?.quantity || 0);
                        
                        return (
                          <div 
                            key={product.id}
                            className={cn(
                              "flex items-center justify-between p-3 border-b transition-colors",
                              availableStock <= 0 ? "opacity-60" : "cursor-pointer hover:bg-muted/30"
                            )}
                            onClick={() => availableStock > 0 && addToCart(product)}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{product.name}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{formatCurrency(product.price)}</span>
                                <span className="text-xs">•</span>
                                <span>Stok: {product.stock}</span>
                                {inCart && (
                                  <>
                                    <span className="text-xs">•</span>
                                    <span className="text-amber-600 font-medium">
                                      {cartItem?.quantity} di keranjang
                                    </span>
                                  </>
                                )}
                              </div>
                              {availableStock <= 0 && (
                                <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                  <AlertCircle className="h-3 w-3" />
                                  <span>Stok tidak mencukupi</span>
                                </div>
                              )}
                            </div>
                            <Button 
                              type="button" 
                              size="sm" 
                              variant={availableStock > 0 ? "default" : "outline"}
                              disabled={availableStock <= 0}
                              className="shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (availableStock > 0) addToCart(product);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              {inCart ? 'Tambah Lagi' : 'Tambah'}
                            </Button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="font-medium">Produk tidak ditemukan</p>
                        <p className="text-sm">Coba kata kunci lain</p>
                      </div>
                    )
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="font-medium">Cari produk</p>
                      <p className="text-sm">Ketik nama produk di atas untuk memulai pencarian</p>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 p-3 font-medium flex items-center justify-between">
                    <h3 className="font-semibold">Keranjang Belanja</h3>
                    <span className="text-sm text-muted-foreground">
                      {cart.length} item
                    </span>
                  </div>
                  
                  {cart.length > 0 ? (
                    <div className="divide-y">
                      {cart.map((item, index) => {
                        const product = products.find(p => p.id === item.id);
                        const availableStock = product ? product.stock : 0;
                        
                        return (
                          <div key={`${item.id}-${index}`} className="grid grid-cols-12 p-4 hover:bg-muted/20 transition-colors">
                            <div className="col-span-12 sm:col-span-6 flex items-start">
                              <div className="min-w-0">
                                <p className="font-medium truncate">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatCurrency(item.price)} per item
                                </p>
                                {item.quantity > availableStock && (
                                  <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                                    <AlertCircle className="h-3 w-3" />
                                    <span>Jumlah melebihi stok tersedia</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="col-span-12 sm:col-span-6 mt-3 sm:mt-0 flex items-center justify-between sm:justify-end sm:gap-6">
                              <div className="flex items-center border rounded-md overflow-hidden h-9">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 rounded-none"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <span className="sr-only">Kurangi</span>
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    updateQuantity(item.id, value);
                                  }}
                                  className="w-16 h-9 text-center border-0 rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 rounded-none"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= availableStock}
                                >
                                  <span className="sr-only">Tambah</span>
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                              
                              <div className="text-right min-w-[100px]">
                                <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-muted-foreground">
                                    {item.quantity} × {formatCurrency(item.price)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="font-medium text-muted-foreground">Keranjang belanja kosong</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Cari dan tambahkan produk ke keranjang
                      </p>
                      {!searchProduct && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => {
                            const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
                            if (searchInput) {
                              searchInput.focus();
                            }
                          }}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Cari Produk
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Catatan Transaksi</CardTitle>
                <CardDescription>
                  Tambahkan catatan untuk transaksi ini (opsional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Contoh: Kemasan rapih, terima kasih"
                  className="min-h-[100px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/penjualan')}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Batalkan
                </Button>
                <Button 
                  type="submit" 
                  className="min-w-[180px]"
                  disabled={cart.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Simpan Transaksi
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Kolom kanan: Ringkasan pembayaran - Dipindahkan ke samping informasi pelanggan */}
          <div className="lg:hidden space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Ringkasan Pembayaran</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Item</span>
                    <span>{totalItems} item</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PPN (11%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Metode Pembayaran
              </h3>
              <div className="flex items-center justify-between bg-background p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>{paymentMethodLabel}</span>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    const paymentSelect = document.querySelector('button[aria-haspopup="listbox"]') as HTMLButtonElement;
                    if (paymentSelect) {
                      paymentSelect.focus();
                      paymentSelect.click();
                    }
                  }}
                >
                  Ubah
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
