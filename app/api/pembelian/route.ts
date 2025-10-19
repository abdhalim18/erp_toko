import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Database connection check function
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to database');
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return false;
  }
}

export async function GET() {
  let prismaConnected = false;
  
  try {
    console.log('=== Starting GET /api/pembelian ===');
    
    // Check database connection
    prismaConnected = await checkDatabaseConnection();
    if (!prismaConnected) {
      throw new Error('Tidak dapat terhubung ke database');
    }

    const purchases = await prisma.$queryRaw`
      SELECT 
        p.pembelian as id,
        p.nomor_pesanan as no_faktur,
        s.nama as nama_pemasok,
        p.tanggal_pesanan as tanggal,
        p.total_jumlah as total,
        p.status,
        p.dibuat_pada as created_at,
        p.diperbarui_pada as updated_at
      FROM pembelian p
      LEFT JOIN pemasok s ON p.id_pemasok = s.pemasok
      ORDER BY p.tanggal_pesanan DESC
    `;

    // Convert BigInt to string to avoid serialization issues
    const safePurchases = JSON.parse(JSON.stringify(purchases, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    console.log(`Successfully fetched ${Array.isArray(safePurchases) ? safePurchases.length : 0} purchases`);
    
    return NextResponse.json(safePurchases, { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in GET /api/pembelian:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Gagal mengambil data pembelian',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } finally {
    if (prismaConnected) {
      try {
        await prisma.$disconnect();
      } catch (e) {
        console.error('Error disconnecting from database:', e);
      }
    }
  }
}

export async function POST(request: Request) {
  let prismaConnected = false;
  
  try {
    // Check database connection
    prismaConnected = await checkDatabaseConnection();
    if (!prismaConnected) {
      throw new Error('Tidak dapat terhubung ke database');
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.items || !data.items.length || !data.supplierId) {
      return NextResponse.json(
        { 
          error: 'Pemasok dan minimal satu item harus diisi',
          details: {
            items: data.items,
            supplierId: data.supplierId
          }
        },
        { status: 400 }
      );
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Generate purchase number
      const purchaseNumber = `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Create purchase header
      await tx.$executeRaw`
        INSERT INTO pembelian (
          pembelian,
          nomor_pesanan,
          id_pemasok,
          status,
          tanggal_pesanan,
          total_jumlah,
          dibuat_pada,
          diperbarui_pada
        ) VALUES (
          UUID(),
          ${purchaseNumber},
          ${data.supplierId},
          'PENDING',
          NOW(),
          ${data.total || 0},
          NOW(),
          NOW()
        )
      `;

      // Get the inserted purchase ID
      const [purchase] = await tx.$queryRaw`
        SELECT pembelian as id FROM pembelian 
        WHERE nomor_pesanan = ${purchaseNumber}
        LIMIT 1
      `;

      // Insert purchase items
      for (const item of data.items) {
        await tx.$executeRaw`
          INSERT INTO item_pembelian (
            item_pembelian,
            id_pembelian,
            id_produk,
            kuantitas,
            harga_per_unit,
            dibuat_pada,
            diperbarui_pada
          ) VALUES (
            UUID(),
            ${purchase.id},
            ${item.productId},
            ${item.quantity},
            ${item.unitPrice},
            NOW(),
            NOW()
          )
        `;

        // Update product stock
        await tx.$executeRaw`
          UPDATE produk 
          SET 
            stok_sekarang = stok_sekarang + ${item.quantity},
            harga_beli = ${item.unitPrice}
          WHERE id = ${item.productId}
        `;
      }

      return purchase;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/pembelian:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan transaksi pembelian' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
