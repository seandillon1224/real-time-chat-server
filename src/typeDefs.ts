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
    createdAt: Date!
    refreshTokens: [RefreshToken]
    # theme: Theme!
  }

  type RefreshToken {
    hash: String!
    expiry: Date!
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

  input UserInput {
    name: String!
    email: String
    password: String
  }

  input LoginInput {
    name: String!
    password: String!
  }

  input ChatroomInput {
    creator: String!
    invitees: [String!]!
    message: String!
  }

  input MessageInput {
    user: String!
    chatroom: String!
    content: String!
  }

  type Query {
    messages: [Message]!
    users: [User]!
    chatrooms: [Chatroom]!
    chatroomsByUser: [Chatroom]!
  }

  type Mutation {
    createMessage(input: MessageInput!): Message!
    createChatRoom(input: ChatroomInput!): Chatroom!
    createUser(input: UserInput!): AuthUser!
    login(input: LoginInput!): AuthUser
    signOutUser(userId: ID!): Boolean!
  }
  type Subscription {
    messageAdded(chatroomId: String!): Message!
    chatrooms(user: String!): Chatroom!
  }
`;

export default typeDefs;
