const express = require('express');

const router = express.Router();
const { isAdmin } = require('../helpers/isAdmin');

// Require controller modules
const indexController = require('../controllers/indexController');
const categoryController = require('../controllers/categoryController');
const rarityController = require('../controllers/rarityController');
const itemController = require('../controllers/itemController');
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');

// Manage Index
router.get('/', indexController.indexGet);

// Manage of CATEGORY
router.get('/category', isAdmin, categoryController.categoryList);
router.get('/category/add', isAdmin, categoryController.categoryCreateGet);
router.post('/category/add', isAdmin, categoryController.categoryCreatePost);
router.get('/category/edit/:id', isAdmin, categoryController.categoryUpdateGet);
router.post('/category/edit', isAdmin, categoryController.categoryUpdatePost);
router.post('/category/delete', isAdmin, categoryController.categoryDeletePost);

// Manage of RARITY
router.get('/rarity', isAdmin, rarityController.rarityList);
router.get('/rarity/add', isAdmin, rarityController.rarityCreateGet);
router.post('/rarity/add', isAdmin, rarityController.rarityCreatePost);
router.get('/rarity/edit/:id', isAdmin, rarityController.rarityUpdateGet);
router.post('/rarity/edit', isAdmin, rarityController.rarityUpdatePost);
router.post('/rarity/delete', isAdmin, rarityController.rarityDelete);

// Manage of ITEM
router.get('/item', isAdmin, itemController.itemList);
router.get('/item/add', isAdmin, itemController.itemCreateGet);
router.post('/item/add', isAdmin, itemController.itemCreatePost);
router.get('/item/edit/:id', isAdmin, itemController.itemUpdateGet);
router.post('/item/edit', isAdmin, itemController.itemUpdatePost);
router.post('/item/delete', isAdmin, itemController.itemDelete);
router.get('/item/filter', isAdmin, itemController.itemFilterGet);

// Manage of STORE
router.get('/store', isAdmin, storeController.storeList);
router.post('/store/generator', isAdmin, storeController.storeGeneratorPost);

// Manage of USER
router.get('/user', isAdmin, userController.userList);
router.get('/user/add', isAdmin, userController.userCreateGet);
router.post('/user/add', isAdmin, userController.userCreatePost);
router.post('/user/delete', isAdmin, userController.userDelete);
router.get('/user/edit/:id', isAdmin, userController.userUpdateGet);
router.post('/user/edit', isAdmin, userController.userUpdatePost);
router.get('/user/filter', isAdmin, userController.userFilterGet);

module.exports = router;
