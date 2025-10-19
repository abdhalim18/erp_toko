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

// Simple interface for database result
interface SupplierRow {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function GET() {
  let prismaConnected = false;
  
  try {
    console.log('=== Starting GET /api/pemasok ===');
    
    // Check database connection
    prismaConnected = await checkDatabaseConnection();
    if (!prismaConnected) {
      throw new Error('Tidak dapat terhubung ke database');
    }

    // Get suppliers with correct column names
    const suppliers = await prisma.$queryRaw`
      SELECT 
        pemasok as id,
        nama as name,
        alamat as address,
        telepon as phone,
        email as email,
        nama_kontak as contactName,
        dibuat_pada as createdAt,
        diperbarui_pada as updatedAt
      FROM pemasok
      ORDER BY nama ASC
    `;
    
    console.log(`Successfully fetched ${Array.isArray(suppliers) ? suppliers.length : 0} suppliers`);
    
    // Transform to match expected format
    const formattedSuppliers = (Array.isArray(suppliers) ? suppliers : []).map(supplier => ({
      id: supplier.id || '',
      name: supplier.name || '',
      address: supplier.address || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      contactName: supplier.contactName || '',
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt
    }));
    
    return NextResponse.json(formattedSuppliers, { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in GET /api/pemasok:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Gagal mengambil data pemasok',
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
  try {
    const { name, address, phone, email } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Nama pemasok harus diisi' },
        { status: 400 }
      );
    }

    console.log('Adding new supplier:', { name, address, phone, email });

    const newSupplier = await prisma.$executeRaw`
      INSERT INTO pemasok (
        pemasok,
        nama,
        alamat,
        telepon,
        email,
        dibuat_pada,
        diperbarui_pada
      )
      VALUES (
        UUID(),
        ${name},
        ${address || null},
        ${phone || null},
        ${email || null},
        NOW(),
        NOW()
      )
    `;

    console.log('Pemasok berhasil ditambahkan');

    return NextResponse.json(
      { 
        success: true,
        message: 'Pemasok berhasil ditambahkan',
        data: { name, address, phone, email }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error menambahkan pemasok:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal menambahkan pemasok',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  let prismaConnected = false;
  
  try {
    // Check database connection
    prismaConnected = await checkDatabaseConnection();
    if (!prismaConnected) {
      throw new Error('Tidak dapat terhubung ke database');
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID pemasok tidak valid' },
        { status: 400 }
      );
    }

    console.log('Attempting to delete supplier with ID:', id);

    // First, check if there are any dependent records
    const hasDependencies = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM produk WHERE id_pemasok = ${id}
    `;

    if (hasDependencies && hasDependencies[0]?.count > 0) {
      return NextResponse.json(
        { 
          error: 'Tidak dapat menghapus pemasok karena terdapat produk yang terkait',
          details: 'Harap hapus atau ubah pemasok untuk produk yang terkait terlebih dahulu'
        },
        { status: 400 }
      );
    }

    // Delete the supplier
    await prisma.$executeRaw`
      DELETE FROM pemasok WHERE pemasok = ${id}
    `;

    console.log('Supplier deleted successfully:', id);
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Pemasok berhasil dihapus',
        data: { id }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting supplier:', error);
    
    let errorMessage = 'Gagal menghapus pemasok';
    let statusCode = 500;
    let details = null;

    // Handle foreign key constraint errors
    if (error.message?.includes('foreign key constraint')) {
      errorMessage = 'Tidak dapat menghapus pemasok karena terdapat data yang terkait';
      details = 'Harap hapus atau ubah data produk/pembelian yang terkait dengan pemasok ini terlebih dahulu';
      statusCode = 400;
    }

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (details || error.message) : details
      },
      { status: statusCode }
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
