const assert = require('assert')
const { Types: { ObjectId } } = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const isAuthed = require('../../lib/isAuthed')
const { Roles: { EDITOR, ADMIN } } = require('../../lib/isAuthed')
const generateQiniuToken = require('../../lib/generateQiniuToken')
const { isEmail, isLength } = require('validator')
const { isEmpty, omitBy } = require('lodash')
const { User, News } = require('../../db')
const { JWT_SECRET } = process.env

module.exports = {
    utils: {
        qiniuToken (_, args, { auth }) {
            assert(isAuthed(auth), '401')

            return generateQiniuToken()
        }
    },
    profile: {
        async get (_, args, { auth }) {
            assert(isAuthed(auth), '401')
            const { id } = auth

            const user = await User.findById(id)
            assert(!!user, 'user_not_found')

            return user.toJSON()
        },
        async update (_, { profile }, { auth }) {
            assert(isAuthed(auth), '401')
            const { id } = auth

            const user = await User.findById(id)
            assert(!!user, 'user_not_found')

            user.set(profile)
            await user.save()

            return user.toJSON()
        },
    },
    user: {
        async list (_, { options }, { auth }) {
            assert(isAuthed(auth, ADMIN), '401')

            const results = await User.find(null, null, options)
            return results
        },
        async update(_, { user }, { auth }) {
            assert(isAuthed(auth, ADMIN), '401')

            const _user = await User.findById(user._id)
            assert(!!_user, '400')

            _user.set(user)
            await _user.save()

            return _user.toJSON()
        },
    },
    news: {
        async list (_, { options, filters }, { auth }) {
            assert(isAuthed(auth, EDITOR), '401')

            const results = await News.find(omitBy(filters, isEmpty), null, options).populate('user')
            return results
        },
        async create (_, args, { auth }) {
            assert(isAuthed(auth, EDITOR), '401')
            const { id } = auth

            const news = new News({
                userID:  ObjectId(id),
                user: ObjectId(id),
            })
            await news.save()

            return news.get('id')
        },
        async update (_, { news }, { auth }) {
            assert(isAuthed(auth, EDITOR), '401')

            const _news = await News.findById(news._id)
            assert(!!_news, '400')

            _news.set(news)
            await _news.save()

            return _news.toJSON()
        },
        async get (_, { id }, { auth }) {
            assert(isAuthed(auth, EDITOR), '401')

            const news = await News.findById(id).populate('user')
            assert(!!news, '400')

            return news.toJSON()
        },
    },
    auth: {
        async login (_, { form: { email, password } }) {
            const isValid = isEmail(email) && isLength(password, { min: 6, max: 32 })
            assert(isValid, 'bad_request@login')

            const user = await User.findOne({ email })
            assert(!isEmpty(user), 'user_not_found@login')

            const result = await bcrypt.compare(password, user.get('password'))
            assert(result, 'wrong_password@login')

            const payload = { id: user.get('id'), roles: user.get('roles') || { [ADMIN]: false, [EDITOR]: false } }
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1day' })

            return token
        },
        async renew (_, args, { auth }) {
            assert(isAuthed(auth), '401')

            const { id } = auth

            const user = await User.findById(id)
            assert(!isEmpty(user), 'user_not_found@renew')

            const payload = { id: user.get('id'), roles: user.get('roles') || { [ADMIN]: false, [EDITOR]: false } }
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1day' })

            return token
        }
    }
}
