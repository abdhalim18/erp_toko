import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Use raw query to match the actual database schema
    const products = await prisma.$queryRaw`
      SELECT 
        p.produk as id,
        p.nama as name,
        p.sku as sku,
        p.deskripsi as description,
        p.harga_beli as price,
        p.stok_sekarang as stock,
        p.satuan as unit,
        p.barcode as barcode
      FROM produk p
      WHERE p.stok_sekarang > 0
      ORDER BY p.nama ASC
    `;

    // Convert BigInt to string to avoid serialization issues
    const safeProducts = JSON.parse(JSON.stringify(products, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json(safeProducts, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error('Error in GET /api/produk:', error);
    return NextResponse.json(
      { 
        error: 'Gagal mengambil data produk',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

interface ProductData {
  name: string;
  sku?: string;
  description?: string;
  purchasePrice: number | string;
  sellingPrice: number | string;
  stock: number | string;
  minStock: number | string;
  unit: string;
  barcode?: string;
  categoryId?: string;
  supplierId?: string;
}

export async function POST(request: Request) {
  try {
    const data: ProductData = await request.json();

    // Validate required fields
    if (!data.name || !data.sellingPrice || !data.purchasePrice) {
      return NextResponse.json(
        { error: 'Nama, harga beli, dan harga jual harus diisi' },
        { status: 400 }
      );
    }

    // Convert string numbers to numbers
    const productData = {
      nama: data.name,
      sku: data.sku || `PRD-${Date.now()}`,
      deskripsi: data.description || null,
      harga_beli: Number(data.purchasePrice),
      harga_jual: Number(data.sellingPrice),
      stok_sekarang: Number(data.stock) || 0,
      stok_minimal: Number(data.minStock) || 0,
      satuan: data.unit || 'pcs',
      barcode: data.barcode || null,
      id_kategori: data.categoryId || null,
      id_pemasok: data.supplierId || null,
    };

    const newProduct = await prisma.$executeRaw`
      INSERT INTO produk (
        produk,
        nama,
        sku,
        deskripsi,
        harga_beli,
        harga_jual,
        stok_sekarang,
        stok_minimal,
        satuan,
        barcode,
        id_kategori,
        id_pemasok,
        dibuat_pada,
        diperbarui_pada
      ) VALUES (
        UUID(),
        ${productData.nama},
        ${productData.sku},
        ${productData.deskripsi},
        ${productData.harga_beli},
        ${productData.harga_jual},
        ${productData.stok_sekarang},
        ${productData.stok_minimal},
        ${productData.satuan},
        ${productData.barcode},
        ${productData.id_kategori},
        ${productData.id_pemasok},
        NOW(),
        NOW()
      )
    `;

    return NextResponse.json(
      { message: 'Produk berhasil ditambahkan' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/produk:', error);
    return NextResponse.json(
      { 
        error: 'Gagal menambahkan produk',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID produk tidak valid' },
        { status: 400 }
      );
    }

    await prisma.$executeRaw`
      DELETE FROM produk WHERE produk = ${id}
    `;

    return NextResponse.json(
      { message: 'Produk berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/produk:', error);
    return NextResponse.json(
      { 
        error: 'Gagal menghapus produk',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
