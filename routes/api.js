
const express = require('express');
const router = express.Router();


const goalRoutes = require('./goalRoutes');
const userRoutes = require('./userRoutes');


router.use(goalRoutes);
router.use(userRoutes);


router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API fonctionnelle',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;