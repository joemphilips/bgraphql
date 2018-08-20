// tslint:disable object-literal-sort-keys

export function createResolvers(node) {
  const resolvers = {
    Query: {
      Account (root, args, context, info) {},
      Block (root, args, context, info) {},
      Transaction (root, args, context, info) {}
    },
    Account: {
      Wallet() {}
    },
    Transaction: {
      Block () {}
    }
  }

  return resolvers
}