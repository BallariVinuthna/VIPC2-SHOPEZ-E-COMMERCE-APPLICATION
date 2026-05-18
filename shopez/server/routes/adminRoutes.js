const express = require('express');
const router = express.Router();
const {
  getUsers,
  addStock,
  updateStock,
  deleteStock,
  getAllTransactions,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.post('/stocks', protect, admin, addStock);
router.put('/stocks/:id', protect, admin, updateStock);
router.delete('/stocks/:id', protect, admin, deleteStock);
router.get('/transactions', protect, admin, getAllTransactions);

module.exports = router;
