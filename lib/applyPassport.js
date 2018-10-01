const jwt = require('jsonwebtoken')
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const generatePayload = require('./generatePayload')
const { User, UserLink } = require('../db')

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, JWT_SECRET } = process.env
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
}, async (accessToken, refreshToken, profile, cb) => {
    const {
        username,
        provider
    } = profile

    const {
        name, blog, bio, avatar_url
    } = profile._json

    try {
        const _link = await UserLink.findOne({
            provider,
            key: profile.id,
        }).populate('user')

        if (_link) {
            return cb(null, _link.user)
        }

        const user = new User({
            username,
            name,
            blog,
            bio,
            avatar: avatar_url,
            status: 'active',
            roles: [],
        })
        await user.save()

        const link = new UserLink({
            provider,
            key: profile.id,
            user: user.get('id'),
        })
        await link.save()

        cb(null, user)
    } catch (err) {
        cb(err, null)
    }
}))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

module.exports = ({ app }) => {
    app.use(passport.initialize())
    app.get('/auth/github',
        passport.authenticate('github', { scope: [ 'user:email' ] }))
    app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/login' }),
        (req, res) => {
            const token = jwt.sign(generatePayload(req.user), JWT_SECRET, { expiresIn: '1d' })

            res.redirect(`/cb/success?token=${token}`)
        })
}
