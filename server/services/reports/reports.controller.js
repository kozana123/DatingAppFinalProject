import Report from './reports.model.js';

export async function addReport(req, res) {
  try {
    const dto = req.body;
    
    if (!dto || !dto.ReporterID || !dto.ReportedUserID || !dto.Reason || !dto.ReportDate) {
      return res.status(400).json({ message: 'Missing report data' });
    }

    const report = new Report(dto.ReporterID, dto.ReportedUserID, dto.Reason, dto.ReportDate );
    console.log(report);
    const success = await report.addReport();

    if (success) {
      res.json({ message: 'Report added successfully.'});
    } else {
      res.status(500).json({ message: 'Failed to insert report.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}