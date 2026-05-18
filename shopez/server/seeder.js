const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Stock = require('./models/Stock');
const Portfolio = require('./models/Portfolio');
const Transaction = require('./models/Transaction');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const stocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 150.0,
    previousClose: 148.5,
    category: 'Technology',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 2800.0,
    previousClose: 2750.0,
    category: 'Technology',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    currentPrice: 700.0,
    previousClose: 710.0,
    category: 'Automotive',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    currentPrice: 3300.0,
    previousClose: 3250.0,
    category: 'E-commerce',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 300.0,
    previousClose: 298.0,
    category: 'Technology',
  },
];

const importData = async () => {
  try {
    await Stock.deleteMany();
    await Transaction.deleteMany();
    await Portfolio.deleteMany();
    // Not deleting users to preserve accounts, but you could if you want a full reset

    await Stock.insertMany(stocks);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Stock.deleteMany();
    await Transaction.deleteMany();
    await Portfolio.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
