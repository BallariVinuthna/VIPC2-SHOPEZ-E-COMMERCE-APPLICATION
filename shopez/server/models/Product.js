const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    image: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    },
    carousel: [
      {
        type: String,
      }
    ],
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      default: 'Unisex',
    },
    size: [
      {
        type: String,
      }
    ],
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.title && !this.name) {
    this.name = this.title;
  }
  if (!this.title && this.name) {
    this.title = this.name;
  }
  if (this.carousel && this.carousel.length > 0 && !this.image) {
    this.image = this.carousel[0];
  }
  if (this.image && (!this.carousel || this.carousel.length === 0)) {
    this.carousel = [this.image];
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
