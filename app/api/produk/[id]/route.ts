import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.produk.findUnique({
      where: { id: params.id },
      include: {
        kategori: {
          select: {
            id: true,
            nama: true
          }
        },
        pemasok: {
          select: {
            id: true,
            nama: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    // Format the response
    const formattedProduct = {
      id: product.id,
      nama: product.name,
      deskripsi: product.description,
      sku: product.sku,
      barcode: product.barcode,
      satuan: product.unit,
      harga_beli: product.purchasePrice.toNumber(),
      harga_jual: product.sellingPrice.toNumber(),
      stok_minimal: product.minStockLevel,
      stok_sekarang: product.currentStock,
      id_kategori: product.categoryId,
      id_pemasok: product.supplierId,
      kategori: product.kategori,
      pemasok: product.pemasok,
      dibuat_pada: product.createdAt,
      diperbarui_pada: product.updatedAt
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    const updatedProduct = await prisma.produk.update({
      where: { id: params.id },
      data: {
        name: data.nama,
        description: data.deskripsi,
        sku: data.sku,
        barcode: data.barcode,
        unit: data.satuan,
        purchasePrice: data.harga_beli,
        sellingPrice: data.harga_jual,
        minStockLevel: data.stok_minimal,
        currentStock: data.stok_sekarang,
        categoryId: data.id_kategori,
        supplierId: data.id_pemasok
      },
      include: {
        kategori: {
          select: { nama: true }
        },
        pemasok: {
          select: { nama: true }
        }
      }
    });

    return NextResponse.json({
      message: 'Produk berhasil diperbarui',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui produk' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if there are any related records
    const hasRelatedRecords = await Promise.all([
      prisma.itemPenjualan.findFirst({ where: { productId: params.id } }),
      prisma.itemPembelian.findFirst({ where: { productId: params.id } })
    ]);

    if (hasRelatedRecords.some(Boolean)) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus produk yang sudah memiliki transaksi' },
        { status: 400 }
      );
    }

    // Delete the product
    await prisma.produk.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus produk' },
      { status: 500 }
    );
  }
}
