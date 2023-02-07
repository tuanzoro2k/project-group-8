const jwt = require('jsonwebtoken');
const User = require('../../app/models/User');

// function generateAccessToken(res, user) {
//     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
//     return res.cookie('token', token, {
//        httoOnly: true,
//        secure: false
//     });
// };

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authoriation'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        try {
            User.findByEmail(function (err, rows) {
                if(err) res.json(err);
                else {
                    const user = rows[0];
                }
            })
            if(!user) {
                console.log('No user');
            }
            req.user = user;
            req.token = token;
            next();
        } catch (error) {
            res.status(403).send({ error: 'Not authorized to access this resource' });
        }
    });
};

module.exports = {authenticateToken}