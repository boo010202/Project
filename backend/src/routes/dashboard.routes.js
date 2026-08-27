const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.use(isAuthenticated);

router.get('/summary', dashboardController.getSummary);
router.get('/by-category', dashboardController.getByCategory);
router.get('/by-budget', dashboardController.getByBudget);
router.get('/compare', dashboardController.getCompare);

module.exports = router;
