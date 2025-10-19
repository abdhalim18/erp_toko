-- Insert sample kategori
INSERT IGNORE INTO `kategori` (`id`, `nama`, `deskripsi`) VALUES
('k001', 'Makanan Kering', 'Makanan kering untuk hewan peliharaan'),
('k002', 'Makanan Basah', 'Makanan basah kalengan untuk hewan peliharaan'),
('k003', 'Aksesoris', 'Aksesoris hewan peliharaan');

-- Insert sample pemasok
INSERT IGNORE INTO `pemasok` (`id`, `nama`, `alamat`, `telepon`, `email`) VALUES
('p001', 'PT. Pet Food Indonesia', 'Jl. Raya Bogor KM 30', '021-12345678', 'info@petfood.co.id'),
('p002', 'CV. Sejahtera Pet Shop', 'Jl. Sudirman No. 123', '021-87654321', 'sejahtera@pet.shop');

-- Insert sample produk
INSERT IGNORE INTO `produk` (`id`, `kode`, `nama`, `deskripsi`, `harga_beli`, `harga_jual`, `stok_sekarang`, `stok_minimal`, `id_kategori`, `id_pemasok`) VALUES
('pr001', 'MK001', 'Royal Canin Kitten', 'Makanan kucing kitten 1kg', 75000.00, 100000.00, 50, 10, 'k001', 'p001'),
('pr002', 'MK002', 'Whiskas Adult', 'Makanan kucing dewasa 1.2kg', 65000.00, 85000.00, 30, 5, 'k001', 'p001'),
('pr003', 'MB001', 'Proplan Kitten', 'Makanan basah kucing kitten 85gr', 25000.00, 35000.00, 100, 20, 'k002', 'p002');

-- Insert sample penjualan
INSERT IGNORE INTO `penjualan` (`id`, `no_faktur`, `nama_pelanggan`, `tanggal`, `total`, `status`) VALUES
('j001', 'INV-001', 'Budi Santoso', '2025-10-15 10:30:00', 185000.00, 'SELESAI'),
('j002', 'INV-002', 'Siti Rahayu', '2025-10-14 15:45:00', 135000.00, 'SELESAI'),
('j003', 'INV-003', 'Pelanggan Umum', '2025-10-14 09:15:00', 50000.00, 'DRAFT');

-- Insert sample detail_penjualan
INSERT IGNORE INTO `detail_penjualan` (`id`, `id_penjualan`, `id_produk`, `jumlah`, `harga_satuan`, `subtotal`) VALUES
('dj001', 'j001', 'pr001', 1, 100000.00, 100000.00),
('dj002', 'j001', 'pr002', 1, 85000.00, 85000.00),
('dj003', 'j002', 'pr003', 3, 35000.00, 105000.00),
('dj004', 'j002', 'pr002', 1, 85000.00, 85000.00),
('dj005', 'j003', 'pr003', 1, 35000.00, 35000.00);
