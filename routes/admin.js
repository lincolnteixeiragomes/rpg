const express = require('express');

const router = express.Router();

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
router.get('/category', categoryController.categoryList);
router.get('/category/add', categoryController.categoryCreateGet);
router.post('/category/add', categoryController.categoryCreatePost);
router.get('/category/edit/:id', categoryController.categoryUpdateGet);
router.post('/category/edit', categoryController.categoryUpdatePost);
router.post('/category/delete', categoryController.categoryDeletePost);

// Manage of RARITY
router.get('/rarity', rarityController.rarityList);
router.get('/rarity/add', rarityController.rarityCreateGet);
router.post('/rarity/add', rarityController.rarityCreatePost);
router.get('/rarity/edit/:id', rarityController.rarityUpdateGet);
router.post('/rarity/edit', rarityController.rarityUpdatePost);
router.post('/rarity/delete', rarityController.rarityDelete);

// Manage of ITEM
router.get('/item', itemController.itemList);
router.get('/item/add', itemController.itemCreateGet);
router.post('/item/add', itemController.itemCreatePost);
router.get('/item/edit/:id', itemController.itemUpdateGet);
router.post('/item/edit', itemController.itemUpdatePost);
router.post('/item/delete', itemController.itemDelete);
router.get('/item/filter', itemController.itemFilterGet);

// Manage of STORE
router.get('/store', storeController.storeList);
router.post('/store/generator', storeController.storeGeneratorPost);

// Manage of USER
router.get('/user', userController.userList);
router.get('/user/add', userController.userCreateGet);
router.post('/user/add', userController.userCreatePost);
router.post('/user/delete', userController.userDelete);
router.get('/user/edit/:id', userController.userUpdateGet);
router.post('/user/edit', userController.userUpdatePost);
router.get('/user/filter', userController.userFilterGet);

module.exports = router;
