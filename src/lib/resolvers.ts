import { FullNode } from "bcoin";
import { Context } from "./apollo-server-bweb";

type ResolverFunction = (root?: any, args?: any, context?: Context, info?: any) => {}
interface ResolverMap {
  [key: string]: { [key: string]: ResolverFunction}
}
// tslint:disable object-literal-sort-keys

export function createResolvers(node: FullNode) {
  const resolvers: ResolverMap = {
    Query: {
      Account: async  (root, args, context, info) => {},
      Block: async (root, args, context, info) => {
      },
      Transaction: async (root, args, context, info) => {
        context.node.getTX(args.hash)
      }
    },
    Mutation: {
      Wallet: async () => {}
    },
  }

  return resolvers
}