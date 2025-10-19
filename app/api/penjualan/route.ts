import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // First, verify the table structure
    const tableInfo = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'vetmed_erp' 
      AND TABLE_NAME = 'penjualan'
    `;
    console.log('Penjualan table structure:', tableInfo);

    // Get sales data with correct column names
    const sales = await prisma.$queryRaw`
      SELECT 
        p.penjualan as id,
        p.nomor_invoice as no_faktur,
        COALESCE(p.nama_pelanggan, 'Pelanggan Umum') as nama_pelanggan,
        p.dibuat_pada as tanggal,
        p.total,
        p.status,
        p.dibuat_pada as created_at,
        p.diperbarui_pada as updated_at
      FROM penjualan p
      ORDER BY p.dibuat_pada DESC
    `;

    console.log('Fetched sales data:', sales);
    
    // Convert BigInt to string to avoid serialization issues
    const safeSales = JSON.parse(JSON.stringify(sales, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(safeSales, { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in GET /api/penjualan:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data penjualan' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.items || !data.items.length) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Minimal satu item harus ditambahkan' 
        },
        { status: 400 }
      );
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create sale header
      await tx.$executeRaw`
        INSERT INTO penjualan (
          nomor_invoice,
          nama_pelanggan,
          telepon_pelanggan,
          email_pelanggan,
          subtotal,
          pajak,
          diskon,
          total,
          metode_pembayaran,
          status_pembayaran,
          status,
          catatan,
          id_pengguna,
          dibuat_pada,
          diperbarui_pada
        ) VALUES (
          CONCAT('INV-', DATE_FORMAT(NOW(), '%Y%m%d-'), LPAD(FLOOR(RAND() * 10000), 4, '0')),
          ${data.customerName || 'Pelanggan Umum'},
          ${data.phone || null},
          ${data.email || null},
          ${data.subtotal || 0},
          ${data.tax || 0},
          ${data.discount || 0},
          ${data.total},
          ${data.paymentMethod || 'CASH'},
          'PAID',
          'COMPLETED',
          ${data.notes || null},
          ${data.userId || null},
          NOW(),
          NOW()
        )
      `;

      // Get the inserted sale ID
      const [sale] = await tx.$queryRaw`
        SELECT penjualan as id FROM penjualan 
        ORDER BY dibuat_pada DESC 
        LIMIT 1
      `;

      // Insert sale items
      for (const item of data.items) {
        await tx.$executeRaw`
          INSERT INTO detail_penjualan (
            id_penjualan,
            id_produk,
            jumlah,
            harga_satuan,
            subtotal
          ) VALUES (
            ${sale.id},
            ${item.productId},
            ${item.quantity},
            ${item.unitPrice},
            ${item.subtotal}
          )
        `;

        // Update product stock
        await tx.$executeRaw`
          UPDATE produk 
          SET stok_sekarang = stok_sekarang - ${item.quantity}
          WHERE produk = ${item.productId}
        `;
      }

      return { success: true, saleId: sale.id };
    });

    return NextResponse.json({
      success: true,
      message: 'Transaksi berhasil disimpan',
      saleId: result.saleId
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal menyimpan transaksi',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}
