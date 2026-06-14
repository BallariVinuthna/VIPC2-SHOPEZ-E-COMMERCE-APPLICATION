const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Stock = require('./models/Stock');
const Portfolio = require('./models/Portfolio');
const Transaction = require('./models/Transaction');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const stocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 12500.0,
    previousClose: 12400.0,
    category: 'Technology',
    dailyChange: 100.0,
    dailyChangePercent: 0.81,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 232000.0,
    previousClose: 230000.0,
    category: 'Technology',
    dailyChange: 2000.0,
    dailyChangePercent: 0.87,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    currentPrice: 58000.0,
    previousClose: 59000.0,
    category: 'Automotive',
    dailyChange: -1000.0,
    dailyChangePercent: -1.69,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    currentPrice: 274000.0,
    previousClose: 270000.0,
    category: 'E-commerce',
    dailyChange: 4000.0,
    dailyChangePercent: 1.48,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 24800.0,
    previousClose: 24500.0,
    category: 'Technology',
    dailyChange: 300.0,
    dailyChangePercent: 1.22,
  },
];

const products = [
  {
    name: 'iPhone 15 Pro Max',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60',
    description: 'The ultimate iPhone featuring a strong and light titanium design, new Action button, powerful camera upgrades, and A17 Pro chip.',
    category: 'Electronics',
    price: 159900.00,
    countInStock: 15,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    description: 'Industry-leading noise-canceling headphones with premium sound quality, smart listening controls, and long-lasting battery life.',
    category: 'Electronics',
    price: 29990.00,
    countInStock: 25,
  },
  {
    name: 'MacBook Pro 16-inch M3 Max',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
    description: 'The most advanced laptop processor ever built for professional workflows, featuring stunning Liquid Retina XDR display.',
    category: 'Electronics',
    price: 249900.00,
    countInStock: 8,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    description: 'Tenkeyless layout mechanical keyboard with customizable RGB backlighting, custom red switches, and durable aluminum top plate.',
    category: 'Accessories',
    price: 9999.00,
    countInStock: 40,
  },
  {
    name: 'Ergonomic Office Chair',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=500&auto=format&fit=crop&q=60',
    description: 'Premium mesh ergonomic chair featuring high back, adjustable lumbar support, 3D armrests, and dynamic tilt-lock controls.',
    category: 'Furniture',
    price: 18500.00,
    countInStock: 12,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60',
    description: 'Experience artificial intelligence in your palm. Featuring an outstanding camera array, titanium frame, and integrated S-Pen.',
    category: 'Electronics',
    price: 129999.00,
    countInStock: 10,
  },
  {
    name: 'iPad Air M2',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60',
    description: 'Light, thin, and supercharged by the Apple M2 chip. Features a liquid retina display, landscape stereo speakers, and all-day battery life.',
    category: 'Electronics',
    price: 59900.00,
    countInStock: 15,
  },
  {
    name: 'OnePlus Nord CE4',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60',
    description: 'Powerful performance with Snapdragon chipset, gorgeous AMOLED display, and blazing-fast SuperVOOC charging.',
    category: 'Electronics',
    price: 24999.00,
    countInStock: 20,
  },
  {
    name: 'Canon EOS R10 Mirrorless Camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60',
    description: 'The perfect content creation camera. Capture stunning 4K videos and 24.2 MP high-resolution photos with advanced autofocus.',
    category: 'Electronics',
    price: 80500.00,
    countInStock: 6,
  },
  {
    name: 'Kindle Paperwhite (16 GB)',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=500&auto=format&fit=crop&q=60',
    description: 'Now with a 6.8-inch display, thinner borders, adjustable warm light, and up to 10 weeks of battery life. Waterproof reading.',
    category: 'Electronics',
    price: 14999.00,
    countInStock: 30,
  },
  {
    name: 'Dyson V8 Absolute Vacuum Cleaner',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&auto=format&fit=crop&q=60',
    description: 'Cordless, hassle-free cleaning with powerful suction. Up to 40 minutes of run time, easily converts to a handheld vacuum.',
    category: 'Home Appliances',
    price: 39900.00,
    countInStock: 10,
  },
  {
    name: 'Boat Stone 350 Portable Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60',
    description: '10W stereo sound speaker with IPX7 water resistance, 12 hours of playtime, and multiple connectivity modes.',
    category: 'Accessories',
    price: 1499.00,
    countInStock: 50,
  },
  {
    name: 'Fastrack Reflex Beat+ Smartwatch',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60',
    description: 'Features a large display screen, 24/7 heart rate monitoring, sleep tracker, multiple sports modes, and up to 7 days battery life.',
    category: 'Accessories',
    price: 2999.00,
    countInStock: 45,
  },
  {
    name: "Levi's Men's 511 Slim Fit Jeans",
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60',
    description: 'Classic slim-fit stretch denim designed for comfort and modern style. Durable stitching and premium fabric.',
    category: 'Clothing',
    price: 2599.00,
    countInStock: 25,
  },
  {
    name: 'Nike Air Zoom Pegasus 40',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    description: 'A springy ride for every run. Features highly responsive Zoom Air units and an engineered mesh upper for maximum breathability.',
    category: 'Clothing',
    price: 11495.00,
    countInStock: 18,
  },
  {
    name: 'Tommy Hilfiger Leather Wallet',
    image: 'https://images.unsplash.com/photo-1627124765135-565319da77c8?w=500&auto=format&fit=crop&q=60',
    description: 'Crafted from premium genuine leather, this bifold wallet features multiple card slots, bill compartments, and a sleek passcase.',
    category: 'Accessories',
    price: 1999.00,
    countInStock: 35,
  },
  {
    name: 'Philips Air Fryer HD9200',
    image: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500&auto=format&fit=crop&q=60',
    description: 'Fry with up to 90% less fat. Rapid Air technology allows you to bake, grill, roast, and fry delicious foods healthily.',
    category: 'Home Appliances',
    price: 8999.00,
    countInStock: 15,
  },
  {
    name: 'Fujifilm Instax Mini 12 Camera',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60',
    description: 'Capture instant prints on credit-card sized Instax film. Features automatic exposure control and built-in selfie mirror.',
    category: 'Electronics',
    price: 6999.00,
    countInStock: 20,
  },
  {
    name: 'OnePlus Bullets Wireless Z2',
    image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500&auto=format&fit=crop&q=60',
    description: 'Bass-heavy neckband earphones with active noise cancellation, low latency mode, and up to 30 hours of total playback.',
    category: 'Accessories',
    price: 1999.00,
    countInStock: 40,
  },
  {
    name: 'Dell 27-inch 4K UHD Monitor',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
    description: 'Stunning 4K resolution with IPS technology, dual HDMI ports, AMD FreeSync support, and ultra-thin bezel design.',
    category: 'Electronics',
    price: 28990.00,
    countInStock: 10,
  }
];

