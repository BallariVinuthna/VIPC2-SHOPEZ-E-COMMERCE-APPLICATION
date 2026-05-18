const Transaction = require('../models/Transaction');
const Stock = require('../models/Stock');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

// @desc    Buy stock
// @route   POST /api/transactions/buy
// @access  Private
const buyStock = async (req, res, next) => {
  console.log('buyStock called. next type:', typeof next);
  try {
    const { stockId, quantity } = req.body;

    const stock = await Stock.findById(stockId);
    if (!stock) {
      res.status(404);
      throw new Error('Stock not found');
    }

    const user = await User.findById(req.user._id);
    const totalAmount = stock.currentPrice * quantity;

    if (user.balance < totalAmount) {
      res.status(400);
      throw new Error('Insufficient balance');
    }

    // Deduct balance
    user.balance -= totalAmount;
    await user.save();

    // Record transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      stock: stockId,
      type: 'BUY',
      quantity,
      price: stock.currentPrice,
      totalAmount,
    });

    // Update Portfolio
    let portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio) {
      portfolio = await Portfolio.create({ user: req.user._id, holdings: [] });
    }

    const existingHoldingIndex = portfolio.holdings.findIndex(
      (h) => h.stock.toString() === stockId.toString()
    );

    if (existingHoldingIndex >= 0) {
      const holding = portfolio.holdings[existingHoldingIndex];
      const newQuantity = holding.quantity + quantity;
      const newTotalCost = holding.quantity * holding.averagePrice + totalAmount;
      holding.averagePrice = newTotalCost / newQuantity;
      holding.quantity = newQuantity;
      portfolio.markModified('holdings');
    } else {
      portfolio.holdings.push({
        stock: stockId,
        quantity,
        averagePrice: stock.currentPrice,
      });
    }

    portfolio.totalInvested += totalAmount;
    await portfolio.save();

    res.status(201).json({
      message: 'Stock purchased successfully',
      transaction,
      balance: user.balance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sell stock
// @route   POST /api/transactions/sell
// @access  Private
const sellStock = async (req, res, next) => {
  try {
    const { stockId, quantity } = req.body;

    const portfolio = await Portfolio.findOne({ user: req.user._id });

    if (!portfolio || portfolio.holdings.length === 0) {
      res.status(400);
      throw new Error("You don't own any stocks yet! Buy some stocks to start your portfolio.");
    }

    const holdingIndex = portfolio.holdings.findIndex(
      (h) => h.stock.toString() === stockId.toString()
    );

    if (holdingIndex === -1 || portfolio.holdings[holdingIndex].quantity < quantity) {
      res.status(400);
      throw new Error('Insufficient stock quantity in portfolio');
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      res.status(404);
      throw new Error('Stock not found');
    }

    const totalAmount = stock.currentPrice * quantity;

    // Add balance
    const user = await User.findById(req.user._id);
    user.balance += totalAmount;
    await user.save();

    // Record transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      stock: stockId,
      type: 'SELL',
      quantity,
      price: stock.currentPrice,
      totalAmount,
    });

    // Update Portfolio
    const holding = portfolio.holdings[holdingIndex];
    // Reduce total invested proportionally to what was sold
    const costBasisToReduce = holding.averagePrice * quantity;
    portfolio.totalInvested -= costBasisToReduce;

    holding.quantity -= quantity;
    portfolio.markModified('holdings');

    if (holding.quantity === 0) {
      portfolio.holdings.splice(holdingIndex, 1);
    }

    await portfolio.save();

    res.status(201).json({
      message: 'Stock sold successfully',
      transaction,
      balance: user.balance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
const getUserTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate('stock', 'symbol name')
      .sort('-createdAt');
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  buyStock,
  sellStock,
  getUserTransactions,
};
