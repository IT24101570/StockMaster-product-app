const SellerProduct = require('../models/SellerProduct');
const Product = require('../models/Product');

// Customer: Submit product for approval
const submitProductForApproval = async (req, res) => {
  try {
    const { name, price, description, category, condition, quantity } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;
    const userEmail = req.user.email;

    if (!name || !price || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and description are required',
      });
    }

    const sellerProduct = await SellerProduct.create({
      name,
      price,
      description,
      category: category || 'General',
      condition: condition || 'Used',
      quantity: quantity || 1,
      seller: userId,
      sellerName: userName,
      sellerEmail: userEmail,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Product submitted for approval!',
      product: sellerProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting product',
      error: error.message,
    });
  }
};

// Customer: Get their own submissions
const getMySellerProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const products = await SellerProduct.find({ seller: userId }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your products',
      error: error.message,
    });
  }
};

// Staff/Admin: Get all pending products
const getPendingProducts = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'pending'; // Default to pending only
    }

    const products = await SellerProduct.find(query)
      .populate('seller', 'name email')
      .populate('approvedBy', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending products',
      error: error.message,
    });
  }
};

// Staff/Admin: Approve product
const approveProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const sellerProduct = await SellerProduct.findById(productId);

    if (!sellerProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (sellerProduct.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending products can be approved',
      });
    }

    // Create product in main inventory
    const newProduct = await Product.create({
      name: sellerProduct.name,
      price: sellerProduct.price,
      description: sellerProduct.description,
      category: sellerProduct.category,
      quantity: quantity || sellerProduct.quantity,
      user: req.user._id,
    });

    // Update seller product status
    sellerProduct.status = 'approved';
    sellerProduct.approvedBy = req.user._id;
    sellerProduct.approvedAt = new Date();
    await sellerProduct.save();

    res.status(200).json({
      success: true,
      message: 'Product approved and added to inventory!',
      product: newProduct,
      sellerProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving product',
      error: error.message,
    });
  }
};

// Staff/Admin: Reject product
const rejectProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rejectionReason } = req.body;

    const sellerProduct = await SellerProduct.findById(productId);

    if (!sellerProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (sellerProduct.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending products can be rejected',
      });
    }

    sellerProduct.status = 'rejected';
    sellerProduct.rejectionReason = rejectionReason || 'No reason provided';
    await sellerProduct.save();

    res.status(200).json({
      success: true,
      message: 'Product rejected',
      product: sellerProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting product',
      error: error.message,
    });
  }
};

module.exports = {
  submitProductForApproval,
  getMySellerProducts,
  getPendingProducts,
  approveProduct,
  rejectProduct,
};
