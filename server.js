require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const route  = require('./routes');
const db = require('./config/db/database');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const axios = require('axios').default;

// const  {
//     SESS_NAME = 'semail',
//     SESS_SECRET = process.env.ACCESS_TOKEN_SECRET,
//     SESS_LIFETIME = 3600000
// } = process.env

app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: Number(process.env.SESS_LIFETIME)
    }
}))

// Static files
app.use(express.static(__dirname + '/views'));
// app.use('/Stylesheets', express.static(__dirname + 'public/Stylesheets'))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
// app.use(jwt{
//     "alg"
// })

// Set view
app.set('view engine', 'ejs');

// Connect to database
db.connect();
// Routes init
route(app);

// Listen to port 3000
app.listen(3000);