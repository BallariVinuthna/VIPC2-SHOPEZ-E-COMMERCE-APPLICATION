const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
  {
    banner: {
      type: String,
      default: 'Welcome to SHOPEZ!',
    },
    categories: [
      {
        type: String,
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
