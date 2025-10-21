import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT id, nama AS name, COALESCE(deskripsi, '') AS description
       FROM kategori
       ORDER BY nama ASC`
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/kategori:', error);
    return NextResponse.json({ error: 'Gagal mengambil data kategori' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Nama kategori harus diisi' }, { status: 400 });
    }

    connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO kategori (nama, deskripsi) VALUES (?, ?)',
      [name, description || null]
    ) as [any, any];

    const [rows] = await connection.query(
      'SELECT id, nama AS name, COALESCE(deskripsi, "") AS description FROM kategori WHERE id = ? LIMIT 1',
      [result.insertId]
    );

    return NextResponse.json((rows as any[])[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Gagal menambahkan kategori' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
