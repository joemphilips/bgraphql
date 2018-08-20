import {BcoinPlugin, BcoinPluginInstance, Node} from 'bcoin';
import bsert from'bsert';
import { EventEmitter } from 'events';
import { ApolloServerBweb } from "./apollo-server-bweb";
import { createResolvers } from "./resolvers";
import { typeDefs } from "./typedefs";

export class Plugin implements BcoinPlugin, BcoinPluginInstance extends EventEmitter {
  public static id = "bgraphql"
  public static init(node) {
    return new Plugin(node)
  }

  constructor(public node: Node) {
    super()
    bsert(node.http, 'node must have http interface');
    const server = new ApolloServerBweb(typeDefs, createResolvers(this.node));
    // modify node.http to have `/graphql` in it's route
    server.applyMiddleware(this.node.http);
  }

  public async open() {
    this.http.open()
  }

  public async close() {
    await this.node.close()
  }
}