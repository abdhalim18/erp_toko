import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get date range for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Format date to YYYY-MM-DD
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Get sales data for the last 6 months
    const salesData = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(tanggal, '%b') as month,
        COALESCE(SUM(total), 0) as total_sales,
        COUNT(*) as total_orders
      FROM (
        SELECT 
          LAST_DAY(DATE_SUB(CURDATE(), INTERVAL n MONTH)) as tanggal,
          0 as total
        FROM (
          SELECT 0 as n UNION ALL SELECT 1 UNION ALL SELECT 2 
          UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
        ) months
        
        UNION ALL
        
        SELECT 
          LAST_DAY(tanggal) as tanggal,
          SUM(total) as total
        FROM penjualan
        WHERE 
          status = 'SELESAI' AND
          tanggal >= ${formatDate(sixMonthsAgo)}
        GROUP BY LAST_DAY(tanggal)
      ) t
      GROUP BY LAST_DAY(tanggal), DATE_FORMAT(tanggal, '%b')
      ORDER BY LAST_DAY(tanggal)
    `;

    // Get top selling products
    const topProducts = await prisma.$queryRaw`
      SELECT 
        p.nama as name,
        SUM(dj.jumlah) as quantity,
        SUM(dj.subtotal) as total_sales
      FROM detail_penjualan dj
      JOIN produk p ON dj.id_produk = p.id
      JOIN penjualan j ON dj.id_penjualan = j.id
      WHERE j.status = 'SELESAI'
      GROUP BY p.id, p.nama
      ORDER BY total_sales DESC
      LIMIT 5
    `;

    // Get summary data
    const [summary] = await prisma.$queryRaw`
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'SELESAI' THEN total ELSE 0 END), 0) as total_sales,
        COUNT(CASE WHEN status = 'SELESAI' THEN 1 END) as total_orders,
        COALESCE(AVG(CASE WHEN status = 'SELESAI' THEN total END), 0) as avg_order_value
      FROM penjualan
      WHERE tanggal >= ${formatDate(sixMonthsAgo)}
    `;

    // Format the response
    const report = {
      totalSales: Number(summary.total_sales) || 0,
      totalOrders: Number(summary.total_orders) || 0,
      averageOrderValue: Number(summary.avg_order_value) || 0,
      salesData: salesData.map((item: any) => ({
        month: item.month,
        sales: Number(item.total_sales) || 0,
        orders: Number(item.total_orders) || 0
      })),
      topProducts: topProducts.map((item: any) => ({
        name: item.name,
        quantity: Number(item.quantity) || 0,
        sales: Number(item.total_sales) || 0
      }))
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error in GET /api/laporan:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data laporan' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
