const pool = require('../config/db');

const createReport = async (req, res) => {
  try {
    const { title, description, incident_date, location, crime_type } = req.body;

    if (!title || !description || !incident_date || !location || !crime_type) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const result = await pool.query(
      `INSERT INTO crime_reports (user_id, title, description, incident_date, location, crime_type, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') 
       RETURNING *`,
      [req.user.id, title, description, incident_date, location, crime_type]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getReports = async (req, res) => {
  try {
    const { status, crime_type } = req.query;
    let query = `
      SELECT cr.*, u.name as user_name, u.email as user_email,
             au.name as assigned_to_name
      FROM crime_reports cr
      LEFT JOIN users u ON cr.user_id = u.id
      LEFT JOIN users au ON cr.assigned_to = au.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (req.user.role === 'citizen') {
      query += ` AND cr.user_id = $${paramIndex}`;
      params.push(req.user.id);
      paramIndex++;
    } else if (req.user.role === 'police') {
      query += ` AND (cr.assigned_to = $${paramIndex} OR cr.status = 'verified')`;
      params.push(req.user.id);
      paramIndex++;
    }

    if (status) {
      query += ` AND cr.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (crime_type) {
      query += ` AND cr.crime_type = $${paramIndex}`;
      params.push(crime_type);
      paramIndex++;
    }

    query += ' ORDER BY cr.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT cr.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
              au.name as assigned_to_name
       FROM crime_reports cr
       LEFT JOIN users u ON cr.user_id = u.id
       LEFT JOIN users au ON cr.assigned_to = au.id
       WHERE cr.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const report = result.rows[0];

    if (req.user.role === 'citizen' && report.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this report' });
    }

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assigned_to } = req.body;

    const validStatuses = ['pending', 'verified', 'in-progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const checkResult = await pool.query('SELECT * FROM crime_reports WHERE id = $1', [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    let query = 'UPDATE crime_reports SET status = $1, updated_at = CURRENT_TIMESTAMP';
    const params = [status];
    let paramIndex = 2;

    if (assigned_to) {
      query += `, assigned_to = $${paramIndex}`;
      params.push(assigned_to);
      paramIndex++;
    }

    query += ` WHERE id = $${paramIndex} RETURNING *`;
    params.push(id);

    const result = await pool.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM crime_reports WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCrimeTypes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM crime_types ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStatistics = async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM crime_reports');
    const statusResult = await pool.query('SELECT status, COUNT(*) as count FROM crime_reports GROUP BY status');
    const typeResult = await pool.query('SELECT crime_type, COUNT(*) as count FROM crime_reports GROUP BY crime_type ORDER BY count DESC LIMIT 10');

    res.json({
      total: parseInt(totalResult.rows[0].total),
      byStatus: statusResult.rows,
      byType: typeResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  getCrimeTypes,
  getStatistics
};
