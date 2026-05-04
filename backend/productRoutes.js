const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  approveProduct,
  getMySubmittedProducts,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { validateProduct } = require('../utils/validators');
const upload = require('../utils/multer');

// GET all products - Public or Staff/Admin (Logic inside controller to filter by status)
router.get('/', protect, getProducts);

// GET my submitted products - Customer
router.get('/my-submissions', protect, authorize('customer'), getMySubmittedProducts);

// GET one product - Public or Staff/Admin
router.get('/:id', protect, getProductById);

// CREATE product - Staff and Admin (auto-approved) OR Customer (pending)
router.post('/', protect, validateProduct, validate, createProduct);

// APPROVE or REJECT product - Staff and Admin
router.put('/:id/approve', protect, authorize('staff', 'admin'), approveProduct);

// UPDATE product - Staff and Admin
router.put('/:id', protect, authorize('staff', 'admin'), validateProduct, validate, updateProduct);

// DELETE product - Admin only
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
