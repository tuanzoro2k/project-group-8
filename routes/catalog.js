const express = require('express');
const router = express.Router();
const catalogController = require('../app/controllers/CatalogController');

// catalogController.index
router.get('/collections/:cate', catalogController.filterByCategory);
router.patch('/all', catalogController.sortBy);
router.patch('/filter', catalogController.filterProduct);
router.patch('/product/add-to-cart', catalogController.addToCart);
router.get('/product/:slug', catalogController.show);
router.get('/', catalogController.index);

module.exports = router;
