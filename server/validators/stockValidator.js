const { param } = require('express-validator');

const validateStockSymbol = [
  param('symbol')
    .trim()
    .matches(/^[A-Z0-9\.\-]{1,20}$/i)
    .withMessage('Invalid stock symbol format'),
];

module.exports = {
  validateStockSymbol,
};
