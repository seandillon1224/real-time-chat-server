import { gql } from "apollo-server";

const typeDefs = gql`
 scalar Date

  type Message {
    user: User!
    content: String!
    chatroom: Chatroom!
    createdAt: Date!
  }
  
  type User {
    name: String!
    password: String!
    messages: [Message]!
    chatRooms: [Chatroom]!
    createdAt: Date!
  }

  type Chatroom {
      messages: [Message]!
      users: [User]!
      createdAt: Date!
  }

  type Query {
    messages: [Message]!
  }

  type Mutation {
    makeMessage(user: String!, content: String!): [Message]!
  }
  type Subscription {
    messageAdded(chatroomId: Int!): [Message!]
  }
`;

export default typeDefs;
