import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT 
         p.id,
         CONCAT('INV-', DATE_FORMAT(p.tanggal, '%Y%m%d'), '-', LPAD(p.id, 6, '0')) AS no_faktur,
         'Pelanggan Umum' AS nama_pelanggan,
         p.tanggal AS tanggal,
         COALESCE(p.grand_total, p.total, 0) AS total,
         'SELESAI' AS status,
         COALESCE(p.dibuat_pada, p.tanggal) AS created_at,
         p.diperbarui_pada AS updated_at
       FROM penjualan p
       ORDER BY p.tanggal DESC`
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/penjualan:', error);
    return NextResponse.json({ error: 'Gagal mengambil data penjualan' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    const data = await request.json();
    const { items, userId, notes } = data;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, error: 'Minimal satu item harus ditambahkan' }, { status: 400 });
    }

    const total = items.reduce((sum: number, it: any) => sum + (Number(it.quantity) * Number(it.unitPrice)), 0);
    const diskon = Number(data.discount || 0);
    const pajak = Number(data.tax || 0);
    const grandTotal = total - diskon + pajak;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [headerResult] = await connection.query(
      `INSERT INTO penjualan (tanggal, id_pengguna, total, diskon, pajak, grand_total, catatan)
       VALUES (NOW(), ?, ?, ?, ?, ?, ?)`,
      [userId || null, total, diskon, pajak, grandTotal, notes || null]
    ) as [any, any];

    const saleId = headerResult.insertId;

    for (const it of items) {
      const qty = Number(it.quantity);
      const harga = Number(it.unitPrice);
      const subtotal = qty * harga;

      await connection.query(
        `INSERT INTO penjualan_item (id_penjualan, id_produk, id_batch, qty, harga, subtotal)
         VALUES (?, ?, NULL, ?, ?, ?)`,
        [saleId, it.productId, qty, harga, subtotal]
      );

      await connection.query(
        `UPDATE produk SET stok = stok - ? WHERE id = ?`,
        [qty, it.productId]
      );

      await connection.query(
        `INSERT INTO stok_mutasi (id_produk, id_batch, tipe, qty, referensi_tipe, referensi_id, keterangan)
         VALUES (?, NULL, 'OUT', ?, 'PENJUALAN', ?, 'Penjualan')`,
        [it.productId, qty, saleId]
      );
    }

    await connection.commit();

    return NextResponse.json({ success: true, message: 'Transaksi berhasil disimpan', saleId }, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    if (connection) {
      try { await connection.rollback(); } catch {}
    }
    return NextResponse.json({ success: false, error: 'Gagal menyimpan transaksi' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