const importData = async () => {
  try {
    await Stock.deleteMany();
    await Transaction.deleteMany();
    await Portfolio.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Admin.deleteMany();

    // Create default users (passwords will be hashed by User model pre-save hook)
    const adminUser = await User.create({
      name: 'Admin',
      username: 'admin',
      email: 'admin@shopez.com',
      password: 'admin123',
      role: 'ADMIN',
      balance: 5000000,
    });

    const regularUser = await User.create({
      name: 'Demo User',
      username: 'demouser',
      email: 'user@shopez.com',
      password: 'user123',
      role: 'USER',
      balance: 5000000,
    });

    console.log('Default accounts created:');
    console.log('  Admin  → admin@shopez.com / admin123');
    console.log('  User   → user@shopez.com  / user123');

    // Reset remaining user balances to INR scale (50 Lakhs)
    await User.updateMany(
      { _id: { $nin: [adminUser._id, regularUser._id] } },
      { balance: 5000000 }
    );

    await Stock.insertMany(stocks);
    await Product.insertMany(products);

    // Seed default admin configurations
    const adminConfig = new Admin({
      banner: 'Welcome to SHOPEZ! Your one-stop shop & stock simulator.',
      categories: ['Electronics', 'Accessories', 'Furniture', 'Clothing', 'Kitchen']
    });
    await adminConfig.save();

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
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Admin.deleteMany();
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
