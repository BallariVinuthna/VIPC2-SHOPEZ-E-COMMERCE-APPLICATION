const mongoose = require('mongoose');

const stockSchema = mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    previousClose: {
      type: Number,
      required: true,
    },
    dailyChange: {
      type: Number,
      default: 0,
    },
    dailyChangePercent: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    historicalData: [
      {
        date: { type: Date },
        price: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate daily changes
stockSchema.pre('save', function (next) {
  this.dailyChange = this.currentPrice - this.previousClose;
  this.dailyChangePercent = (this.dailyChange / this.previousClose) * 100;
  return next();
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
