const {gql} = require('apollo-server');

const typeDefs = gql`
    type Message {
        id: ID!
        user: String!
        content: String!
    }

    type Query {
        messages: [Message]!
    }

    type Mutation {
        makeMessage(user: String!, content: String!): [Message]!
    }
    type Subscription {
        messages: [Message!]
    }
    
`;

module.exports = typeDefs;
