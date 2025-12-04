
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/user', userController.getProfile);
router.put('/user', userController.updateProfile);
router.get('/user/stats', userController.getStats);
router.post('/user/invite', userController.inviteFriend);
router.get('/user/badges', userController.getBadges);

module.exports = router;