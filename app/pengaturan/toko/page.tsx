'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Store } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
}

export default function StoreSettingsPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<StoreSettings>();

  const onSubmit = async (data: StoreSettings) => {
    try {
      // Simpan pengaturan toko
      console.log('Saving store settings:', data);
      // TODO: Implement API call to save settings
      alert('Pengaturan toko berhasil disimpan');
    } catch (error) {
      console.error('Error saving store settings:', error);
      alert('Gagal menyimpan pengaturan toko');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/pengaturan">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Pengaturan Toko</h1>
        </div>
        <Button form="store-settings-form" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>

      <form id="store-settings-form" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informasi Toko</CardTitle>
            <CardDescription>
              Kelola informasi toko Anda yang akan muncul di faktur dan laporan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Toko</Label>
                <Input
                  id="name"
                  placeholder="Nama toko Anda"
                  {...register('name', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  placeholder="Nomor telepon toko"
                  {...register('phone', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email toko"
                  {...register('email', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">NPWP (Opsional)</Label>
                <Input
                  id="taxId"
                  placeholder="Nomor NPWP"
                  {...register('taxId')}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  placeholder="Alamat lengkap toko"
                  {...register('address', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (Opsional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://contoh.com"
                  {...register('website')}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
