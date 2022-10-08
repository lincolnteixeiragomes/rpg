const express = require('express');

const router = express.Router();
const storeController = require('../controllers/storeController');
const indexController = require('../controllers/indexController');

// Index
router.get('/', indexController.indexGet);
router.get('/login', indexController.login);
router.get('/store', storeController.storeFind);

module.exports = router;
