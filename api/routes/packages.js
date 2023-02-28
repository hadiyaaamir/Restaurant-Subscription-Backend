const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const PackagesController = require('../controllers/packages');


//Add
router.post('/', checkAuth, PackagesController.add_package);

//Get
router.get('/', PackagesController.get_package);

//Edit
router.patch('/:packageId', checkAuth, PackagesController.edit_package)

//Delete 
router.patch('/delete/:packageId', checkAuth, PackagesController.delete_package);


module.exports = router;