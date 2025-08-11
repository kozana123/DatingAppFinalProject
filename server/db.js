import sql from 'mssql';

export default class DB {

  
  static sqlConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    trustedConnection: true,  // This enables Windows Authentication
    // enableArithAbort: true,   // Recommended for newer versions
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
  }

  static async selectData(query) {
    try {
      const pool = await sql.connect(DB.sqlConfig);
      const result = await pool.request().query(query);
      return result.recordset;
    } catch (err) {
      console.log(err);
    }
  }

  static async insert(procName, data) {
    try {
      const pool = await sql.connect(DB.sqlConfig);

      let request = new sql.Request();
      
      for (const [key, value] of Object.entries(data)) {
        request.input(key, value)
      }

      return await pool.request(request).execute(procName);

    } catch (err) {
      console.log(err);
    }
  }
}
  console.log(process.env.DB_SERVER, process.env.DB_NAME);

const connectToDb = async () => {
  try {
    pool = await sql.connect(config);
    console.log('Connected to MSSQL database using Windows Authentication');
  } catch (err) {
    console.error('Error connecting to MSSQL database:', err);
    console.error('Make sure:');
    console.error('1. SQL Server is configured for Windows Authentication');
    console.error('2. Your Windows user has access to the database');
    console.error('3. SQL Server is running and accessible');
    throw err;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectToDb() first.');
  }
  return pool;
};

const closeConnection = async () => {
  try {
    if (pool) {
      await pool.close();
      console.log('Database connection closed');
    }
  } catch (err) {
    console.error('Error closing database connection:', err);
  }
};

// Initialize connection
// connectToDb();