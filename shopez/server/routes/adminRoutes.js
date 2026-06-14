const express = require('express');
const router = express.Router();
const {
  getUsers,
  addStock,
  updateStock,
  deleteStock,
  getAllTransactions,
  updateBanner,
  addCategory,
  getAdminConfig,
} = require('../controllers/adminController');
const { getOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/config', getAdminConfig);
router.get('/users', protect, admin, getUsers);
router.post('/stocks', protect, admin, addStock);
router.put('/stocks/:id', protect, admin, updateStock);
router.delete('/stocks/:id', protect, admin, deleteStock);
router.get('/transactions', protect, admin, getAllTransactions);

router.post('/banner', protect, admin, updateBanner);
router.post('/category', protect, admin, addCategory);
router.get('/orders', protect, admin, getOrders);

module.exports = router;
