const Product = require('../models/Product');

// CREATE product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, quantity, category, imageUrl } = req.body;

    if (!name || !price || !description || quantity === undefined) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const isCustomer = req.user.role === 'customer';

    const product = await Product.create({
      name,
      price,
      description,
      quantity,
      category: category || 'General',
      imageUrl: imageUrl || '',
      user: req.user.id,
      createdBy: req.user.id,
      sellerType: isCustomer ? 'customer' : 'system',
      status: isCustomer ? 'pending' : 'approved', // Customers need approval, Staff/Admin auto-approved
    });

    res.status(201).json({
      success: true,
      message: isCustomer ? 'Product submitted for approval' : 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating product', error: error.message });
  }
};

// GET all products
const getProducts = async (req, res) => {
  try {
    const { search, category, sort, status } = req.query;
    let query = {};

    // DEFAULT: Only show approved products to regular users
    if (!req.user || req.user.role === 'customer') {
      query.status = 'approved';
    } else if (status) {
      // Staff/Admin can filter by status (pending/rejected/approved)
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    let apiQuery = Product.find(query);

    // Sorting
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      apiQuery = apiQuery.sort(sortBy);
    } else {
      apiQuery = apiQuery.sort('-createdAt');
    }

    const products = await apiQuery.populate('user', 'name email');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
};

// GET product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('user', 'name email').populate('approvedBy', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, quantity, category, imageUrl } = req.body;

    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product
    product = await Product.findByIdAndUpdate(
      id,
      { name, price, description, quantity, category, imageUrl },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product', error: error.message });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting product', error: error.message });
  }
};

// APPROVE or REJECT product (Staff/Admin)
const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { status, approvedBy: req.user.id },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: `Product ${status}`, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating product status', error: error.message });
  }
};

// GET current user's submitted products
const getMySubmittedProducts = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user.id, sellerType: 'customer' });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  approveProduct,
  getMySubmittedProducts
};