const { body } = require('express-validator');

const validateTrade = [
  body('symbol')
    .trim()
    .notEmpty().withMessage('Symbol is required')
    .isLength({ min: 1, max: 5 }).withMessage('Invalid stock symbol format'),

  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
];

module.exports = { validateTrade };
