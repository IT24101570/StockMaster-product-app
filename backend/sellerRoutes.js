const express = require('express');
const {
  submitProductForApproval,
  getMySellerProducts,
  getPendingProducts,
  approveProduct,
  rejectProduct,
} = require('../controllers/sellerController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer routes
router.post(
  '/submit',
  protect,
  authorize('customer'),
  submitProductForApproval
);

router.get(
  '/my-submissions',
  protect,
  authorize('customer'),
  getMySellerProducts
);

// Staff/Admin routes
router.get(
  '/pending',
  protect,
  authorize('staff', 'admin'),
  getPendingProducts
);

router.put(
  '/:productId/approve',
  protect,
  authorize('staff', 'admin'),
  approveProduct
);

router.put(
  '/:productId/reject',
  protect,
  authorize('staff', 'admin'),
  rejectProduct
);

module.exports = router;
