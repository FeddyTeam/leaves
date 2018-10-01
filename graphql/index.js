const { ApolloServer } = require('apollo-server-express')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

const decodeJWT = require('../lib/decodeJWT')

const context = async ({ req }) => {
    const decoded = await decodeJWT(req)

    return { auth: decoded }
}

module.exports = new ApolloServer({
    typeDefs,
    resolvers,
    context,
})
