const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const goalRoutes = require('./goalRoutes');

router.use('/user', userRoutes);
router.use('/', goalRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API fonctionnelle',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
