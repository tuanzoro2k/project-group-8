const db = require('../../config/db/database');

var Product = {
    getAllCategory:function(callback) {
        return db.connection.query('SELECT * FROM Categories', callback);
    },
    getAllProduct:function(callback){
        return db.connection.query('SELECT * FROM Products, Brands where Products.Brand_id = Brands.Brand_id', callback);
    },
    getProductById:function(id, callback){
        return db.connection.query('select * from Products where ProductID =?', [id], callback);
    },
    getProductBySlug:function(slug, callback){
        return db.connection.query('select * from Products, Brands, Product_Category, Categories, ProductImage where Products.Brand_id = Brands.Brand_id and Products.ProductID = ProductImage.ProductID and Products.ProductID=Product_Category.ProductID and Product_Category.Category_id=Categories.Category_id and slug=?',[slug], callback);
    },
    sortProductByCostAsc:function(callback){
        return db.connection.query('select * from products order by Price asc', callback);
    },
    sortProductByCostDesc:function(callback){
        return db.connection.query('select * from products order by Price desc', callback);
    },
    sortProductByNameAsc:function(callback){
        return db.connection.query('select * from products order by ProductName asc', callback);
    },
    sortProductByNameDesc:function(callback){
        return db.connection.query('select * from products order by ProductName desc', callback);
    },
    checkOutStock:function(productID, value){
        db.connection.query('select * from Products where ProductID = ?',[productID], function(err, results){
            if (err) {
                console.log(err);
            } else {
                const numOfProductNow = results[0].ProductStock;
                if (value < numOfProductNow) {
                    return false;
                } else {
                    return true;
                }
            }
        });
    },
    getProductByCategory:function(slug, callback){
        return db.connection.query('select * from Products, Brands, Categories, Product_Category where Products.Brand_id = Brands.Brand_id and Products.ProductID = Product_Category.ProductID and Categories.Category_id = Product_Category.Category_id and lower(Categories.Category_name) = ?', [slug], callback);
    },
    getProductByBrand:function(brand, callback){
        return db.connection.query('select * from Products, Brands where Products.ProductID = Brands.ProductID and Brands.Brand_name = ?', [brand], callback);
    }
};

module.exports = Product;