// routes/analytics.js
const express = require('express');
const router = express.Router();
const { 
  recordOfferOrder, 
  getOfferAnalytics 
} = require('../controllers/analyticsController');

// Record an order with offer
router.post('/offers/:offerId/orders', recordOfferOrder);

// Get analytics data
router.get('/analytics/offers', getOfferAnalytics);

module.exports = router;