
const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

router.get('/goals', goalController.getUserGoals);
router.get('/goals/:id', goalController.getGoal);
router.post('/goals', goalController.createGoal);
router.put('/goals/:id', goalController.updateGoal);
router.post('/goals/activity', goalController.logActivity);
router.get('/goals/monthly', goalController.getMonthlyGoals);
router.post('/goals/sync', goalController.syncDevice);

module.exports = router;