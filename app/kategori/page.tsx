'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2, RefreshCw, AlertCircle, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  description: string | null;
  _count?: {
    products: number;
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching categories...');
      const response = await fetch('/api/kategori', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('Categories API response:', data);
      
      if (!response.ok) {
        const errorMessage = data?.error || 'Gagal mengambil data kategori';
        throw new Error(errorMessage);
      }
      
      // Transform the API response to match the expected format
      const formattedCategories = Array.isArray(data) ? data.map(item => ({
        id: item.id,
        name: item.name || 'Tanpa Nama',
        description: item.description || null,
        _count: {
          products: 0 // This will be updated if you have product counts
        }
      })) : [];
      
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat kategori');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) return;
    
    try {
      setIsDeleting(prev => ({ ...prev, [id]: true }));
      
      console.log('Mengirim permintaan DELETE ke /api/kategori/' + id);
      const response = await fetch(`/api/kategori/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Status response:', response.status);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (e) {
        console.error('Gagal mengurai respons JSON:', e);
        throw new Error('Terjadi kesalahan saat memproses respons dari server');
      }
      
      if (response.ok) {
        if (responseData && responseData.success) {
          setCategories(categories.filter(category => category.id !== id));
          alert('Kategori berhasil dihapus');
        } else {
          throw new Error(responseData?.error || 'Gagal menghapus kategori');
        }
      } else {
        throw new Error(
          responseData?.error || 
          responseData?.message || 
          `Gagal menghapus kategori (${response.status} ${response.statusText})`
        );
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus kategori');
    } finally {
      setIsDeleting(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Daftar Kategori</h1>
          <p className="text-muted-foreground">Kelola kategori produk Anda</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchCategories}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button asChild>
            <Link href="/kategori/baru">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 text-red-700 hover:bg-red-100"
                  onClick={fetchCategories}
                >
                  Coba Lagi
                </Button>
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari kategori..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Tidak ada kategori yang cocok dengan pencarian' : 'Belum ada kategori'}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => (
                <Card key={category.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description || 'Tidak ada deskripsi'}
                        </p>
                        <p className="text-sm mt-2">
                          {category._count?.products || 0} produk
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                        >
                          <Link href={`/pengaturan/kategori?edit=${category.id}`}>
                            Edit
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          disabled={isDeleting[category.id]}
                        >
                          {isDeleting[category.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : 'Hapus'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
