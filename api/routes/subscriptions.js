const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const SubscriptionsController = require('../controllers/subscriptions');


//Add 
router.post('/', checkAuth, SubscriptionsController.add_subscription);

//Get 
router.get('/', checkAuth, SubscriptionsController.get_subscription);


module.exports = router;