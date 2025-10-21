import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT 
        p.id,
        CONCAT('PO-', DATE_FORMAT(p.tanggal, '%Y%m%d'), '-', LPAD(p.id, 6, '0')) AS no_faktur,
        COALESCE(s.nama, '') AS nama_pemasok,
        p.tanggal AS tanggal,
        COALESCE(p.grand_total, p.total, 0) AS total,
        'diproses' AS status,
        COALESCE(p.dibuat_pada, p.tanggal) AS created_at
       FROM pembelian p
       LEFT JOIN pemasok s ON p.id_pemasok = s.id
       ORDER BY p.tanggal DESC`
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/pembelian:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pembelian' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    const data = await request.json();
    const { supplierId, items, notes } = data;

    if (!items || !items.length || !supplierId) {
      return NextResponse.json(
        { error: 'Pemasok dan minimal satu item harus diisi' },
        { status: 400 }
      );
    }

    const total = items.reduce((sum: number, it: any) => sum + (Number(it.quantity) * Number(it.unitPrice)), 0);
    const diskon = Number(data.discount || 0);
    const pajak = Number(data.tax || 0);
    const grandTotal = total - diskon + pajak;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Insert header
    const [headerResult] = await connection.query(
      `INSERT INTO pembelian (tanggal, id_pemasok, total, diskon, pajak, grand_total, catatan)
       VALUES (NOW(), ?, ?, ?, ?, ?, ?)`,
      [supplierId, total, diskon, pajak, grandTotal, notes || null]
    ) as [any, any];

    const purchaseId = headerResult.insertId;

    // Insert items and update stock + log stock mutation
    for (const it of items) {
      const qty = Number(it.quantity);
      const harga = Number(it.unitPrice);
      const subtotal = qty * harga;

      await connection.query(
        `INSERT INTO pembelian_item (id_pembelian, id_produk, id_batch, qty, harga, subtotal)
         VALUES (?, ?, NULL, ?, ?, ?)`,
        [purchaseId, it.productId, qty, harga, subtotal]
      );

      await connection.query(
        `UPDATE produk SET stok = stok + ? WHERE id = ?`,
        [qty, it.productId]
      );

      await connection.query(
        `INSERT INTO stok_mutasi (id_produk, id_batch, tipe, qty, referensi_tipe, referensi_id, keterangan)
         VALUES (?, NULL, 'IN', ?, 'PEMBELIAN', ?, 'Pembelian')`,
        [it.productId, qty, purchaseId]
      );
    }

    await connection.commit();

    return NextResponse.json({ id: purchaseId, total, diskon, pajak, grandTotal }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/pembelian:', error);
    if (connection) {
      try { await connection.rollback(); } catch {}
    }
    return NextResponse.json({ error: 'Gagal menyimpan transaksi pembelian' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
