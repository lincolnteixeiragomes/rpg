const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const storeController = require('../controllers/storeController');
const indexController = require('../controllers/indexController');
const contactController = require('../controllers/contactController');

// Index
router.get('/', indexController.indexGet);
router.get('/store', storeController.storeFind);
router.get('/login', userController.login);
router.get('/resetPassword', userController.userResetPasswordGet);
router.post('/resetPassword', userController.userResetPasswordPost);
router.get('/resetpwd', userController.userPasswordChangeGet);
router.post('/resetpwd', userController.userPasswordChangePost);
router.post('/login', userController.loginPost);
router.get('/logout', userController.logout);
router.get('/register', userController.userRegisterGet);
router.post('/register', userController.userRegisterPost);
router.get('/contact', contactController.contactGet);
router.post('/contact', contactController.contactPost);

module.exports = router;
