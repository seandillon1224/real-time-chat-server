const {ApolloServer, PubSub} = require('apollo-server');
const Query = require("./resolvers/Queries")
const Mutation = require("./resolvers/Mutations")
const Subscription = require("./resolvers/Subscriptions")
const typeDefs = require("./typeDefs")


const subscribers = [];
const initialArr = [];

const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Subscription
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req) => ({ ...req, initialArr, pubsub, subscribers}),
});

apolloServer.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
