const { profile, auth, news } = require('../actions')

const resolvers = {
    News: {
        userID: ({ userID }) => userID.toString()
    },
    Query: {
        profile: profile.get,
        news: news.get,
        newsList: news.list,
    },
    Mutation: {
        newsID: news.create,
        news: news.update,

        profile: profile.update,

        login: auth.login,
    }
}

module.exports = resolvers
