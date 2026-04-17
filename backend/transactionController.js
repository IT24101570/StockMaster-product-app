const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

// @desc    Create new transaction
// @route   POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const transaction = await Transaction.create({
      order: orderId,
      user: req.user._id,
      paymentMethod,
      amount,
      status: status || 'Paid',
    });

    res.status(201).json({
      success: true,
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all transactions (Admin/Staff)
// @route   GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('user', 'name email')
      .populate('order')
      .sort('-createdAt');

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get transaction by Order ID
// @route   GET /api/transactions/order/:orderId
const getTransactionByOrder = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ order: req.params.orderId });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found for this order' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionByOrder,
};
