// tslint:disable object-literal-sort-keys
import {ApolloServer} from 'apollo-server';

export class ApolloServerBweb {
  public apolloServer;
  constructor(typeDefs, resolvers) {
    this.apolloServer = new ApolloServer({
     typeDefs,
     resolvers,
     context: ({req}) => ({nodeAuth: req.query.token}) 
    });
  }

  public applyMiddleware({app}) {
    app.use(this.apolloServer)
  }
}