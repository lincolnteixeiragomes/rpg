const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const storeController = require('../controllers/storeController');
const indexController = require('../controllers/indexController');

// Index
router.get('/', indexController.indexGet);
router.get('/store', storeController.storeFind);
router.get('/login', userController.login);
router.post('/login', userController.loginPost);
router.get('/logout', userController.logout);
router.get('/register', userController.userRegisterGet);
router.post('/register', userController.userRegisterPost);

module.exports = router;
