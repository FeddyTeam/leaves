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
        }, null, { sort: '-createdAt' })
        const mustread = await News.find({
            status: 'active',
            level: 'mustread',
        }, null, {
            sort: '-createdAt',
        })

        await res.render('index', {
            ...groupBy(_base, 'type'),
            mustread
        })
    })
    .get('/login', (req, res) => res.render('login'))
    .get('/cb/success', (req, res) => res.render('success'))




module.exports = router
