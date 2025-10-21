import pool from './lib/db.ts';

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');

    // Test the connection
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to the database');

    // Test if database exists and get info
    const [rows] = await connection.execute('SELECT DATABASE() as current_db');
    console.log('📊 Current database:', rows[0].current_db);

    // Test if we can query the kategori table
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = 'erp_toko'
    `);

    console.log('📋 Available tables in erp_toko database:');
    tables.forEach((table) => {
      console.log(`  - ${table.TABLE_NAME}`);
    });

    // Release the connection
    connection.release();
    console.log('✅ Database connection test completed successfully');

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the test
testDatabaseConnection();
