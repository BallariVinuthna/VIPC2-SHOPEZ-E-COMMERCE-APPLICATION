const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, totalPrice, mobile, paymentMethod, productRequirements } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // 1. Check if user has sufficient balance
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Only check balance if using Virtual Balance
    const isVirtualWallet = !paymentMethod || paymentMethod === 'Virtual Balance';
    if (isVirtualWallet && user.balance < totalPrice) {
      res.status(400);
      throw new Error('Insufficient virtual balance to complete this purchase');
    }

    // 2. Validate product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product ${item.name} not found`);
      }
      if (product.countInStock < item.qty) {
        res.status(400);
        throw new Error(`Insufficient stock for ${item.name}. Available: ${product.countInStock}`);
      }
    }

    // 3. Deduct balance and update user (only if paying via Virtual Balance)
    if (isVirtualWallet) {
      user.balance -= totalPrice;
      await user.save();
    }

    // 4. Create the order
    const order = new Order({
      orderItems,
      user: req.user._id,
      userId: req.user._id,
      username: user.name || user.username,
      email: user.email,
      mobile: mobile || '',
      shippingAddress,
      address: shippingAddress.address,
      pincode: shippingAddress.postalCode,
      paymentMethod: paymentMethod || 'Virtual Balance',
      totalPrice,
      isPaid: paymentMethod !== 'Cash On Delivery',
      paidAt: paymentMethod !== 'Cash On Delivery' ? Date.now() : undefined,
      description: productRequirements || '',
      size: orderItems[0]?.size || 'M',
      quantity: orderItems.reduce((acc, item) => acc + item.qty, 0),
      price: totalPrice,
      discount: orderItems[0]?.discount || 0
    });

    const createdOrder = await order.save();

    // 5. Update stock of products
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.qty },
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if user is admin or the owner of the order
      if (req.user.role === 'ADMIN' || order.user.toString() === req.user._id.toString()) {
        res.json(order);
      } else {
        res.status(401);
        throw new Error('Not authorized to view this order');
      }
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  getOrderById,
};
