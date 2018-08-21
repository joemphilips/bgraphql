// tslint:disable object-literal-sort-keys
import {ApolloServer, Request} from 'apollo-server';
import { ApolloServerBase, Config } from 'apollo-server-core';
import { FullNode } from 'bcoin';
import { Server } from 'bweb'
import * as http from 'http'
import { buildSchema } from 'type-graphql';


export interface Context extends Request {
  node: FullNode
  token: string
}
export class ApolloServerBweb extends ApolloServerBase {
  public static path = "/graphql"
  public apolloServer: ApolloServer;
  constructor(public node: FullNode, public resolvers, config?: Config) {
    super(config)
  }

  public async open() {
    const schema = await buildSchema({resolvers: this.resolvers})
    this.apolloServer = new ApolloServer({schema})
  }

  public async close() {
    await this.apolloServer.stop()
  }

  /**
   * An method for running as standalone server.
   * It will listen to port 4000 with no arguments.
   * @param args - This will be passed directly to `http.createServer`
   */
  public async listen(requestListener?: (req: http.IncomingMessage, res: http.ServerResponse) => void) {
    await this.apolloServer.listen(requestListener)
  }

  public applyMiddleware({app, path, cors}: ServerRegistration) {
    if(!this.apolloServer) {
      throw new Error("Must call open() before applying middleware")
    }
    if (!path) {
      path = ApolloServerBweb.path
    }

    if (cors) {
      app.use(app.cors())
    }
    // Note: ApolloServer is for 
    // app.use(path, async (req, res) => {})
  }
}

export interface ServerRegistration {
  app: Server
  path?: string
  cors?: boolean
}