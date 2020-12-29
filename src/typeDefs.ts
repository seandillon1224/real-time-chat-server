import { gql } from "apollo-server";

const typeDefs = gql`
  scalar Date

  enum Theme {
    DARK
    LIGHT
  }

  type Message {
    _id: ID!
    user: User!
    content: String!
    chatroom: Chatroom!
    createdAt: Date!
  }

  type User {
    _id: ID!
    email: String
    name: String!
    password: String!
    messages: [Message]!
    chatRooms: [Chatroom]!
    createdAt: Date!
    theme: Theme!
  }

  type AuthUser {
    user: User!
    token: String!
  }

  type Chatroom {
    _id: ID!
    messages: [Message]!
    users: [User]!
    createdAt: Date!
  }

  type Query {
    messages: [Message]!
    users: [User]!
    chatrooms: [Chatroom]!
  }

  input UserInput {
    name: String!
    email: String
    password: String
  }

  input LoginInput {
    name: String!
    password: String!
  }

  type Mutation {
    makeMessage(user: String!, content: String!): Message!
    createUser(input: UserInput!): AuthUser!
    login(input: LoginInput!): AuthUser
  }
  type Subscription {
    messageAdded(chatroomId: Int!): Message!
  }
`;

export default typeDefs;
