import sql from 'mssql';

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 10000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

/**
 * Connect to the database (singleton connection)
 */
export async function connectDB() {
  if (!pool) {
    try {
      pool = await sql.connect(sqlConfig);
      console.log('✅ Database connected');
    } catch (err) {
      console.error('❌ Database connection failed:', err);
      throw err;
    }
  }
  return pool;
}

/**
 * Close the database connection
 */
export async function closeDB() {
  if (pool) {
    try {
      await pool.close();
      console.log('🔌 Database connection closed');
    } catch (err) {
      console.error('❌ Error closing database connection:', err);
    } finally {
      pool = null;
    }
  }
}

export { sql };