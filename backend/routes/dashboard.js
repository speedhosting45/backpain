const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/auth');

// GET /api/dashboard
router.get('/', requireAuth, getDashboard);

module.exports = router;
