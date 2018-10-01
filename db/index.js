const mongoose = require('mongoose')
const ObjectId = 'ObjectId'
const timeFields = {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
})

const UserLink = mongoose.model('UserLink', {
    provider: String,
    key: String,
    user: {
        type: ObjectId,
        ref: 'User',
    },
})

const User = mongoose.model('User', {
    username: String,
    email: String,
    password: String,
    status: {
        type: String, // pending, active, locked
        default: 'pending',
    },

    name: String,
    bio: String,
    avatar: String,
    blog: String,

    ...timeFields,
})

const Figure = mongoose.model('Figure', {
    caption: String,
    url: String,
    width: Number,
    height: Number,
    source: String,
    sourceUrl: String,

    userID: ObjectId,
    ...timeFields
})

const News = mongoose.model('News', {
    title: String,
    content: String,

    category: {
        type: String, // news, project, event, story, ad, notice
        default: 'news'
    },
    status: {
        type: String, // draft, active, deleted,
        default: 'draft',
    },
    level: {
        type: String, // hidden, normal, featured, mustread
        default: 'normal'
    },

    color: {
        type: String,
        default: '#ffffff'
    },
    screen: String, // 1600x800
    image: String, // 640x480
    poster: String, // 600x800
    thumbnail: String, // 256x256
    link: String,
    author: String,

    userID: ObjectId,
    user: {
        type: ObjectId,
        ref: 'User',
    },
    ...timeFields
})

module.exports = {
    User,
    News,
    Figure,
    UserLink,
}
