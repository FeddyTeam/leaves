const { profile, auth, news, utils, user, topic, comment } = require('../actions')

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
        topicList: topic.list,
        topic: topic.get,
        commentList: comment.list,
        userSelect: user.select,
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

        topic: topic.create,
        comment: comment.create,

        qiniuToken: utils.qiniuToken,
    }
}

module.exports = resolvers
