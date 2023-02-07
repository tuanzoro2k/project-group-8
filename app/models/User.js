const db = require('../../config/db/database');

var User = {
    findByEmail:function (email, callback) {
        return db.connection.query('SELECT * FROM User_table WHERE Email = ?', [email], callback);
    }
};

module.exports = User;