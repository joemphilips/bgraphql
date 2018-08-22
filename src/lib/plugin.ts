import { BcoinPlugin, BcoinPluginInstance, FullNode } from 'bcoin';
import bsert from 'bsert';
import { EventEmitter } from 'events';
import { ApolloServerBweb } from './apollo-server-bweb';
import { TransactionResolver } from './types/transaction';

export class Plugin extends EventEmitter
  implements BcoinPlugin, BcoinPluginInstance {
  public static id = 'bgraphql';
  public static init(node) {
    return new Plugin(node);
  }

  constructor(public node: FullNode) {
    super();
    bsert(node.http, 'node must have http interface');
  }

  public async open() {
    const resolvers = [TransactionResolver];
    const server = new ApolloServerBweb({
      chain: this.node.chain,
      mempool: this.node.mempool,
      resolvers
    });
    await server.open();
    // run server as middleware for full node
    server.applyMiddleware({ app: this.node.http });
    await this.node.open();
  }

  public async close() {
    await this.node.close();
  }
}
