import {BcoinPlugin, BcoinPluginInstance, FullNode} from 'bcoin';
import bsert from'bsert';
import { EventEmitter } from 'events';
import { ApolloServerBweb } from "./apollo-server-bweb";
import { createResolvers } from "./resolvers";
import { typeDefs } from "./typedefs";

export class Plugin extends EventEmitter implements BcoinPlugin, BcoinPluginInstance  {
  public static id = "bgraphql"
  public static subpath = "/graphql"
  public static init(node) {
    return new Plugin(node)
  }

  constructor(public node: FullNode) {
    super()
    bsert(node.http, 'node must have http interface');
    const server = new ApolloServerBweb(typeDefs, createResolvers(this.node), this.node);
    // modify node.http to have `/graphql` in it's route
    server.applyMiddleware({app: this.node.http});
  }

  public async open() {
    await this.node.open()
  }

  public async close() {
    await this.node.close()
  }
}