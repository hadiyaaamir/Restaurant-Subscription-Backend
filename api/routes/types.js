const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const TypesController = require('../controllers/types');


//Add
router.post('/', checkAuth, TypesController.add_type);

//Get
router.get('/', TypesController.get_type);

//Edit
router.patch('/:typeId', checkAuth, TypesController.edit_type)

//Delete 
router.patch('/delete/:typeId', checkAuth, TypesController.delete_type);


module.exports = router;