const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  const { orderItems, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }
  const order = new Order({
    orderItems,
    user: req.user._id,
    totalPrice,
  });
  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
  res.json(orders);
};

module.exports = { createOrder, getMyOrders, getAllOrders };