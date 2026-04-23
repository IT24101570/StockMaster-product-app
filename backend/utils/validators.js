const { body } = require('express-validator');

// Auth validation rules
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['customer', 'staff', 'admin'])
    .withMessage('Role must be customer, staff, or admin'),
];

const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Product validation rules
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2 })
    .withMessage('Product name must be at least 2 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 5 })
    .withMessage('Description must be at least 5 characters'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative number'),
  body('category')
    .trim()
    .optional()
    .isLength({ min: 2 })
    .withMessage('Category must be at least 2 characters'),
];

// Order validation rules
const validateCreateOrder = [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must have at least one item'),
  body('totalPrice')
    .notEmpty()
    .withMessage('Total price is required')
    .isFloat({ min: 0 })
    .withMessage('Total price must be a positive number'),
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateCreateOrder,
};
