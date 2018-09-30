const assert = require('assert')
const { Types: { ObjectId } } = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const isAuthed = require('../../lib/isAuthed')
const { Roles: { EDITOR } } = require('../../lib/isAuthed')
const { isEmail, isLength } = require('validator')
const { isEmpty, omitBy } = require('lodash')
const { User, News } = require('../../db')
const { JWT_SECRET } = process.env

module.exports = {
    profile: {
        async get (root, args, { auth }, info) {
            assert(isAuthed(auth), '401')
            const { id } = auth

            const user = await User.findById(id)
            assert(!!user, 'user_not_found')

            return user.toJSON()
        },
        async update (root, { profile }, { auth }, info) {
            assert(isAuthed(auth), '401')
            const { id } = auth

            const user = await User.findById(id)
            assert(!!user, 'user_not_found')

            user.set(profile)
            await user.save()

            return user.toJSON()
        },
    },
    news: {
        async list (root, { options, filters }, { auth }, info) {
            assert(isAuthed(auth, EDITOR), '401')

            const results = await News.find(omitBy(filters, isEmpty), null, options)
            return results
        },
        async create (root, args, { auth }, info) {
            assert(isAuthed(auth, EDITOR), '401')
            const { id } = auth

            const news = new News({
                userID:  ObjectId(id),
                user: ObjectId(id),
            })
            await news.save()

            return news.get('id')
        },
        async update (root, { news }, { auth }, info) {
            assert(isAuthed(auth, EDITOR), '401')

            const _news = await News.findById(news.id)
            assert(!!_news, '400')

            _news.set(news)
            await _news.save()

            return _news.toJSON()
        },
        async get (root, { id }, { auth }, info) {
            assert(isAuthed(auth, EDITOR), '401')

            const news = await News.findById(id).populate('user')
            assert(!!news, '400')

            return news.toJSON()
        },
    },
    auth: {
        async login (root, { form: { email, password } }, context, info) {
            const isValid = isEmail(email) && isLength(password, { min: 6, max: 32 })
            assert(isValid, 'bad_request@login')

            const user = await User.findOne({ email })
            assert(!isEmpty(user), 'user_not_found@login')

            const result = await bcrypt.compare(password, user.get('password'))
            assert(result, 'wrong_password@login')

            const payload = { id: user.get('id') }
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1day' })

            return token
        }
    }
}
