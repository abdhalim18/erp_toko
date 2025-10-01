import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Package, Trash2, AlertCircle } from "lucide-react"
import Link from "next/link"

// Fungsi untuk mendapatkan data produk (dalam implementasi nyata, ini akan mengambil dari API)
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
      category: { id: "1", name: "Obat" },
      supplier: { id: "1", name: "PT Sehat Hewan" },
      barcode: "123456789012",
      createdAt: "2023-01-15T10:30:00Z",
      updatedAt: "2023-09-20T15:45:00Z"
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
      category: { id: "2", name: "Makanan" },
      supplier: { id: "2", name: "CV Pet Food" },
      barcode: "234567890123",
      createdAt: "2023-02-10T08:15:00Z",
      updatedAt: "2023-09-25T11:20:00Z"
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
      category: { id: "3", name: "Aksesoris" },
      supplier: { id: "3", name: "UD Pet Lovers" },
      barcode: "345678901234",
      createdAt: "2023-03-05T14:20:00Z",
      updatedAt: "2023-09-18T09:10:00Z"
    }
  ]

  const product = products.find(p => p.id === id)
  if (!product) return null
  return product
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const isLowStock = product.stock <= product.minStock
  const profit = product.price - product.cost
  const profitMargin = (profit / product.cost) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/produk">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Detail Produk</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-muted-foreground">{product.sku}</span>
                    <Badge variant={isLowStock ? "destructive" : "secondary"}>
                      {isLowStock ? "Stok Rendah" : "Stok Tersedia"}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Hapus
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Kategori</h3>
                    <p>{product.category.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Supplier</h3>
                    <p>{product.supplier.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Harga Jual</h3>
                    <p className="font-medium">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(product.price)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Harga Beli</h3>
                    <p>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(product.cost)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Laba</h3>
                    <p className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(profit)}
                      <span className="text-muted-foreground text-xs ml-1">
                        ({profitMargin.toFixed(1)}%)
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Barcode</h3>
                    <p className="font-mono">{product.barcode}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Deskripsi</h3>
                  <p className="whitespace-pre-line">
                    {product.description || "Tidak ada deskripsi"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Riwayat Stok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center p-6">
                  <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium">Riwayat Stok</h3>
                  <p className="text-sm text-muted-foreground">Menampilkan riwayat perubahan stok produk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Stok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/20">
                  <div className="text-3xl font-bold">{product.stock}</div>
                  <div className="text-sm text-muted-foreground">Stok Tersedia</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border">
                    <div className="text-sm font-medium text-muted-foreground">Stok Minimal</div>
                    <div className="text-lg font-semibold">{product.minStock} {product.unit}</div>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <div className="text-sm font-medium text-muted-foreground">Satuan</div>
                    <div className="text-lg font-semibold">{product.unit}</div>
                  </div>
                </div>

                {isLowStock && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">Stok Hampir Habis</h4>
                      <p className="text-sm">Stok produk mendekati batas minimum. Segera lakukan restok.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Dibuat Pada</h3>
                <p>{new Date(product.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Diperbarui Pada</h3>
                <p>{new Date(product.updatedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
