import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT 
         id,
         nama AS name,
         COALESCE(deskripsi, '') AS description,
         harga AS sellingPrice,
         stok AS stock,
         id_kategori AS categoryId,
         id_pemasok AS supplierId,
         dibuat_pada AS createdAt,
         diperbarui_pada AS updatedAt
       FROM produk
       ORDER BY diperbarui_pada DESC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Support both legacy and new payload keys
    const nama: string | undefined = body.nama ?? body.name;
    const deskripsi: string | null = (body.deskripsi ?? body.description) || null;
    const harga: number | undefined = body.harga ?? body.sellingPrice;
    const stok: number = Number(body.stok ?? body.stock ?? 0);
    const id_kategori: number | null = body.id_kategori ?? (body.categoryId ? Number(body.categoryId) : null);
    const id_pemasok: number | null = body.id_pemasok ?? (body.supplierId ? Number(body.supplierId) : null);

    if (!nama) {
      return NextResponse.json({ error: 'Nama produk harus diisi' }, { status: 400 });
    }
    if (harga === undefined || Number.isNaN(Number(harga))) {
      return NextResponse.json({ error: 'Harga jual harus diisi' }, { status: 400 });
    }

    const [result] = await pool.query(
      `INSERT INTO produk (nama, deskripsi, harga, stok, id_kategori, id_pemasok)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nama, deskripsi, Number(harga), Number(stok), id_kategori, id_pemasok]
    ) as [any, any];

    const insertId = result.insertId;

    // Return the created product snapshot
    const [rows] = await pool.query(
      `SELECT 
         id,
         nama AS name,
         COALESCE(deskripsi, '') AS description,
         harga AS sellingPrice,
         stok AS stock,
         id_kategori AS categoryId,
         id_pemasok AS supplierId,
         dibuat_pada AS createdAt,
         diperbarui_pada AS updatedAt
       FROM produk WHERE id = ? LIMIT 1`,
      [insertId]
    );

    return NextResponse.json(rows[0] || { id: insertId }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan produk' },
      { status: 500 }
    );
  }
}