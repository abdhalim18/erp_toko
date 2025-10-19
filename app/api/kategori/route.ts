import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  console.log('Mengambil data kategori...');
  
  try {
    // Check database connection
    await prisma.$connect();
    console.log('Database connected successfully');
    
    // Check if the kategori table exists
    const tableExists = await prisma.$queryRaw`
      SELECT COUNT(*) as table_exists 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'kategori'`;
    
    if (!tableExists || tableExists.length === 0 || (tableExists[0] as any)?.table_exists === 0) {
      console.log('Kategori table does not exist, returning empty array');
      return NextResponse.json([], { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Kategori table exists, fetching categories...');
    
    // Get categories with error handling for column names
    const categories = await prisma.$queryRaw`
      SELECT 
        kategori as id,
        nama as name,
        COALESCE(deskripsi, '') as description
      FROM kategori
      ORDER BY nama ASC
    `;
    
    console.log(`Successfully fetched ${Array.isArray(categories) ? categories.length : 0} categories`);
    return NextResponse.json(
      Array.isArray(categories) ? categories : [],
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error: any) {
    console.error('Error in GET /api/kategori:', error);
    return NextResponse.json(
      { 
        error: 'Gagal mengambil data kategori',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
}

export async function POST(request: Request) {
  try {
    const { name, kode, description } = await request.json();
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Nama kategori harus diisi' },
        { status: 400 }
      );
    }
    
    // Get table structure
    const tableInfo = await prisma.$queryRaw`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'kategori'`;
    
    const columns = (tableInfo as any[]).map(col => col.COLUMN_NAME);
    console.log('Available columns in kategori table:', columns);
    
    const hasKodeColumn = columns.includes('kode');
    const hasStatusColumn = columns.includes('status');
    const hasDeskripsiColumn = columns.includes('deskripsi');
    
    // Build column list and values for INSERT
    let insertColumns = ['id', 'nama', 'created_at', 'updated_at'];
    let insertValues = ['UUID()', '?', 'NOW()', 'NOW()'];
    const params = [name];
    
    if (hasKodeColumn) {
      insertColumns.push('kode');
      insertValues.push(kode ? '?' : 'CONCAT(\'KTG-\', LPAD(HEX(UUID()), 8, \'0\'))');
      if (kode) params.push(kode);
    }
    
    if (hasDeskripsiColumn && description) {
      insertColumns.push('deskripsi');
      insertValues.push('?');
      params.push(description);
    }
    
    if (hasStatusColumn) {
      insertColumns.push('status');
      insertValues.push('?');
      params.push('AKTIF');
    }
    
    // Execute the insert
    const [result] = await prisma.$transaction([
      prisma.$executeRawUnsafe(
        `INSERT INTO kategori (${insertColumns.join(', ')})
         VALUES (${insertValues.join(', ')})`,
        ...params
      ),
      prisma.$queryRaw`SELECT LAST_INSERT_ID() as id`
    ]);
    
    // Get the newly inserted category
    const [newCategory] = await prisma.$queryRaw`
      SELECT 
        id,
        ${hasKodeColumn ? 'COALESCE(kode, CONCAT(\'KTG-\', LPAD(HEX(id), 8, \'0\'))) as kode' : 'CONCAT(\'KTG-\', LPAD(HEX(id), 8, \'0\')) as kode'},
        COALESCE(nama, '') as name,
        COALESCE(deskripsi, '') as description
      FROM kategori 
      WHERE id = LAST_INSERT_ID()`;
    
    return NextResponse.json(newCategory, { status: 201 });
    
  } catch (error) {
    console.error('Error creating category:', error);
    
    // Check for duplicate entry error
    if (error instanceof Error && error.message.includes('Duplicate entry')) {
      return NextResponse.json(
        { error: 'Nama kategori sudah digunakan' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Gagal menambahkan kategori',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(console.error);
  }
}
