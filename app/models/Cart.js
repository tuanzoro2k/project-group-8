const db = require('../../config/db/database');

var Cart = {
    createCart:function(cartID, createTime, updateTime, PaymentMethod){
        return db.connection.query('Insert into Cart values(?, ?, ?, ?)', [cartID, createTime, updateTime, PaymentMethod]);
    },
    getTupleByCartID:function(carID, productID, callback){
        return db.connection.query('select * from Product_Cart where CartID = ? and ProductID = ?', [carID, productID], callback);
    },
    getProductOrdered:function(cartID, callback){
        return db.connection.query('SELECT * FROM Products, Cart, Product_Cart WHERE Products.ProductID = Product_Cart.ProductID AND Product_Cart.CartID = Cart.CartID AND Product_Cart.CartID = ? AND CheckInCart = "Y"', [cartID], callback);
    },
    addProduct:function(cartID, productID, quantity, Check, callback){
        return db.connection.query('INSERT INTO Product_Cart values(?, ?, ?, ?)', [cartID, productID, quantity, Check], callback);
    },
    totalCost:function(cartid, callback){
        return db.connection.query('SELECT * FROM Products, Cart, Product_Cart WHERE Products.ProductID = Product_Cart.ProductID AND Product_Cart.CartID = Cart.CartID AND Product_Cart.CartID = ?',[cartid] , callback);
    },
    removeFromCart:function(cartID, productID, callback){
        return db.connection.query('DELETE FROM Product_Cart WHERE  CartID = ? AND ProductID = ?', [cartID, productID], callback); 
    },
    updateProduct:function(value, cartID, productID, callback){
        return db.connection.query('update Product_Cart set NumProduct = ? where CartID = ? and ProductID = ?', [value, cartID, productID], callback);
    },
    updateProductState:function(state, cartID, productID, callback){
        return db.connection.query('update Product_Cart set CheckInCart = ? where CartID = ? and ProductID = ?', [state, cartID, productID], callback);
    }
};

module.exports = Cart;