import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

// Fungsi untuk mendapatkan data produk (sama dengan halaman detail)
async function getProduct(id: string) {
  // Data dummy
  const products = [
    { 
      id: "1", 
      name: "Obat Cacing", 
      sku: "OBT-001", 
      description: "Obat cacing untuk kucing dan anjing, efektif membasmi cacing pita dan cacing gelang.",
      price: 25000,
      cost: 15000,
      stock: 45,
      minStock: 10,
      unit: "tablet",
      categoryId: "1",
      supplierId: "1",
      barcode: "123456789012",
    },
    { 
      id: "2", 
      name: "Makanan Kucing 1kg", 
      sku: "MK-001", 
      description: "Makanan kucing dewasa, tinggi protein, untuk bulu sehat dan pencernaan lancar.",
      price: 50000,
      cost: 35000,
      stock: 120,
      minStock: 20,
      unit: "pack",
      categoryId: "2",
      supplierId: "2",
      barcode: "234567890123",
    },
    { 
      id: "3", 
      name: "Kandang Kecil", 
      sku: "KDG-001", 
      description: "Kandang kucing/anjing kecil, mudah dibersihkan, dengan alas yang nyaman.",
      price: 150000,
      cost: 100000,
      stock: 8,
      minStock: 5,
      unit: "pcs",
      categoryId: "3",
      supplierId: "3",
      barcode: "345678901234",
    }
  ]

  const product = products.find(p => p.id === id)
  if (!product) return null
  return product
}

// Data dummy untuk select options
const categories = [
  { id: "1", name: "Obat" },
  { id: "2", name: "Makanan" },
  { id: "3", name: "Aksesoris" },
  { id: "4", name: "Perlengkapan" },
]

const suppliers = [
  { id: "1", name: "PT Sehat Hewan" },
  { id: "2", name: "CV Pet Food" },
  { id: "3", name: "UD Pet Lovers" },
  { id: "4", name: "Toko Hewan Sejahtera" },
]

const units = [
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "pack", label: "Pack" },
  { value: "box", label: "Box" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "gram", label: "Gram (g)" },
  { value: "ml", label: "Mililiter (ml)" },
  { value: "tablet", label: "Tablet" },
  { value: "botol", label: "Botol" },
]

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/produk/${product.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Produk</h1>
      </div>

      <form className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Produk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Produk</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      defaultValue={product.name} 
                      placeholder="Contoh: Obat Cacing" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">Kode SKU</Label>
                    <Input 
                      id="sku" 
                      name="sku" 
                      defaultValue={product.sku} 
                      placeholder="Contoh: OBT-001" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={product.description} 
                    placeholder="Deskripsi produk..." 
                    rows={4} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Kategori</Label>
                    <Select name="categoryId" defaultValue={product.categoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierId">Supplier</Label>
                    <Select name="supplierId" defaultValue={product.supplierId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga Jual</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">Rp</span>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        defaultValue={product.price} 
                        className="pl-8" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Harga Beli</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">Rp</span>
                      <Input 
                        id="cost" 
                        name="cost" 
                        type="number" 
                        defaultValue={product.cost} 
                        className="pl-8" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input 
                      id="barcode" 
                      name="barcode" 
                      defaultValue={product.barcode} 
                      placeholder="Kode barcode" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Stok</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok Saat Ini</Label>
                  <Input 
                    id="stock" 
                    name="stock" 
                    type="number" 
                    defaultValue={product.stock} 
                    min="0" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStock">Stok Minimum</Label>
                  <Input 
                    id="minStock" 
                    name="minStock" 
                    type="number" 
                    defaultValue={product.minStock} 
                    min="0" 
                    required 
                  />
                  <p className="text-xs text-muted-foreground">
                    Notifikasi akan muncul saat stok mencapai angka ini
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Satuan</Label>
                  <Select name="unit" defaultValue={product.unit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih satuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gambar Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/30">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                      </p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" />
                  </label>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Format: JPG, PNG. Maksimal 2MB
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">
                <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/products/${product.id}`}>
                  Batal
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
