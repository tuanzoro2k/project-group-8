const express = require('express');
const router = express.Router();
// const bodyParser = require('body-parser');
// const encoder = bodyParser.urlencoded();
const accountController = require('../app/controllers/AccountController');
const authenticateUser = require('../config/auth/auth');
const jwt = require('jsonwebtoken');
const User = require('../app/models/User');

// router.get('/test', function(req, res){
//     console.log(req.session);
// })

router.get('/login', accountController.redirectHome, function(req, res){
    res.render('login', {message : ''});
});
router.post('/login', accountController.redirectHome, accountController.login);

router.get('/register', function(req, res){
	res.render('register', {message : ''});
});
router.post('/register', accountController.register);

router.get('/logout', accountController.logout);
// test
// router.get('/profile', (req, res) => {
//     const token = req.cookies.access_token;
//     // res.json(token);
//     const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//     const { email } = decode;
//     User.findByEmail(email, function (err, rows) {
//         if(err) res.json(err);
//             else {
//                 res.json(rows);
//             }
//     })
// });
module.exports = router;


// router.post('/login', encoder, async(req, res, next) => {
// 	try {
// 		var {email, password} = req.body;

// 		if (!email || !password) {
// 			return res.status(400).render('login', {message: 'Please provide an email and password'});
// 		}
// 		db.connection.query('SELECT * FROM User_table WHERE Email = ?', [email], async function(error, results){
// 			console.log(results);
// 			if (results.length == 0){
// 				return res.status(400).render('login', {message: 'No user with this email'});
// 			}
// 			bcrypt.compare(password, results[0].Password, function(error, response){
// 				if (error) {console.log(error)}
// 				if (response == false) {
// 					return res.status(400).render('login', {message: 'Password incorrect'})
// 				}
// 				else {
// 					return res.render('home');
// 				}
// 			});
// 		});

// 	} catch (error) {
// 		console.log(error);
// 	}
// });



// router.post('/register', encoder, async(req, res, next) => {
// 	var {firstName, lastName, phone, email, password, passwordConfirm, city, country} = req.body;

// 	db.connection.query('SELECT * FROM User_table WHERE Email = ?', [email], async function(error, results, fields){
// 		if (error) {
// 			console.log(error);
// 		}
		
// 		if (results.length > 0) {
// 			return res.render('register', {message: 'That email is already use'});
// 		} else if (password != passwordConfirm) {
// 			return res.render('register', {message: 'Password do not match'});
// 		}
// 		else {
// 			let hashedPassword = await bcrypt.hash(password, 8); 
// 			// 8: how many time you want to hash password
// 			console.log(hashedPassword);

// 			db.connection.query('INSERT INTO User_table SET ?', {FirstName: firstName, LastName: lastName, Phone: phone, Email: email, Password: hashedPassword, City: city, Country: country}, (error, results) => {
// 				if (error) {
// 					console.log(error);
// 				} else {
// 					console.log(results);
// 					return res.render('register', {message: 'Sign up successfully'});
// 				}
// 			});
// 		}
// 	});
// });