const express = require('express');
const router = express.Router();
const {
    createQueue,
    getTodayQueues,
    updateQueueStatus
} = require('../controllers/queueController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, createQueue);
router.get('/', verifyToken, getTodayQueues);
router.put('/:id/status', verifyToken, updateQueueStatus);

module.exports = router;