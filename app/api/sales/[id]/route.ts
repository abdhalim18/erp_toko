import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Disable caching for this route
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const saleId = params.id;
    
    // Validasi ID
    if (!saleId) {
      return NextResponse.json(
        { error: 'ID transaksi tidak valid' },
        { status: 400 }
      );
    }

    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
            batch: true,
          },
        },
      },
    });

    if (!sale) {
      return NextResponse.json(
        { error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(sale);
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { 
        error: 'Gagal mengambil data transaksi',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
