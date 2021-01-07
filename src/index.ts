import dotenv from "dotenv";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import db from "./db/models";
import { getUserFromToken, createToken } from "./auth";
import { Date } from "./scalars";
import mongoose from "mongoose";
import { ContextCallback, ConnectionParams } from "types";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.once("open", () => console.log(`Connected to mongo !`));
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: { ...resolvers, Date },
  context: async ({ req, connection }: ContextCallback) => {
    if (connection) {
      return { ...db, req, ...connection.context };
    } else {
      const token = req.headers.authorization || "";
      const user = await getUserFromToken(token);

      return { ...db, req, user, createToken };
    }
  },
  subscriptions: {
    async onConnect(connectionParams: ConnectionParams) {
      if (connectionParams.authorization) {
        const user = await getUserFromToken(connectionParams.authorization);
        if (!user) {
          throw new AuthenticationError("not authedd");
        }
        return { user };
      }
      throw new AuthenticationError("not authenticated!");
    },
  },
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions), cookieParser());

apolloServer.applyMiddleware({ app, cors: false });

const serv = app.listen({ port: 4000 });

apolloServer.installSubscriptionHandlers(serv);
