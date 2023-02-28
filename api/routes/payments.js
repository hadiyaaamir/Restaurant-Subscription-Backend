const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const PaymentsController = require('../controllers/payments');


//Add payment details
router.post('/', checkAuth, PaymentsController.add_payment);

//Get payments details
router.get('/getAll', checkAuth, PaymentsController.get_all_payments);

//Get 1 payment
router.get('/:paymentId', checkAuth, PaymentsController.get_payment)

//Delete payment details
router.patch('/delete/:paymentId', checkAuth, PaymentsController.delete_payment);

module.exports = router;