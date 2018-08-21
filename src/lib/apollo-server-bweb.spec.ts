import anyTest, { ExecutionContext, TestInterface } from 'ava'
import { ConfigOption } from 'bcfg';
import { FullNode } from 'bcoin';
import { ApolloServerBweb } from './apollo-server-bweb';
import {TransactionResolver} from './types'

const networkName = 'regtest';
const apiKey = 'foo';

const options: ConfigOption = {
  network: networkName,
  apiKey,
  memory: true,
  workers: true,
  httpHost: '::'
};

const fullNode = new FullNode(options);
const resolvers = [TransactionResolver]

const server = new ApolloServerBweb(fullNode, resolvers)

interface ApolloWebServerTestContext {
  [key: string]: any
}

const test = anyTest as TestInterface<ApolloWebServerTestContext>

test.before("open http", async (t: any) => {
  await server.open()
  await server.listen()
})

test.after('close http', async (t: any) => {
  await server.close()
})

test("apollo-server-bweb can run as standalone", async (t: ExecutionContext<ApolloWebServerTestContext>))