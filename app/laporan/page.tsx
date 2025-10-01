import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import styles from './reports.module.css';

export default function ReportsPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Data statistik ringkasan - Digunakan dalam komponen

  // Data untuk grafik penjualan dan pembelian
  const salesData = [
    { month: 'Jan', sales: 5000000, purchases: 3000000 },
    { month: 'Feb', sales: 4500000, purchases: 3500000 },
    { month: 'Mar', sales: 6000000, purchases: 4000000 },
    { month: 'Apr', sales: 7000000, purchases: 3500000 },
    { month: 'Mei', sales: 8000000, purchases: 4500000 },
    { month: 'Jun', sales: 7500000, purchases: 5000000 },
  ] as const;

  // Fungsi untuk mendapatkan tinggi bar chart
  const getBarHeight = (value: number) => {
    const maxHeight = 100; // Tinggi maksimum dalam persentase
    const maxValue = 10000000; // Nilai maksimum untuk normalisasi
    return Math.min((value / maxValue) * maxHeight, maxHeight);
  };
  
  // Fungsi untuk mendapatkan style bar chart
  const getBarStyle = (value: number) => ({
    height: `${getBarHeight(value)}%`,
    minHeight: '2px', // Ensure visibility for very small values
  });
  
  // Menghitung total penjualan dan pembelian untuk ringkasan
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const totalPurchases = salesData.reduce((sum, item) => sum + item.purchases, 0);
  const profit = totalSales - totalPurchases;

  // Data untuk laporan stok
  const stockReport = [
    { id: 1, name: 'Obat Cacing', category: 'Obat', stock: 45, minStock: 10 },
    { id: 3, name: 'Kandang Kecil', category: 'Aksesoris', stock: 8, minStock: 5 },
    { id: 4, name: 'Vitamin Kucing', category: 'Obat', stock: 22, minStock: 15 },
  ] as const;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Laporan</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <span>Ekspor Laporan</span>
          <div suppressHydrationWarning>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="inline-block"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
        </Button>
      </div>

      {/* Ringkasan Cepat */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">+20.1% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12.3% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 dari bulan lalu</p>
            <p className="text-xs text-muted-foreground">+8 produk baru bulan ini</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="sales">Penjualan & Pembelian</TabsTrigger>
            <TabsTrigger value="stock">Laporan Stok</TabsTrigger>
            <TabsTrigger value="profit">Laba Rugi</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Grafik Penjualan & Pembelian</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className={styles.chartContainer}>
                <div className={styles.chartGrid}>
                  {salesData.map((data, index) => (
                    <div key={index} className="flex flex-col justify-end h-full">
                      <div className="text-center text-xs text-muted-foreground mb-1">
                        {data.month}
                      </div>
                      <div className="flex justify-center gap-1 h-full items-end">
                        <div 
                          className={`${styles.chartBar} ${styles.sales}`}
                          style={getBarStyle(data.sales)}
                          title={`Penjualan: ${formatCurrency(data.sales)}`}
                        />
                        <div 
                          className={`${styles.chartBar} ${styles.purchases}`}
                          style={getBarStyle(data.purchases)}
                          title={`Pembelian: ${formatCurrency(data.purchases)}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.legend}>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.sales}`}></div>
                    <span>Penjualan</span>
                  </div>
                  <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.purchases}`}></div>
                    <span>Pembelian</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Penjualan Tertinggi</h4>
                  <p className="text-sm text-muted-foreground">Mei 2023</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Rata-rata Bulanan</h4>
                  <p className="text-2xl font-bold">{formatCurrency(6333333)}</p>
                  <p className="text-sm text-muted-foreground">Jan - Jun 2023</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Total Tahunan</h4>
                  <p className="text-2xl font-bold">{formatCurrency(38000000)}</p>
                  <p className="text-sm text-muted-foreground">2023 (Jan - Jun)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock">
          <Card>
            <CardHeader>
              <CardTitle>Laporan Stok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 bg-muted/50 p-4 font-medium">
                  <div className="col-span-5">Nama Produk</div>
                  <div className="col-span-2">Kategori</div>
                  <div className="col-span-2 text-right">Stok Saat Ini</div>
                  <div className="col-span-2 text-right">Stok Minimal</div>
                  <div className="col-span-1 text-right">Status</div>
                </div>
                {stockReport.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 p-4 border-t hover:bg-muted/50">
                    <div className="col-span-5 font-medium">{item.name}</div>
                    <div className="col-span-2 text-sm text-muted-foreground">{item.category}</div>
                    <div className="col-span-2 text-right">{item.stock}</div>
                    <div className="col-span-2 text-right">{item.minStock}</div>
                    <div className="col-span-1 text-right">
                      {item.stock <= item.minStock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Perlu Restok
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aman
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Laporan Laba Rugi</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Bulan Ini</Button>
                  <Button variant="outline" size="sm">Tahun Ini</Button>
                  <Button variant="outline" size="sm">Custom</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center p-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="mx-auto text-muted-foreground mb-2"
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  <h3 className="font-medium">Laporan Laba Rugi</h3>
                  <p className="text-sm text-muted-foreground">Menampilkan ringkasan laba rugi periode terpilih</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium">Pendapatan</h4>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSales)}</p>
                  <p className="text-sm text-muted-foreground">+20.1% dari bulan lalu</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-medium">Beban</h4>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalPurchases)}</p>
                  <p className="text-sm text-muted-foreground">+5.2% dari bulan lalu</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium">Laba Bersih</h4>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(profit)}</p>
                  <p className="text-sm text-muted-foreground">+12.3% dari bulan lalu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
