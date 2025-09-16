import { connectDB, sql } from '../../db.js';

export async function addReportToDB(dto) {
  try {
    const pool = await connectDB();

    const query = `
      INSERT INTO reports (ReporterID, ReportedUserID, Reason, ReportDate)
      VALUES (@ReporterID, @ReportedUserID, @Reason, @ReportDate);
    `;

    const request = pool.request();
    request.input('ReporterID', sql.Int, dto.reporterID);
    request.input('ReportedUserID', sql.Int, dto.reportedUserID);
    request.input('Reason', dto.reason);
    request.input('ReportDate', dto.reportDate);


    const result = await request.query(query);
    return result.rowsAffected[0] > 0;

  } catch (error) {
    console.error('SQL Add Report Error:', error);
    throw new Error('Failed to add report');
  }
}
