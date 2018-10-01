const express = require('express')
const router = express.Router()

router
    .get('/', function(_, res) {
        res.render('index', { title: 'Express' })
    })
    .get('/login', (req, res) => res.render('login'))
    .get('/cb/success', (req, res) => res.render('success'))

module.exports = router
