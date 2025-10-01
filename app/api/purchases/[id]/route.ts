import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Enable Prisma logging in development
const log = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Purchase API]', ...args);
  }
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  log(`Fetching purchase with ID: ${id}`);

  if (!id) {
    log('Error: No ID provided');
    return NextResponse.json(
      { error: 'ID pembelian tidak valid' },
      { status: 400 }
    );
  }

  try {
    // Check database connection
    await prisma.$connect();
    log('Database connection successful');

    const purchase = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
            batch: true,
          },
        },
      },
    });

    log('Purchase query completed');

    if (!purchase) {
      log(`Purchase not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Pembelian tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(purchase);
  } catch (error) {
    log('Error:', error);
    
    // Check if it's a Prisma error
    if (error instanceof Error) {
      log('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      
      return NextResponse.json(
        { 
          error: 'Gagal mengambil data pembelian',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan internal server',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {
      log('Error disconnecting from database');
    });
  }
}
