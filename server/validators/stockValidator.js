const { param } = require('express-validator');

const validateStockSymbol = [
  param('symbol')
    .trim()
    .toUpperCase()
    .isAlphanumeric()
    .isLength({ min: 1, max: 10 })
    .withMessage('Invalid stock symbol format'),
];

module.exports = {
  validateStockSymbol,
};
