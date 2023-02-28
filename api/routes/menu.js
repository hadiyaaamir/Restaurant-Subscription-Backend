const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const MenuController = require('../controllers/menu');


//Get All Users
//router.get('/', checkAuth, UsersController.users_get_all);

//Add Menu
router.post('/', checkAuth, MenuController.menu_add);

//Edit Menu
router.patch('/:menuId', checkAuth, MenuController.menu_edit);

//Delete Menu
router.patch('/delete/:menuId', checkAuth, MenuController.menu_delete);

//Get Menu
router.get('/get', MenuController.menu_get);


module.exports = router;