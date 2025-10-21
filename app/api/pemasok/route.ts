import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Interface for supplier data from database
interface DBSupplier {
  id: number;
  nama: string;
  alamat: string | null;
  telepon: string | null;
  email: string | null;
  dibuat_pada: string;
  diperbarui_pada: string;
  product_count?: number;
}

// Interface for API response
interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function GET() {
  let connection;
  
  try {
    // Get connection from pool
    connection = await pool.getConnection();
    
    // Get all suppliers with product count
    const [suppliers] = await connection.query(
      'SELECT p.*, COUNT(pr.id) as product_count ' +
      'FROM pemasok p ' +
      'LEFT JOIN produk pr ON p.id = pr.id_pemasok ' +
      'GROUP BY p.id ' +
      'ORDER BY p.nama ASC'
    ) as [DBSupplier[], any];

    // Format the response
    const formattedSuppliers: Supplier[] = suppliers.map(supplier => ({
      id: supplier.id,
      name: supplier.nama,
      address: supplier.alamat || '',
      phone: supplier.telepon || '',
      email: supplier.email || '',
      productCount: supplier.product_count || 0,
      createdAt: supplier.dibuat_pada,
      updatedAt: supplier.diperbarui_pada,
    }));

    return NextResponse.json(formattedSuppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data pemasok' },
      { status: 500 }
    );
  } finally {
    // Release the connection back to the pool
    if (connection) connection.release();
  }
}

export async function POST(request: Request) {
  let connection;
  
  try {
    const body = await request.json();
    const { name, address, phone, email } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Nama pemasok harus diisi' },
        { status: 400 }
      );
    }

    // Get connection from pool
    connection = await pool.getConnection();
    
    // Check if supplier with the same name already exists
    const [existingSuppliers] = await connection.query(
      'SELECT id FROM pemasok WHERE LOWER(nama) = LOWER(?)',
      [name]
    ) as [any[], any];

    if (existingSuppliers.length > 0) {
      return NextResponse.json(
        { error: 'Pemasok dengan nama tersebut sudah ada' },
        { status: 400 }
      );
    }

    // Create new supplier
    const [result] = await connection.query(
      'INSERT INTO pemasok (nama, alamat, telepon, email) VALUES (?, ?, ?, ?)',
      [name, address || null, phone || null, email || null]
    ) as [any, any];

    // Get the newly created supplier
    const [newSupplier] = await connection.query(
      'SELECT * FROM pemasok WHERE id = ?',
      [result.insertId]
    ) as [DBSupplier[], any];

    // Format the response
    const formattedSupplier: Supplier = {
      id: newSupplier[0].id,
      name: newSupplier[0].nama,
      address: newSupplier[0].alamat || '',
      phone: newSupplier[0].telepon || '',
      email: newSupplier[0].email || '',
      productCount: 0, // New supplier has no products yet
      createdAt: newSupplier[0].dibuat_pada,
      updatedAt: newSupplier[0].diperbarui_pada,
    };

    return NextResponse.json(formattedSupplier, { status: 201 });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan pemasok' },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

export async function DELETE(request: Request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID pemasok harus disertakan' },
        { status: 400 }
      );
    }

    // Get connection from pool
    connection = await pool.getConnection();
    
    // Check if supplier exists
    const [suppliers] = await connection.query(
      'SELECT * FROM pemasok WHERE id = ?',
      [id]
    ) as [DBSupplier[], any];

    if (suppliers.length === 0) {
      return NextResponse.json(
        { error: 'Pemasok tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if supplier has associated products
    const [products] = await connection.query(
      'SELECT COUNT(*) as count FROM produk WHERE id_pemasok = ?',
      [id]
    ) as [{ count: number }[], any];

    if (products[0].count > 0) {
      return NextResponse.json(
        {
          error: 'Tidak dapat menghapus pemasok karena memiliki produk yang terkait',
        },
        { status: 400 }
      );
    }

    // Delete the supplier
    await connection.query('DELETE FROM pemasok WHERE id = ?', [id]);

    return NextResponse.json(
      { message: 'Pemasok berhasil dihapus' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting supplier:', error);
    
    let errorMessage = 'Gagal menghapus pemasok';
    let statusCode = 500;
    
    // Check for specific error types if needed
    if (error instanceof Error) {
      errorMessage = error.message;
      // Handle specific error codes if needed
    }

    // Handle foreign key constraint errors
    if (error.message?.includes('foreign key constraint')) {
      errorMessage = 'Tidak dapat menghapus pemasok karena terdapat data yang terkait';
      statusCode = 400;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  } finally {
    if (connection) await connection.release();
  }
}
