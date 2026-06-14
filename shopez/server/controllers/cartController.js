const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCartItems = async (req, res, next) => {
  try {
    const items = await Cart.find({ userId: req.user._id }).populate('product');
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, size } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if item already in cart for user
    let cartItem = await Cart.findOne({ userId: req.user._id, product: productId, size: size || 'M' });

    if (cartItem) {
      cartItem.quantity += Number(quantity || 1);
      await cartItem.save();
    } else {
      cartItem = new Cart({
        userId: req.user._id,
        product: productId,
        title: product.name,
        description: product.description,
        ratings: product.ratings || 0,
        quantity: Number(quantity || 1),
        size: size || 'M',
        price: product.price,
        discount: product.discount || 0,
      });
      await cartItem.save();
    }

    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity or size
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity, size } = req.body;
    const cartItem = await Cart.findOne({ _id: req.params.id, userId: req.user._id });

    if (cartItem) {
      if (quantity !== undefined) cartItem.quantity = Number(quantity);
      if (size !== undefined) cartItem.size = size;

      const updated = await cartItem.save();
      res.json(updated);
    } else {
      res.status(404);
      throw new Error('Cart item not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete cart item
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const cartItem = await Cart.findOne({ _id: req.params.id, userId: req.user._id });

    if (cartItem) {
      await Cart.deleteOne({ _id: req.params.id });
      res.json({ message: 'Item removed from cart' });
    } else {
      res.status(404);
      throw new Error('Cart item not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
};
