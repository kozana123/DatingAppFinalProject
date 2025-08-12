import sql from 'mssql';

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};


export async function addMatchToDB(dto) {
  try {
    await sql.connect(sqlConfig);

    const query = `
      INSERT INTO matches (User1ID, User2ID, MatchStatus)
      VALUES (@User1ID, @User2ID, @MatchStatus);
    `;

    const request = new sql.Request();
    request.input('User1ID', sql.Int, dto.User1ID);
    request.input('User2ID', sql.Int, dto.User2ID);
    request.input('MatchStatus', sql.VarChar(50), dto.MatchStatus);

    const result = await request.query(query);
    return result.rowsAffected[0] > 0;

  } catch (error) {
    console.error('SQL Add Match Error:', error);
    throw new Error('Failed to add match');
  } finally {
    await sql.close();
  }
}


export async function getMatchedUsersFromDB(userId) {
  try {
    await sql.connect(sqlConfig);

    const request = new sql.Request();
    request.input('UserId', sql.Int, userId);

    const result = await request.execute('GetMatchedUsers');

    // result.recordset זה מערך התוצאות
    return result.recordset;

  } catch (error) {
    console.error('SQL Get Matched Users Error:', error);
    throw new Error('Failed to get matched users');
  } finally {
    await sql.close();
  }
}
