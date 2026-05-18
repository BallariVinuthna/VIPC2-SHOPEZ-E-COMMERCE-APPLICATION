const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id }).populate(
      'holdings.stock',
      'symbol name currentPrice dailyChangePercent'
    );

    if (!portfolio) {
      return res.json({ holdings: [], totalInvested: 0, currentMarketValue: 0, netProfitLoss: 0 });
    }

    let currentMarketValue = 0;
    
    // Calculate current market value
    portfolio.holdings.forEach((holding) => {
      if (holding.stock && holding.stock.currentPrice) {
        currentMarketValue += holding.quantity * holding.stock.currentPrice;
      }
    });

    const netProfitLoss = currentMarketValue - portfolio.totalInvested;

    res.json({
      holdings: portfolio.holdings,
      totalInvested: portfolio.totalInvested,
      currentMarketValue,
      netProfitLoss,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPortfolio,
};
