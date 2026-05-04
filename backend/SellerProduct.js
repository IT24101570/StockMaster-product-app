const mongoose = require('mongoose');

const SellerProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      default: 'General',
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerName: String,
    sellerEmail: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    rejectionReason: String,
    condition: {
      type: String,
      default: 'Used',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SellerProduct', SellerProductSchema);
