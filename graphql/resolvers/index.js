const { profile, auth, news, utils, user } = require('../actions')

const resolvers = {
    Profile: {
        _id: ({ _id }) => _id.toString(),
    },
    News: {
        userID: ({ userID }) => userID.toString(),
        _id: ({ _id }) => _id.toString(),
    },
    Query: {
        profile: profile.get,
        news: news.get,
        newsList: news.list,
        userList: user.list,
    },
    User: {
        _id: ({ _id }) => _id.toString(),
        roles: one => one.roles || one.get('roles'),
    },
    Mutation: {
        newsID: news.create,
        news: news.update,
        user: user.update,

        profile: profile.update,

        login: auth.login,
        renew: auth.renew,

        qiniuToken: utils.qiniuToken,
    }
}

module.exports = resolvers
