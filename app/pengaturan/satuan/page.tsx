'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Plus, Trash2, ArrowLeft, Ruler } from 'lucide-react';
import Link from 'next/link';

interface Unit {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  productCount: number;
}

export default function UnitSettingsPage() {
  const [units, setUnits] = useState<Unit[]>([
    { id: '1', name: 'Buah', symbol: 'pcs', productCount: 45 },
    { id: '2', name: 'Kilogram', symbol: 'kg', productCount: 32 },
    { id: '3', name: 'Liter', symbol: 'L', productCount: 18 },
    { id: '4', name: 'Meter', symbol: 'm', productCount: 12 },
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newUnit, setNewUnit] = useState({ name: '', symbol: '', description: '' });

  const handleAddUnit = () => {
    if (!newUnit.name.trim() || !newUnit.symbol.trim()) return;
    
    const unit: Unit = {
      id: Date.now().toString(),
      name: newUnit.name,
      symbol: newUnit.symbol,
      description: newUnit.description,
      productCount: 0
    };
    
    setUnits([...units, unit]);
    setNewUnit({ name: '', symbol: '', description: '' });
    setIsAdding(false);
    // TODO: Implement API call to save unit
  };

  const handleDeleteUnit = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus satuan ini?')) {
      setUnits(units.filter(unit => unit.id !== id));
      // TODO: Implement API call to delete unit
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
          <h1 className="text-2xl font-bold">Satuan Produk</h1>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Satuan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Satuan</CardTitle>
          <CardDescription>
            Kelola satuan pengukuran untuk produk-produk Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAdding && (
            <div className="mb-6 p-4 border rounded-lg bg-muted/20">
              <h3 className="font-medium mb-4">Tambah Satuan Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit-name">Nama Satuan</Label>
                  <Input
                    id="unit-name"
                    placeholder="Contoh: Kilogram"
                    value={newUnit.name}
                    onChange={(e) => setNewUnit({...newUnit, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-symbol">Simbol</Label>
                  <Input
                    id="unit-symbol"
                    placeholder="Contoh: kg"
                    value={newUnit.symbol}
                    onChange={(e) => setNewUnit({...newUnit, symbol: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit-desc">Deskripsi (Opsional)</Label>
                  <Input
                    id="unit-desc"
                    placeholder="Deskripsi singkat"
                    value={newUnit.description}
                    onChange={(e) => setNewUnit({...newUnit, description: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddUnit} disabled={!newUnit.name || !newUnit.symbol}>
                  Simpan
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Satuan</TableHead>
                  <TableHead>Simbol</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">Jumlah Produk</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell className="font-mono">{unit.symbol}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {unit.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">{unit.productCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteUnit(unit.id)}
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
