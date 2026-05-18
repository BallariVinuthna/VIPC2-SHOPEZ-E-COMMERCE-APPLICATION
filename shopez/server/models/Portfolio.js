const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    holdings: [
      {
        stock: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Stock',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 0,
        },
        averagePrice: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    totalInvested: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
