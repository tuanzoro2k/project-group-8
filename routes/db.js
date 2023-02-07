const express = require('express');
const db = require('../config/db/database');
const router = express.Router();
const Product = require('../app/models/Product');

router.get('/', async (req, res, next) => {
  try {
    let results = await db.all();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
router.get('/sort-low-to-high', async (req, res, next) => {
  Product.sortProductByCostAsc(function (err, rows) {
    if (err) res.json(err);
    else {
      res.json(rows);
    }
  });
});
router.get('/getAll', async (req, res, next) => {
  Product.getAllProduct(function (err, rows) {
    if (err) res.json(err);
    else {
      res.render('product', { rows });
    }
  });
});
router.get('/:id?', async (req, res, next) => {
  Product.getProductById(req.params.id, function (err, rows) {
    if (err) res.json(err);
    else {
      // document.getElementById('phuc').innerHTML = `${row.ProductID}`
      // res.json(rows);
      res.render('product', { rows });
    }
  });
});
// router.get('/:slug?', async (req, res, next) => {
//     Product.getProductBySlug(req.params.slug, function(err, rows){
//         if(err) res.json(err);
//         else res.json(rows);
//     });
// });

module.exports = router;
