import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Create a test supplier if not exists
    const [supplier] = await prisma.$queryRaw`
      INSERT IGNORE INTO pemasok (pemasok, nama, alamat, telepon, email, nama_kontak, dibuat_pada, diperbarui_pada)
      VALUES (
        UUID(),
        'Supplier Test',
        'Jl. Contoh No. 123',
        '081234567890',
        'supplier@example.com',
        'John Doe',
        NOW(),
        NOW()
      )
    `;

    // Get the supplier ID
    const [supplierData] = await prisma.$queryRaw`
      SELECT pemasok as id FROM pemasok WHERE email = 'supplier@example.com' LIMIT 1
    `;

    // Create a test category if not exists
    const [category] = await prisma.$queryRaw`
      INSERT IGNORE INTO kategori (kategori, nama, deskripsi, dibuat_pada, diperbarui_pada)
      VALUES (
        UUID(),
        'Test Category',
        'Kategori untuk produk test',
        NOW(),
        NOW()
      )
    `;

    // Get the category ID
    const [categoryData] = await prisma.$queryRaw`
      SELECT kategori as id FROM kategori WHERE nama = 'Test Category' LIMIT 1
    `;

    // Create a test product
    const [product] = await prisma.$queryRaw`
      INSERT IGNORE INTO produk (
        produk,
        nama,
        sku,
        deskripsi,
        harga_beli,
        harga_jual,
        stok_minimal,
        stok_sekarang,
        satuan,
        barcode,
        id_kategori,
        id_pemasok,
        dibuat_pada,
        diperbarui_pada
      ) VALUES (
        UUID(),
        'Produk Test',
        'TEST-001',
        'Ini adalah produk test',
        10000,
        15000,
        5,
        100,
        'pcs',
        '1234567890123',
        ${categoryData?.id || null},
        ${supplierData?.id || null},
        NOW(),
        NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Test data created successfully',
      data: {
        supplier: supplierData,
        category: categoryData,
        product: { sku: 'TEST-001', name: 'Produk Test' }
      }
    });

  } catch (error) {
    console.error('Error setting up test data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal membuat data test',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
