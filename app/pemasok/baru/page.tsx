'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSuppliers } from '@/context/SupplierContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewSupplierPage() {
  const router = useRouter();
  const { addSupplier } = useSuppliers();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !isMounted) return;
    
    setIsLoading(true);
    
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Tambahkan supplier baru
      addSupplier({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        productCount: 0 // Default value
      });
      
      // Redirect ke halaman daftar supplier setelah berhasil
      router.push('/pemasok');
    } catch (error) {
      console.error('Gagal menyimpan data:', error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const isFormValid = formData.name && formData.phone && formData.email && formData.address;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/pemasok">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Tambah Supplier Baru</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Supplier</CardTitle>
          <CardDescription>
            Masukkan detail informasi supplier baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Supplier</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama supplier" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Contoh: 081234567890" 
                  required 
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@contoh.com" 
                  required 
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea 
                  id="address" 
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Masukkan alamat lengkap" 
                  rows={3} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">Kota</Label>
                <Input 
                  id="city" 
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Nama kota" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">Kode Pos</Label>
                <Input 
                  id="postalCode" 
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Kode pos" 
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/pemasok')}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Supplier'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
