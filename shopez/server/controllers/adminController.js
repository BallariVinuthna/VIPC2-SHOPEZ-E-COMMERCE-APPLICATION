const User = require('../models/User');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Add new stock
// @route   POST /api/admin/stocks
// @access  Private/Admin
const addStock = async (req, res, next) => {
  try {
    const stock = new Stock(req.body);
    const createdStock = await stock.save();
    res.status(201).json(createdStock);
  } catch (error) {
    next(error);
  }
};

// @desc    Update stock
// @route   PUT /api/admin/stocks/:id
// @access  Private/Admin
const updateStock = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (stock) {
      stock.name = req.body.name || stock.name;
      stock.symbol = req.body.symbol || stock.symbol;
      stock.currentPrice = req.body.currentPrice || stock.currentPrice;
      stock.previousClose = req.body.previousClose || stock.previousClose;
      stock.category = req.body.category || stock.category;

      const updatedStock = await stock.save();
      res.json(updatedStock);
    } else {
      res.status(404);
      throw new Error('Stock not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete stock
// @route   DELETE /api/admin/stocks/:id
// @access  Private/Admin
const deleteStock = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (stock) {
      await Stock.deleteOne({ _id: req.params.id });
      res.json({ message: 'Stock removed' });
    } else {
      res.status(404);
      throw new Error('Stock not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({})
      .populate('user', 'id name email')
      .populate('stock', 'id name symbol')
      .sort('-createdAt');
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  addStock,
  updateStock,
  deleteStock,
  getAllTransactions,
};
