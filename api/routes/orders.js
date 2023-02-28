const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');


//Add 
router.post('/:date', checkAuth, OrdersController.add_orders);

//Add by User
router.post('/', checkAuth, OrdersController.add_orders_user);

//Get 
router.get('/', checkAuth, OrdersController.get_orders);

//Update Status
router.patch('/:orderId', checkAuth, OrdersController.update_status);


module.exports = router;