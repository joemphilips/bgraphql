// tslint:disable ordered-imports
import 'reflect-metadata';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { gql } from 'apollo-server-core';
import anyTest, { ExecutionContext, TestInterface } from 'ava';
import { Chain, Mempool, Network, WorkerPool } from 'bcoin';
import { GraphQLSchema } from 'graphql';
import fetch from 'node-fetch';
import { buildSchema } from 'type-graphql';
import { ApolloServerBweb } from './apollo-server-bweb';
import { TransactionResolver } from './types/transaction';

const networkName = 'regtest';
const network = Network.get(networkName);
const apiKey = 'foo';
const port = 4000;

// const fullNode = new FullNode(options);

const workers = new WorkerPool({
  enabled: true
});

const options = {
  network,
  memory: true,
  workers
};

const chain = new Chain({
  ...options
});
const mempool = new Mempool({ chain, ...options });

const resolvers = [TransactionResolver];

const server = new ApolloServerBweb({ chain, mempool, resolvers });

interface ApolloWebServerTestContext {
  schema: GraphQLSchema;
  client: ApolloClient<any>;
}

const test = anyTest as TestInterface<ApolloWebServerTestContext>;

test.before(
  'open http',
  async (t: ExecutionContext<ApolloWebServerTestContext>) => {
    await server.open();
    await server.listen({ port });
    t.context.schema = await buildSchema({ resolvers });
  }
);

test.after('close http', async () => {
  await server.close();
});

test.beforeEach(
  'prepare client',
  async (t: ExecutionContext<ApolloWebServerTestContext>) => {
    const httpLink = createHttpLink({
      uri: 'http://localhost:4000',
      fetch: fetch as any,
      headers: {
        authorization: `Bearer ${apiKey}`
      }
    });
    const cache = new InMemoryCache();
    t.context.client = new ApolloClient({
      link: httpLink,
      cache
    });
  }
);

test('it should return null for non existent txid', async (t: ExecutionContext<
  ApolloWebServerTestContext
>) => {
  const query = gql`
    query {
      transactionById(txid: "ffff") {
        outputs {
          address
        }
      }
    }
  `;
  let result;
  try {
    result = await t.context.client.query({ query });
  } catch (e) {
    logError(e, t);
  }
  t.is(result.data.transactionById, null);
});

// ---- helpers -----
function logError(e: any, t: any) {
  // tslint:disable-next-line
  t.log(e);
  for (const i of e.graphQLErrors) {
    t.log(i.extensions);
    t.log(i.locations);
    t.log(i.message);
    t.log(i.path);
  }
  t.fail(e);
}
