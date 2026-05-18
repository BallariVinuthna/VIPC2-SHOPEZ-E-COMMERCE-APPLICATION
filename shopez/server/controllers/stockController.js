const Stock = require('../models/Stock');

// @desc    Fetch all stocks
// @route   GET /api/stocks
// @access  Public
const getStocks = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { symbol: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const stocks = await Stock.find({ ...keyword });
    res.json(stocks);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single stock
// @route   GET /api/stocks/:id
// @access  Public
const getStockById = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (stock) {
      res.json(stock);
    } else {
      res.status(404);
      throw new Error('Stock not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStocks,
  getStockById,
};
