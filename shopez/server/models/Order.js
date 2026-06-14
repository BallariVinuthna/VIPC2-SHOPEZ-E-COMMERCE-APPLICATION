const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: { type: String },
    email: { type: String },
    mobile: { type: String },
    address: { type: String },
    pincode: { type: String },
    title: { type: String },
    description: { type: String },
    ratings: { type: Number, default: 0 },
    size: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    discount: { type: Number, default: 0 },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Virtual Balance',
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre('save', function (next) {
  if (this.user && !this.userId) {
    this.userId = this.user;
  }
  if (this.userId && !this.user) {
    this.user = this.userId;
  }
  if (this.shippingAddress && this.shippingAddress.address && !this.address) {
    this.address = this.shippingAddress.address;
  }
  if (this.shippingAddress && this.shippingAddress.postalCode && !this.pincode) {
    this.pincode = this.shippingAddress.postalCode;
  }
  if (this.orderItems && this.orderItems.length > 0) {
    const firstItem = this.orderItems[0];
    if (!this.title) this.title = firstItem.name;
    if (!this.quantity) this.quantity = firstItem.qty;
    if (!this.price) this.price = this.totalPrice;
  }
  if (!this.orderDate) {
    this.orderDate = this.createdAt || Date.now();
  }
  if (this.isDelivered && !this.deliveryDate) {
    this.deliveryDate = this.deliveredAt || Date.now();
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
