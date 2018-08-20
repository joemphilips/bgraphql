// tslint:disable object-literal-sort-keys
import {ApolloServer, Request} from 'apollo-server';
import {FullNode } from 'bcoin';


export interface Context extends Request {
  node: FullNode
  token: string
}
export class ApolloServerBweb {
  public apolloServer: ApolloServer;
  constructor(typeDefs, resolvers, node: FullNode) {
    this.apolloServer = new ApolloServer({
     typeDefs,
     resolvers,
     context: ({req}) => ({...req, token: req.query.token, node}) 
    });
  }

  public applyMiddleware({app}) {
    app.use(this.apolloServer)
  }
}