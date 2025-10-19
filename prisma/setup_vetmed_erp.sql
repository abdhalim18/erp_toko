-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `vetmed_erp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `vetmed_erp`;

-- Create kategori table
CREATE TABLE IF NOT EXISTS `kategori` (
  `id` VARCHAR(36) NOT NULL,
  `nama` VARCHAR(100) NOT NULL,
  `deskripsi` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kategori_nama_key` (`nama`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create pemasok table
CREATE TABLE IF NOT EXISTS `pemasok` (
  `id` VARCHAR(36) NOT NULL,
  `nama` VARCHAR(100) NOT NULL,
  `alamat` TEXT,
  `telepon` VARCHAR(20),
  `email` VARCHAR(100),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create produk table
CREATE TABLE IF NOT EXISTS `produk` (
  `id` VARCHAR(36) NOT NULL,
  `kode` VARCHAR(50) NOT NULL,
  `nama` VARCHAR(100) NOT NULL,
  `deskripsi` TEXT,
  `harga_beli` DECIMAL(19,2) NOT NULL DEFAULT 0,
  `harga_jual` DECIMAL(19,2) NOT NULL DEFAULT 0,
  `stok_sekarang` INT NOT NULL DEFAULT 0,
  `stok_minimal` INT NOT NULL DEFAULT 0,
  `id_kategori` VARCHAR(36),
  `id_pemasok` VARCHAR(36),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `produk_kode_key` (`kode`),
  CONSTRAINT `produk_id_kategori_fkey` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id`) ON DELETE SET NULL,
  CONSTRAINT `produk_id_pemasok_fkey` FOREIGN KEY (`id_pemasok`) REFERENCES `pemasok` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create penjualan table
CREATE TABLE IF NOT EXISTS `penjualan` (
  `id` VARCHAR(36) NOT NULL,
  `no_faktur` VARCHAR(50) NOT NULL,
  `nama_pelanggan` VARCHAR(100) NOT NULL,
  `tanggal` DATETIME NOT NULL,
  `total` DECIMAL(19,2) NOT NULL,
  `status` ENUM('DRAFT', 'SELESAI', 'BATAL') NOT NULL DEFAULT 'DRAFT',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `penjualan_no_faktur_key` (`no_faktur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create detail_penjualan table
CREATE TABLE IF NOT EXISTS `detail_penjualan` (
  `id` VARCHAR(36) NOT NULL,
  `id_penjualan` VARCHAR(36) NOT NULL,
  `id_produk` VARCHAR(36) NOT NULL,
  `jumlah` INT NOT NULL,
  `harga_satuan` DECIMAL(19,2) NOT NULL,
  `subtotal` DECIMAL(19,2) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `detail_penjualan_id_penjualan_fkey` (`id_penjualan`),
  KEY `detail_penjualan_id_produk_fkey` (`id_produk`),
  CONSTRAINT `detail_penjualan_id_penjualan_fkey` FOREIGN KEY (`id_penjualan`) REFERENCES `penjualan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detail_penjualan_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
