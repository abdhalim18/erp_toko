import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Fungsi untuk menangani serialisasi BigInt
const safeStringify = (obj: any): string => {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.$queryRaw`
      SELECT 
        k.kategori as id,
        k.nama as name,
        k.deskripsi as description,
        (SELECT COUNT(*) FROM produk WHERE id_kategori = k.kategori) as product_count
      FROM kategori k
      WHERE k.kategori = ${params.id}
    `;
    
    const categoryData = Array.isArray(category) ? category[0] : null;

    if (!categoryData) {
      return NextResponse.json(
        { success: false, error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: categoryData });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data kategori' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description } = await request.json();

    // Validasi input
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Nama kategori harus diisi' },
        { status: 400 }
      );
    }

    // Cek apakah kategori sudah ada dengan nama yang sama (kecuali dirinya sendiri)
    const existingCategory = await prisma.$queryRaw`
      SELECT kategori FROM kategori 
      WHERE nama = ${name} AND kategori != ${params.id}
      LIMIT 1
    `;

    if (Array.isArray(existingCategory) && existingCategory.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Kategori dengan nama yang sama sudah ada' },
        { status: 400 }
      );
    }

    // Update kategori
    const result = await prisma.$executeRaw`
      UPDATE kategori 
      SET 
        nama = ${name},
        deskripsi = ${description || null},
        diperbarui_pada = NOW()
      WHERE kategori = ${params.id}
    `;

    if (result === 0) {
      return NextResponse.json(
        { success: false, error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kategori berhasil diperbarui',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui kategori' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Mencoba menghapus kategori dengan ID:', params.id);
  
  try {
    // Cek apakah kategori ada dan hitung jumlah produk
    const category = await prisma.$queryRaw`
      SELECT 
        k.kategori as id,
        (SELECT COUNT(*) FROM produk WHERE id_kategori = k.kategori) as product_count
      FROM kategori k
      WHERE k.kategori = ${params.id}
    `;
    
    const categoryData = Array.isArray(category) ? category[0] : null;
    console.log('Data kategori yang ditemukan:', safeStringify(categoryData));

    if (!categoryData) {
      console.log('Kategori tidak ditemukan');
      return NextResponse.json(
        { success: false, error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek apakah kategori memiliki produk
    const productCount = Number(categoryData.product_count || 0);
    if (productCount > 0) {
      console.log('Tidak bisa menghapus kategori karena memiliki', productCount, 'produk');
      return NextResponse.json(
        { 
          success: false,
          error: 'Tidak dapat menghapus kategori yang memiliki produk' 
        },
        { status: 400 }
      );
    }

    // Hapus kategori
    console.log('Menghapus kategori dengan ID:', params.id);
    const deleteResult = await prisma.$executeRaw`
      DELETE FROM kategori 
      WHERE kategori = ${params.id}
    `;
    
    console.log('Hasil penghapusan:', deleteResult);
    
    if (deleteResult === 0) {
      console.log('Tidak ada baris yang terhapus - kategori mungkin sudah tidak ada');
      return NextResponse.json(
        { 
          success: false,
          error: 'Kategori tidak ditemukan' 
        },
        { status: 404 }
      );
    }

    console.log('Kategori berhasil dihapus');
    return NextResponse.json(
      { 
        success: true,
        message: 'Kategori berhasil dihapus',
        deletedId: params.id 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error detail saat menghapus kategori:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menghapus kategori',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
