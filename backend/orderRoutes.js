const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, authorize('admin'), getAllOrders);

module.exports = router;