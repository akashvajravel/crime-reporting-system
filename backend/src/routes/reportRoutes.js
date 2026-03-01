const express = require('express');
const router = express.Router();
const { 
  createReport, 
  getReports, 
  getReportById, 
  updateReportStatus, 
  deleteReport,
  getCrimeTypes,
  getStatistics
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createReport);
router.get('/', protect, getReports);
router.get('/types', getCrimeTypes);
router.get('/statistics', protect, authorize('admin', 'police'), getStatistics);
router.get('/:id', protect, getReportById);
router.put('/:id', protect, authorize('admin', 'police'), updateReportStatus);
router.delete('/:id', protect, authorize('admin'), deleteReport);

module.exports = router;
