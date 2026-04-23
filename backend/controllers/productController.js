const Product = require('../models/Product');
const cloudinary = require('../config/cloudinaryConfig');

// CREATE product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, quantity, category } = req.body;
    let { imageUrl } = req.body;

    if (!name || !price || !description || quantity === undefined) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Handle Image Upload to Cloudinary if file exists
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        // Continue without image or return error
      }
    }

    const isCustomer = req.user.role === 'customer';

    const product = await Product.create({
      name,
      price: Number(price),
      description,
      quantity: Number(quantity),
      category: category || 'General',
      imageUrl: imageUrl || '',
      user: req.user.id,
      createdBy: req.user.id,
      sellerType: isCustomer ? 'customer' : 'system',
      status: isCustomer ? 'pending' : 'approved',
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
    const { search, category, sort, status, minPrice, maxPrice, inStock, sellerType } = req.query;
    let query = {};
    const andConditions = [];

    // DEFAULT: Only show approved products to regular users
    if (!req.user || req.user.role === 'customer') {
      andConditions.push({
        $or: [{ status: 'approved' }, { status: { $exists: false } }]
      });
    } else if (status) {
      query.status = status;
    }

    // Search functionality (name or description)
    if (search) {
      andConditions.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Price Filtering
    if ((minPrice !== undefined && minPrice !== '') || (maxPrice !== undefined && maxPrice !== '')) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
    }

    // In Stock Filtering
    if (inStock === 'true') {
      query.quantity = { $gt: 0 };
    }

    // Seller Type Filtering
    if (sellerType && sellerType !== 'all') {
      query.sellerType = sellerType;
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
    const { name, price, description, quantity, category } = req.body;
    let { imageUrl } = req.body;

    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle Image Upload to Cloudinary if file exists
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
      }
    }

    // Update product fields
    const updateData = {
      name,
      price: price ? Number(price) : undefined,
      description,
      quantity: quantity !== undefined ? Number(quantity) : undefined,
      category,
      imageUrl
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    product = await Product.findByIdAndUpdate(
      id,
      updateData,
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
    console.log(`Attempting to delete product with ID: ${id} by user: ${req.user.id}`);
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

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  approveProduct,
  getMySubmittedProducts,
  createProductReview
};
