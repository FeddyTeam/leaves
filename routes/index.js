const express = require('express')
const router = express.Router()

const { groupBy } = require('lodash')

const { News } = require('../db')

router
    .get('/', async (_, res) => {
        const _base = await News.find({
            status: 'active',
            level: { $in: ['normal', 'featured'] },
            category: { $in: ['news', 'event', 'notice', 'alert', 'project'] },
        }, null, { sort: '-createdAt', limit: 32 })
        const mustread = await News.find({
            status: 'active',
            level: 'mustread',
        }, null, { sort: '-createdAt', limit: 8 })

        await res.render('index', {
            ...groupBy(_base, 'category'),
            mustread
        })
    })
    .get('/login', (req, res) => res.render('login'))
    .get('/cb/success', (req, res) => res.render('success'))




module.exports = router
