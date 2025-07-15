const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { buyStock, sellStock } = require('../controllers/tradeController');
const validateRequest = require('../middleware/validateRequest');
const {validateTrade} =require ('../validators/tradeValidator')

router.post('/buy', auth,validateTrade ,validateRequest , buyStock);
router.post('/sell', auth, validateTrade, validateRequest,sellStock);

module.exports = router;
