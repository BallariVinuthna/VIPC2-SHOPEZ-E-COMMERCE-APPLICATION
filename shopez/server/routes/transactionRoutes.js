const express = require('express');
const router = express.Router();
const { buyStock, sellStock, getUserTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/buy', protect, buyStock);
router.post('/sell', protect, sellStock);
router.get('/', protect, getUserTransactions);

module.exports = router;
