const express = require('express');
const router = express.Router();

router.get('/search', (req, res) => {
    res.render('search');
})

router.get('/update', (req, res) => {
    res.render('update');
})

router.get('/remove', (req, res) => {
    res.render('remove');
})

router.get('/', (req, res) => {
    res.render('add-new');
})

module.exports = router;