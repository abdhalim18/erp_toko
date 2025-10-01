'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save, X } from "lucide-react";
import Link from "next/link";
import { useSuppliers } from "@/context/SupplierContext";
import { toast } from "sonner";

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export default function EditSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const { suppliers, updateSupplier } = useSuppliers();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: ''
  });
  
  const isFormValid = formData.name && formData.phone && formData.email;

  // Load supplier data when component mounts
  useEffect(() => {
    const loadSupplier = async () => {
      try {
        const supplierId = parseInt(params.id as string);
        
        if (isNaN(supplierId)) {
          toast.error('ID supplier tidak valid');
          router.push('/pemasok');
          return;
        }
        
        const supplier = suppliers.find(s => s.id === supplierId);
        
        if (supplier) {
          setFormData({
            name: supplier.name,
            phone: supplier.phone,
            email: supplier.email || '',
            address: supplier.address || '',
            city: supplier.city || '',
            postalCode: supplier.postalCode || ''
          });
        } else {
          toast.error('Supplier tidak ditemukan');
          router.push('/pemasok');
        }
      } catch (error) {
        console.error('Error loading supplier:', error);
        toast.error('Terjadi kesalahan saat memuat data supplier');
        router.push('/suppliers');
      } finally {
        setIsLoading(false);
      }
    };

    loadSupplier();
  }, [params.id, suppliers, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update supplier
      updateSupplier(parseInt(params.id as string), formData);
      
      // Show success message
      toast.success('Data supplier berhasil diperbarui');
      
      // Redirect back to suppliers list
      router.push('/suppliers');
      router.refresh();
    } catch (error) {
      console.error('Gagal memperbarui data:', error);
      toast.error('Terjadi kesalahan saat memperbarui data');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-md bg-muted" />
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded" />
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="h-6 w-48 bg-muted rounded mb-2" />
            <div className="h-4 w-64 bg-muted rounded" />
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <div className="h-10 w-24 bg-muted rounded" />
              <div className="h-10 w-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/pemasok">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Supplier</h1>
          <p className="text-sm text-muted-foreground">
            Perbarui informasi supplier
          </p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Informasi Supplier</h2>
          <p className="text-sm text-muted-foreground">
            Perbarui detail informasi supplier
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Supplier <span className="text-destructive">*</span></Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama supplier" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon <span className="text-destructive">*</span></Label>
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
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
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
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/pemasok')}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
