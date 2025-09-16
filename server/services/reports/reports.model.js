import { addReportToDB } from './reports.db.js';

export default class Report {
  constructor(ReporterID, ReportedUserID, Reason, ReportDate ) {
    this.reporterID = ReporterID;
    this.reportedUserID = ReportedUserID;
    this.reason = Reason;
    this.reportDate = ReportDate;
  }

  async addReport() {
    return await addReportToDB(this);
  }
}
