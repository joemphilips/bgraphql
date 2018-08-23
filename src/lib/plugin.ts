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
  public server: ApolloServerBweb;

  constructor(public node: FullNode) {
    super();
    bsert(node.http, 'node must have http interface');
    const resolvers = [TransactionResolver];
    this.server = new ApolloServerBweb({
      chain: this.node.chain,
      mempool: this.node.mempool,
      resolvers
    });
  }

  public async open() {
    await this.server.open();
    // run server as middleware for full node
    this.server.applyMiddleware({ app: this.node.http });
  }

  public async close() {
    await this.server.close();
  }
}
