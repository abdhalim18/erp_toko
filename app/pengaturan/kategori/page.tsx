'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Plus, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Kategori {
  id: string;
  name: string;
  description: string | null;
  _count?: {
    products: number;
  };
  // Tambahan untuk kompatibilitas sementara
  nama?: string;
  deskripsi?: string | null;
}

export default function CategorySettingsPage() {
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newKategori, setNewKategori] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fungsi untuk mengambil data kategori
  const fetchKategori = async () => {
    try {
      console.log('Memulai pengambilan data kategori...');
      setIsLoading(true);
      const response = await fetch('/api/kategori', {
        cache: 'no-store', // Pastikan tidak ada cache
      });
      
      console.log('Status response:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Gagal memuat data kategori');
      }
      
      const data = await response.json();
      console.log('Data kategori diterima:', data);
      
      // Pastikan data adalah array sebelum diset
      if (Array.isArray(data)) {
        setKategori(data);
      } else {
        console.error('Data yang diterima bukan array:', data);
        setKategori([]);
      }
    } catch (error) {
      console.error('Gagal memuat kategori:', error);
      alert(error instanceof Error ? error.message : 'Gagal memuat data kategori');
    } finally {
      setIsLoading(false);
    }
  };

  // Ambil data kategori dari API saat komponen dimuat
  useEffect(() => {
    const loadData = async () => {
      console.log('Komponen dimuat, mengambil data...');
      await fetchKategori();
    };
    
    loadData();
    
    // Cleanup function
    return () => {
      console.log('Komponen di-unmount');
    };
  }, []);

  const handleAddKategori = async () => {
    if (!newKategori.name.trim()) {
      alert('Nama kategori tidak boleh kosong');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/kategori', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newKategori.name,
          description: newKategori.description || null,
        }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Gagal menambahkan kategori');
      }
      
      // Refresh data kategori dari server
      await fetchKategori();
      
      // Reset form
      setNewKategori({ name: '', description: '' });
      setIsAdding(false);
      
    } catch (error) {
      console.error('Gagal menambahkan kategori:', error);
      alert(error instanceof Error ? error.message : 'Gagal menambahkan kategori');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateKategori = async (id: string, updatedData: Partial<Kategori>) => {
    try {
      const response = await fetch(`/api/kategori/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (response.ok) {
        const updatedKategori = await response.json();
        setKategori(kategori.map(k => (k.id === id ? updatedKategori : k)));
      }
    } catch (error) {
      console.error('Gagal memperbarui kategori:', error);
    }
  };

  const handleDeleteKategori = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
    
    try {
      const response = await fetch(`/api/kategori/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setKategori(kategori.filter(k => k.id !== id));
      }
    } catch (error) {
      console.error('Gagal menghapus kategori:', error);
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
          <h1 className="text-2xl font-bold">Kelola Kategori Produk</h1>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>
            Kelola kategori produk untuk mengorganisir inventaris Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/20">
              <h3 className="font-medium mb-4">Tambah Kategori Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Nama Kategori</Label>
                  <Input
                    id="category-name"
                    placeholder="Contoh: Makanan Kering"
                    value={newKategori.name}
                    onChange={(e) => setNewKategori({...newKategori, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="category-desc">Deskripsi (Opsional)</Label>
                  <Input
                    id="category-desc"
                    placeholder="Deskripsi singkat kategori"
                    value={newKategori.description}
                    onChange={(e) => setNewKategori({...newKategori, description: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddKategori}>
                  Simpan
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-md border
          ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">Jumlah Produk</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kategori.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name || category.nama}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.description || category.deskripsi || '-'}
                    </TableCell>
                    <TableCell className="text-right">{category._count?.products || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteKategori(category.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
