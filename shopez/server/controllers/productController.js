const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
  try {
    const isPaginated = req.query.page || req.query.limit;

    if (isPaginated) {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 8;
      const skip = (page - 1) * limit;

      const keyword = req.query.search
        ? {
            $or: [
              { name: { $regex: req.query.search, $options: 'i' } },
              { title: { $regex: req.query.search, $options: 'i' } },
              { category: { $regex: req.query.search, $options: 'i' } },
              { description: { $regex: req.query.search, $options: 'i' } },
            ],
          }
        : {};

      const category = req.query.category && req.query.category !== 'All'
        ? { category: { $regex: `^${req.query.category}$`, $options: 'i' } }
        : {};

      const gender = req.query.gender && req.query.gender !== 'All'
        ? { gender: { $regex: `^${req.query.gender}$`, $options: 'i' } }
        : {};

      const query = { ...keyword, ...category, ...gender };

      const total = await Product.countDocuments(query);
      const products = await Product.find(query).sort('-createdAt').skip(skip).limit(limit);

      res.json({
        products,
        page,
        pages: Math.ceil(total / limit),
        total,
      });
    } else {
      const products = await Product.find({}).sort('-createdAt');
      res.json(products);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, title, price, description, image, carousel, category, countInStock, ratings, gender, size, discount } = req.body;

    const product = new Product({
      name: name || title,
      title: title || name,
      price,
      user: req.user._id,
      image: image || (carousel && carousel[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      carousel: carousel || (image ? [image] : []),
      brand: 'Shopez',
      category,
      countInStock: countInStock || 10,
      numReviews: 0,
      description,
      ratings: ratings || 0,
      gender: gender || 'Unisex',
      size: size || [],
      discount: discount || 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, title, price, description, image, carousel, category, countInStock, ratings, gender, size, discount } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || title || product.name;
      product.title = title || name || product.title;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.image = image || (carousel && carousel[0]) || product.image;
      product.carousel = carousel || product.carousel;
      product.category = category || product.category;
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
      product.ratings = ratings !== undefined ? ratings : product.ratings;
      product.gender = gender || product.gender;
      product.size = size || product.size;
      product.discount = discount !== undefined ? discount : product.discount;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
