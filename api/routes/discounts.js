const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const DiscountsController = require('../controllers/discounts');

//Add
router.post('/', checkAuth, DiscountsController.add_discount);

//Get
router.get('/', DiscountsController.get_discount);

//Edit
router.patch('/:discountId', checkAuth, DiscountsController.edit_discount)

//Delete 
router.patch('/delete/:discountId', checkAuth, DiscountsController.delete_discount);


module.exports = router;