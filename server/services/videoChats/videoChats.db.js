import { connectDB, sql } from '../../db.js';

export async function addChatSessionToDB(dto) {
  try {
    const pool = await connectDB();

    const query = `
      INSERT INTO ChatSessions (CallDate, CallDurationMinutes, IsMatch)
      VALUES (@CallDate, @CallDurationMinutes, @IsMatch);
    `;

    const request = pool.request();
    request.input('CallDate', sql.DateTime, dto.CallDate);
    request.input('CallDurationMinutes', sql.Int, dto.CallDurationMinutes);
    request.input('IsMatch', sql.Bit, dto.IsMatch);

    const result = await request.query(query);
    return result.rowsAffected[0] > 0;

  } catch (error) {
    console.error('SQL Add ChatSession Error:', error);
    throw new Error('Failed to add chat session');
  }
}