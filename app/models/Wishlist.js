const db = require('../../config/db/database');

var Wishlist = {
    createWishlist:function(wishlistID, createTime, updateTime){
        db.connection.query('insert into WishList values (?, ?, ?)', [wishlistID, createTime, updateTime]);
    }
};

module.exports = Wishlist;