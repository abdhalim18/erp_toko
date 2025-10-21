-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS erp_toko;

-- Tabel Kategori
CREATE TABLE IF NOT EXISTS kategori (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel Pemasok
CREATE TABLE IF NOT EXISTS pemasok (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  alamat TEXT,
  telepon VARCHAR(20),
  email VARCHAR(100),
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel Produk
CREATE TABLE IF NOT EXISTS produk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  harga DECIMAL(10,2) NOT NULL,
  stok INT NOT NULL DEFAULT 0,
  id_kategori INT,
  id_pemasok INT,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_kategori) REFERENCES kategori(id),
  FOREIGN KEY (id_pemasok) REFERENCES pemasok(id)
) ENGINE=InnoDB;

-- Tabel Pengguna (user/admin aplikasi)
CREATE TABLE IF NOT EXISTS pengguna (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','kasir','manajer') NOT NULL DEFAULT 'admin',
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel Batch Produk (untuk nomor batch dan kadaluwarsa)
CREATE TABLE IF NOT EXISTS batch_produk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_produk INT NOT NULL,
  kode_batch VARCHAR(100) NOT NULL,
  tanggal_kadaluwarsa DATE NULL,
  qty INT NOT NULL DEFAULT 0,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_batch_produk_produk FOREIGN KEY (id_produk) REFERENCES produk(id) ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE KEY uq_batch_produk (id_produk, kode_batch)
) ENGINE=InnoDB;

-- Tabel Penjualan (header)
CREATE TABLE IF NOT EXISTS penjualan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tanggal DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_pengguna INT NULL,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  diskon DECIMAL(12,2) NOT NULL DEFAULT 0,
  pajak DECIMAL(12,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  catatan TEXT,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_penjualan_pengguna FOREIGN KEY (id_pengguna) REFERENCES pengguna(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabel Item Penjualan (detail)
CREATE TABLE IF NOT EXISTS penjualan_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_penjualan INT NOT NULL,
  id_produk INT NOT NULL,
  id_batch INT NULL,
  qty INT NOT NULL,
  harga DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pj_item_penjualan FOREIGN KEY (id_penjualan) REFERENCES penjualan(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_pj_item_produk FOREIGN KEY (id_produk) REFERENCES produk(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pj_item_batch FOREIGN KEY (id_batch) REFERENCES batch_produk(id) ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_pj_item_penjualan (id_penjualan),
  INDEX idx_pj_item_produk (id_produk)
) ENGINE=InnoDB;

-- Tabel Pembelian (header)
CREATE TABLE IF NOT EXISTS pembelian (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tanggal DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_pemasok INT NULL,
  id_pengguna INT NULL,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  diskon DECIMAL(12,2) NOT NULL DEFAULT 0,
  pajak DECIMAL(12,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  catatan TEXT,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pembelian_pemasok FOREIGN KEY (id_pemasok) REFERENCES pemasok(id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_pembelian_pengguna FOREIGN KEY (id_pengguna) REFERENCES pengguna(id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tabel Item Pembelian (detail)
CREATE TABLE IF NOT EXISTS pembelian_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pembelian INT NOT NULL,
  id_produk INT NOT NULL,
  id_batch INT NULL,
  qty INT NOT NULL,
  harga DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pb_item_pembelian FOREIGN KEY (id_pembelian) REFERENCES pembelian(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_pb_item_produk FOREIGN KEY (id_produk) REFERENCES produk(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pb_item_batch FOREIGN KEY (id_batch) REFERENCES batch_produk(id) ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_pb_item_pembelian (id_pembelian),
  INDEX idx_pb_item_produk (id_produk)
) ENGINE=InnoDB;

-- Tabel Mutasi Stok (riwayat pergerakan stok)
CREATE TABLE IF NOT EXISTS stok_mutasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_produk INT NOT NULL,
  id_batch INT NULL,
  tipe ENUM('IN','OUT') NOT NULL,
  qty INT NOT NULL,
  referensi_tipe ENUM('PEMBELIAN','PENJUALAN','PENYESUAIAN') NOT NULL,
  referensi_id INT NULL,
  keterangan TEXT,
  dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_stok_produk FOREIGN KEY (id_produk) REFERENCES produk(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_stok_batch FOREIGN KEY (id_batch) REFERENCES batch_produk(id) ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_stok_produk (id_produk),
  INDEX idx_stok_batch (id_batch),
  INDEX idx_stok_ref (referensi_tipe, referensi_id)
) ENGINE=InnoDB;

-- Tabel Pengaturan (key-value)
CREATE TABLE IF NOT EXISTS pengaturan (
  kunci VARCHAR(100) PRIMARY KEY,
  nilai TEXT,
  diperbarui_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Index tambahan untuk performa
CREATE INDEX IF NOT EXISTS idx_produk_kategori ON produk(id_kategori);
CREATE INDEX IF NOT EXISTS idx_produk_pemasok ON produk(id_pemasok);