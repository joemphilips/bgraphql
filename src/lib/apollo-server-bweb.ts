// tslint:disable object-literal-sort-keys
import { ApolloServer, Request } from 'apollo-server';
import { Chain, Mempool } from 'bcoin';
import { Server } from 'bweb';
import * as net from 'net';
import { buildSchema } from 'type-graphql';

export interface Context extends Request {
  chain: Chain;
  mempool: Mempool;
  token: string;
}
export class ApolloServerBweb {
  public static path = '/graphql';
  public apolloServer: ApolloServer;
  public chain: Chain;
  public mempool: Mempool;
  public resolvers: any[];
  constructor(options: ApolloServerBwebOption) {
    this.chain = options.chain;
    this.mempool = options.mempool;
    this.resolvers = options.resolvers;
  }

  public async open() {
    if (!this.chain.opened) {
      await this.chain.open();
    }
    if (!this.mempool.opened) {
      await this.mempool.open();
    }

    const schema = await buildSchema({ resolvers: this.resolvers });
    this.apolloServer = new ApolloServer({ schema });
  }

  public async close() {
    await this.apolloServer.stop();
    await this.chain.close();
    await this.mempool.close();
  }

  /**
   * An method for running as a standalone server.
   * It will listen to port 4000 with no arguments.
   * @param args - This will be passed directly to `http.createServer`
   */
  public async listen(args?: net.ListenOptions) {
    await this.apolloServer.listen(args);
  }

  public applyMiddleware({ app, path, cors }: ServerRegistration) {
    if (!this.apolloServer) {
      throw new Error('Must call open() before applying middleware');
    }
    if (!path) {
      path = ApolloServerBweb.path;
    }

    if (cors) {
      app.use(app.cors());
    }
    // Note: ApolloServer is for
    // app.use(path, async (req, res) => {})
  }
}

export interface ApolloServerBwebOption {
  chain: Chain;
  mempool: Mempool;
  resolvers: any;
}

export interface ServerRegistration {
  app: Server;
  path?: string;
  cors?: boolean;
}
