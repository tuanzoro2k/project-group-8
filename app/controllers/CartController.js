const Cart = require('../models/Cart');

class CartController{
    showCart(req, res) {
        const sess = req.session.userID;
        var userInfo = {id: 0, email: '0@0.com', cartid: 0};
        var checkSess = 'have_user';
        var userInfo = "none";
        if (typeof sess === 'undefined') {
            checkSess = 'no_user';
        }
        else userInfo = sess;
        Cart.totalCost(userInfo.cartid, function(err, rows){
            if(err) res.json(err);
            else {
                var totalCost = 0;
                var subCost = [];
                for (var i = 0; i < rows.length; i++) {
                    // totalCost += rows[i].Price;
                    subCost[i] = rows[i].Price * rows[i].NumProduct;
                    if (rows[i].CheckInCart.localeCompare('Y') == 0) {
                        totalCost += subCost[i];
                    }
                }
                res.render('cart', {rows: rows, totalCost: totalCost, subCost: subCost, sess: sess, checkUser: checkSess, userInfo: userInfo}); 
            }
        });
    };
    removeFromCart(req, res) {
        const sess = req.session.userID;
        var x = () => {
            Cart.removeFromCart(function(err) {
                if(err) res.json(err);
            });
        };
        res.render('cart', {x: x, sess: sess})
    };
    update(req, res) {
        Cart.updateProduct(req.body.quantity, req.body.cartID, req.body.id, function(err) {
            if(err) res.json(err);
        });
    }
    delete(req, res) {
        const carID = req.body.cartID;
        const productID = req.body.productID;
        Cart.removeFromCart(carID, productID, function (err) {
            if(err) res.json(err);
        })
    }
    // [PATCH] /my-cart/update-state
    updateState(req, res) {
        const cartID = req.body.cartID;
        const productID = req.body.productID;
        const state = req.body.state;
        Cart.updateProductState(state, cartID, productID, function (err) {
            if(err) res.json(err);
            return res.end();
        })
    }
    // [POST] /my-cart
    // checkout(req, res) {
    //     var {quantityll, note} = req.body;
    //     console.log(note);
    //     console.log(quantityll)
    //     res.redirect('/')
    // }
};

module.exports = new CartController;