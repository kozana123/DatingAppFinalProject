import { connectDB, sql } from '../../db.js';

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
    const pool = await connectDB();

    const query = `
      INSERT INTO matches (User1ID, User2ID, MatchStatus)
      VALUES (@User1ID, @User2ID, @MatchStatus);
    `;

    const request = pool.request();
    request.input('User1ID', sql.Int, dto.User1ID);
    request.input('User2ID', sql.Int, dto.User2ID);
    request.input('MatchStatus', sql.Bit, dto.MatchStatus);

    const result = await request.query(query);
    return result.rowsAffected[0] > 0;

  } catch (error) {
    console.error('SQL Add Match Error:', error);
    throw new Error('Failed to add match');
  }
}


export async function getMatchedUsersFromDB(userId) {
  try {

    const pool = await connectDB();
    const request = pool.request();
    request.input('UserId', sql.Int, userId);

    const result = await request.execute('GetMatchedUsers');

    // result.recordset זה מערך התוצאות
    return result.recordset;

  } catch (error) {
    console.error('SQL Get Matched Users Error:', error);
    throw new Error('Failed to get matched users');
  }
}

export async function unMatchUserFromDB(userId, unmatchUserId) {
  try {
    const pool = await connectDB();

    const query = `
      UPDATE Matches
      SET MatchStatus = 0
      WHERE MatchStatus = 1
        AND (
          (User1ID = @UserID AND User2ID = @OtherUserID)
          OR
          (User1ID = @OtherUserID AND User2ID = @UserID)
        );
    `;

    const request = pool.request();
    request.input('UserID', sql.Int, userId);
    request.input('OtherUserID', sql.Int, unmatchUserId);


    const result = await request.query(query);
    return result.rowsAffected[0] > 0;

  } catch (error) {
    console.error('SQL unMatched User Error:', error);
    throw new Error('Failed to unMatche user');
  }
}
