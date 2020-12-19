import {ApolloServer, AuthenticationError} from 'apollo-server';
import resolvers from 'resolvers';
import typeDefs from './typeDefs'
import db from 'db/models'
import {getUserFromToken, createToken} from './auth';
import {Date} from './scalars'

interface ConnectionParams {
  auth?: string
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: {...resolvers, Date},
  context: async ({req, connection}) => {
    if (connection) {
      return {...db, ...connection.context }
    } else {
      const token = req.headers.authorization || "";
      const user = getUserFromToken(token);

      return {...db, user, createToken};
    }
  },
  subscriptions: {
    onConnect(connectionParams: ConnectionParams) {
      if (connectionParams.auth) {
        const user = getUserFromToken(connectionParams.auth);
        if (!user) {
          throw new AuthenticationError('not authedd')
        }
        return {user}
      }
      throw new AuthenticationError('not authenticated!')
    }
  }
});

apolloServer.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
