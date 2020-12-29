import dotenv from "dotenv";
import { ApolloServer, AuthenticationError } from "apollo-server";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import db from "./db/models";
import { getUserFromToken, createToken } from "./auth";
import { Date } from "./scalars";
import mongoose from "mongoose";

dotenv.config();

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.once("open", () => console.log(`Connected to mongo !`));
}

interface ConnectionParams {
  authorization?: string;
}

interface ContextCallback {
  req: {
    headers: {
      authorization?: string;
    };
  };
  connection: any;
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: { ...resolvers, Date },
  context: async ({ req, connection }: ContextCallback) => {
    if (connection) {
      return { ...db, ...connection.context };
    } else {
      const token = req.headers.authorization || "";
      const user = getUserFromToken(token);

      return { ...db, user, createToken };
    }
  },
  subscriptions: {
    onConnect(connectionParams: ConnectionParams) {
      console.log(connectionParams);
      if (connectionParams.authorization) {
        const user = getUserFromToken(connectionParams.authorization);
        if (!user) {
          throw new AuthenticationError("not authedd");
        }
        return { user };
      }
      throw new AuthenticationError("not authenticated!");
    },
  },
});

apolloServer.listen().then(({ url }: { url: string }) => {
  console.log(`🚀  Server ready at ${url}`);
});
