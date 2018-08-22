// tslint:disable ordered-imports
import 'reflect-metadata';
import anyTest, { ExecutionContext, TestInterface } from 'ava';
import { ConfigOption } from 'bcfg';
import { FullNode } from 'bcoin';
import { Plugin as Bgraphql } from './plugin';

const networkName = 'regtest';
const apiKey = 'foo';

const options: ConfigOption = {
  network: networkName,
  apiKey,
  memory: true,
  workers: true,
  httpHost: '::'
};

const fullNode = new FullNode({ ...options, plugins: [Bgraphql] });

interface PluginTestContext {
  [key: string]: any;
}

const test = anyTest as TestInterface<PluginTestContext>;

test.before('open nodes', async () => {
  await fullNode.open();
});

test.after('close nodes', async () => {
  await fullNode.close();
});

test.skip('it can respond to simple query', async (t: ExecutionContext<
  PluginTestContext
>) => {
  t.pass();
});
