const Cart = require('../models/Cart');
const Product = require('../models/Product');
// Create global variable for category
const cate = [];
Product.getAllCategory(function(err, cates){
    if(err) console.log(err);
    for(let i = 0; i < cates.length; i++) {
        cate[i] = cates[i];
    }
});
const product = [];
Product.getAllProduct(function(err, rows){
    if(err) console.log(err);
    else {
        for(let i = 0; i < rows.length; i++) {
            product[i] = rows[i];
        }
    }
});
var afterFilterCate = product;
var afteMultiFiter = []; // array of object after filter by brand || price || color

class CatalogController {
    //[GET] /catalog
    index(req, res) {
        const sess = req.session.userID;
            Product.getAllProduct(function(err, rows){
                if(err) res.json(err);
                else {
                    var brand = [];
                    var newBrand = [];
                    for (let i = 0; i < rows.length; i++) {
                        brand.push(rows[i].Brand_name);
                        if (newBrand.indexOf(brand[i]) == -1) {
                            newBrand.push(brand[i]);
                        }
                    }
                    newBrand.sort();
                    res.render('product', {rows: rows, cate: cate, brand: newBrand, sess: sess});
                }
            });
        // }
    };
    //[PATCH] /catalog/filter
    filterProduct(req, res) {
        var brand = req.body.brand;
        var price = req.body.price;
        var color = req.body.color;
        var slug = req.body.url.split("/").pop();
        if (slug == "catalog") var result = product;
        else var result = afterFilterCate;
        if (brand.length != 0) {
            var afterFilterBrand = [];
            for (let i = 0; i < brand.length; i++) {
                for (let j = 0; j < result.length; j++) {
                    if (result[j].Brand_name === brand[i])
                        afterFilterBrand.push(result[j]);
                }  
            }
            result = afterFilterBrand;
        }
        if (price.length != 0) {
            var afterFilterPrice = [];
            for (let i = 0; i < price.length; i++) {
                var a = price[i].split("-")[0];
                var b = price[i].split("-")[1];
                for (let j = 0; j < result.length; j++) {
                    if (result[j].Price >= a && result[j].Price <= b) {
                        afterFilterPrice.push(result[j]);
                    }
                }
            }
            result = afterFilterPrice;
        }
        if (color.length != 0) {
            var afterFilterColor = [];
            for (let i = 0; i < color.length; i++) {
                for (let j = 0; j < result.length; j++) {
                    if (result[j].Color.toLowerCase().includes(color[i]) == true) {
                        afterFilterColor.push(result[j]);
                    }
                }
            }
            result = afterFilterColor;
        }
        afteMultiFiter = result;
        res.json(result);
    }

    //[PATCH] /catalog/:affect
    sortBy(req, res) {
        var typeSort = req.body.affect;
        if (afteMultiFiter.length != 0) var rows = afteMultiFiter;
        else rows = product;
        if (typeSort == "PriceAsc") {
            rows.sort((a, b) => (a.Price > b.Price) ? 1 : -1);
            res.json(rows);
        }
        if (typeSort == "PriceDesc") {
            rows.sort((a, b) => (a.Price < b.Price) ? 1 : -1);
            res.json(rows);
        }
        if (typeSort == "AtoZ") {
            rows.sort((a, b) => (a.ProductName.toLowerCase() > b.ProductName.toLowerCase()) ? 1 : -1);
            res.json(rows);
        }
        if (typeSort == "ZtoA") {
            rows.sort((a, b) => (a.ProductName.toLowerCase() < b.ProductName.toLowerCase()) ? 1 : -1);
            res.json(rows);
        }
        if (typeSort == "DateOldToNew") {
            console.log("DateOldToNew")
        }
        if (typeSort == "DateNewToOld") {
            console.log("DateNewToOld")
        }
    }

  
    //[GET] /collections/:cate
    filterByCategory(req, res) {
        const sess = req.session.userID;
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var slug = fullUrl.split("/").pop();
        slug = slug.split('-').join(' ');
        Product.getProductByCategory(slug, function(err, rows){
            if(err) res.json(err);
            else {
                var brand = [];
                var newBrand = [];
                for (let i = 0; i < product.length; i++) {
                    brand.push(product[i].Brand_name);
                    if (newBrand.indexOf(brand[i]) == -1) {
                        newBrand.push(brand[i]);
                    }
                }
                newBrand.sort();
                res.render('product', {rows: rows, cate: cate, brand: newBrand, sess: sess});
            }
            afterFilterCate = rows;
            afteMultiFiter = rows;
        })
    }

    //[GET] /catalog/product/slug
    show(req, res) {
        const sess = req.session.userID;
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var slug = fullUrl.split("/").pop();
        Product.getProductBySlug(slug, function(err, rows) {
            if(err) res.json(err);
            else {
                var imageUrl = rows[0].url.split("|");
                var descript=rows[0].ProductDesc.split("|");

                var typecate=rows[0].Category_name;
                var cate_arr=[];
                function ex(callback){

                    Product.getProductByCategory(typecate, function(err,arr){
                        if(err) res.json(err);
                        else{
                            for(var i=0;i<arr.length;i++){
                                if(arr[i].ProductID!=rows[0].ProductID){
                                    cate_arr.push(arr[i]);
                                }
                            }
                            callback(cate_arr);
                        }
                    });
                }
                ex(function(cate_arr){
                    var checkSess;
                    var userInfo = "none";
                    var totalItem = 0;
                    var totalCost = 0;
                    if (typeof sess === 'undefined') {
                        checkSess = "no_user";
                        // res.render('product-detail', {rows: rows, imageUrl: imageUrl,cate_arr:cate_arr, descript:descript, sess: sess_no_user, checkUser: checkSess});
                    }
                    else {
                        checkSess = "have_user";
                        userInfo = sess;
                        Cart.totalCost(userInfo.cartid, function(err, results){
                            if (err) res.json(err);
                            else {
                                for (let i = 0; i < results.length; i++) {
                                    totalItem += results[i].NumProduct;
                                    totalCost += results[i].Price * results[i].NumProduct;
                                }
                            }
                        })
                    }
                    setTimeout(function o(){
                        res.render('product-detail', {rows: rows, imageUrl: imageUrl,cate_arr: cate_arr, descript: descript, sess: sess, checkUser: checkSess, userInfo: userInfo, totalCost: totalCost, totalItem: totalItem});
                    }, 100);
                });
 
            }
        })
    };

    // [PATCH] /catalog/product/add-to-cart
    addToCart(req, res) {
        var cartID = req.body.cartID;
        var productID = req.body.productID;
        var quantity = req.body.quantity;
        Cart.getTupleByCartID(cartID, productID, function(err, results){
            if(err) res.json(err);
            else {
                if(results.length == 0) {
                    Cart.addProduct(cartID, productID, quantity, 'Y', function(err2){
                        if (err2) console.log(err2);
                    });
                }
                else {
                    quantity += results[0].NumProduct;
                    Cart.updateProduct(cartID, productID, quantity, function(err){
                        if (err) console.log(err);
                    });
                }
            }
        })
    }

};

module.exports = new CatalogController;