const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
const orderController = require('../app/controllers/OrderController');
const accountController = require('../app/controllers/AccountController');

router.get('/user-profile', accountController.showProfile);
// siteController.home
router.patch('/orderFinish', orderController.completeOrder);
router.get('/info', orderController.createOrder, orderController.fillInfoPage);
router.get('/shipping', orderController.fillShippingPage);
router.get('/payment', orderController.fillPaymentPage);
router.get('/successful-payment', orderController.showSuccessfulPayment);

router.post('/shipping', orderController.fillShippingPage);
router.post('/payment', orderController.fillPaymentPage);
// router.get('/detail', (req, res) => {
//     res.render('product-detail');
// });
router.get('/pages-info', siteController.pages);
router.get('/blog', siteController.blog);
router.get('/login', siteController.login);
router.get('/', siteController.home);

module.exports = router;
