const Product = require('../models/Product');
const Order = require('../models/Order');

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ status: 'approved' });
    const lowStock = await Product.countDocuments({ quantity: { $lt: 5 }, status: 'approved' });
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find();
    const totalSales = orders.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

    // Commission (Admin Feature)
    const commission = totalSales * 0.10; // 10% platform fee

    res.json({
      totalProducts,
      lowStock,
      totalOrders,
      totalSales,
      commission,
      pendingApprovals: await Product.countDocuments({ status: 'pending' }),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };