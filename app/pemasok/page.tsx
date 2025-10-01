'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  MoreVertical, 
  Edit2, 
  Trash2,
  History
} from "@/components/ui/icon";
import Link from "next/link";
import { useSuppliers } from "@/context/SupplierContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface SupplierActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  onViewHistory: () => void;
}

function SupplierActionMenu({ onEdit, onDelete, onViewHistory }: SupplierActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Buka menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          onClick={onViewHistory} 
          className="cursor-pointer text-sm"
        >
          <History className="mr-2 h-4 w-4" />
          <span>Riwayat</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onEdit} 
          className="cursor-pointer text-sm"
        >
          <Edit2 className="mr-2 h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onDelete} 
          className="cursor-pointer text-sm text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Hapus</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function SuppliersPage() {
  const router = useRouter();
  const { suppliers, deleteSupplier } = useSuppliers();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.phone.includes(searchQuery) ||
    supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (id: number) => {
    setSelectedSupplier(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSupplier) {
      deleteSupplier(selectedSupplier);
      setDeleteDialogOpen(false);
      toast.success('Supplier berhasil dihapus');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/pemasok/edit/${id}`);
  };

  const handleViewHistory = (id: number) => {
    router.push(`/pemasok/${id}/history`);
  };
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Supplier</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data supplier produk hewan peliharaan Anda
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/pemasok/baru" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Tambah Supplier</span>
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle className="text-lg">Daftar Supplier</CardTitle>
              <p className="text-sm text-muted-foreground">
                {filteredSuppliers.length} supplier ditemukan
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari supplier..."
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSuppliers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Tidak ada supplier</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                {searchQuery ? 'Coba cari dengan kata kunci lain' : 'Mulai dengan menambahkan supplier baru'}
              </p>
              {!searchQuery && (
                <Button className="mt-4" asChild>
                  <Link href="/pemasok/baru" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Tambah Supplier</span>
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredSuppliers.map((supplier) => (
                <div 
                  key={supplier.id} 
                  className="flex items-center p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium truncate">{supplier.name}</h3>
                      <div className="md:hidden">
                        <SupplierActionMenu
                          onEdit={() => handleEdit(supplier.id)}
                          onDelete={() => handleDeleteClick(supplier.id)}
                          onViewHistory={() => handleViewHistory(supplier.id)}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Phone className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{supplier.phone}</span>
                      </span>
                      {supplier.email && (
                        <span className="hidden sm:flex items-center">
                          <Mail className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{supplier.email}</span>
                        </span>
                      )}
                      {supplier.address && (
                        <span className="hidden md:flex items-center">
                          <MapPin className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{supplier.address}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 hidden md:flex items-center gap-4">
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      {supplier.productCount} produk
                    </div>
                    <SupplierActionMenu
                      onEdit={() => handleEdit(supplier.id)}
                      onDelete={() => handleDeleteClick(supplier.id)}
                      onViewHistory={() => handleViewHistory(supplier.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Supplier?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data supplier akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
