const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Profile {
        _id: ID
        username: String
        name: String
        bio: String
        avatar: String
        blog: String
    }

    enum UserStatus {
        pending
        active
        deleted
    }

    type UserRoles {
        admin: Boolean
        editor: Boolean
    }

    input UserRolesInput {
        admin: Boolean
        editor: Boolean
    }

    type User {
        _id: ID
        email: String
        status: UserStatus
        username: String
        name: String
        bio: String
        avatar: String
        blog: String
        roles: UserRoles
    }

    input UserInput {
        _id: ID!
        username: String
        email: String
        status: UserStatus
        roles: UserRolesInput
    }

    input ProfileInput {
        name: String
        bio: String
        blog: String
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
        _id: ID
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
        _id: ID!
        title: String!
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

    enum CommentResourceType {
        none
    }

    type Comment {
        _id: ID
        content: String
        targetID: ID
        resourceType: CommentResourceType
        resourceID: ID
        userID: ID
        user: Profile
        createdAt: String
        updatedAt: String
    }

    type Topic {
        _id: ID
        title: String
        createdAt: String
        updatedAt: String
        comments: [Comment]
    }

    input TopicInput {
        title: String!
    }

    input CommentInput {
        targetID: ID!
        content: String
        resourceType: CommentResourceType
        resourceID: ID
    }

    type Query {
        profile: Profile
        news(id: ID!): News
        newsList(options: ListOptions, filters: NewsListFilters = {}): [News]
        userList(options: ListOptions): [User]

        topicList(options: ListOptions): [Topic]
        topic(id: ID!): Topic
        commentList(targetID: ID!, options: ListOptions): [Comment]

        userSelect(ids: [ID]): [Profile]
    }

    type Mutation {
        login(form: LoginForm!): String
        renew: String

        profile(profile: ProfileInput!): Profile
        newsID: ID
        news(news: NewsInput!): News
        user(user: UserInput!): User

        qiniuToken: String

        topic(topic: TopicInput!): Topic
        comment(comment: CommentInput!): Comment
    }



`
module.exports = typeDefs
