const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Profile {
        id: ID
        username: String
        fullname: String
        bio: String
    }

    input ProfileInput {
        fullname: String
        bio: String
        avatar: String
    }

    input LoginForm {
        email: String!
        password: String!
    }

    enum NewsCategory {
        news
        project
        event
        notice
        ad
        story
    }

    enum NewsStatus {
        draft
        active
        deleted
    }

    enum NewsLevel {
        hidden
        normal
        featured
        mustread
    }

    input ListOptions {
        skip: Int = 0
        limit: Int = 32
        sort: String = "-createdAt"
    }

    input NewsListFilters {
        category: NewsCategory
        level: NewsLevel
        status: NewsStatus
    }

    type News {
        id: ID
        title: String
        content: String

        category: NewsCategory
        status: NewsStatus
        level: NewsLevel

        color: String
        screen: String
        image: String
        poster: String
        thumbnail: String
        link: String
        author: String

        userID: ID
        user: Profile

        createdAt: String
        updatedAt: String
    }

    input NewsInput {
        id: ID!
        title: String
        content: String

        category: NewsCategory
        status: NewsStatus
        level: NewsLevel

        color: String
        screen: String
        image: String
        poster: String
        thumbnail: String
        link: String
        author: String
    }

    type Query {
        profile: Profile
        news(id: ID!): News
        newsList(options: ListOptions, filters: NewsListFilters = {}): [News]
    }

    type Mutation {
        login(form: LoginForm!): String
        profile(profile: ProfileInput!): Profile
        newsID: ID
        news(news: NewsInput!): News
    }
`
module.exports = typeDefs
