import anyTest, { ExecutionContext, TestInterface } from 'ava'
import { ConfigOption } from "bcfg";
import { FullNode } from "bcoin";
import { Plugin as Bgraphql } from "./plugin";

const networkName = "regtest";
const apiKey = 'foo';

const options: ConfigOption = {
  network: networkName,
  apiKey,
  memory: true,
  workers: true,
  httpHost: '::'
}

const fullNode = new FullNode({...options, plugins: [Bgraphql]})

interface PluginTestContext {
  [key: string]: any;
}

const test = anyTest as TestInterface<PluginTestContext>

test.before('open nodes', async (t: ExecutionContext<PluginTestContext>) => {
  await fullNode.open()
})

test.after('close nodes', async (t: ExecutionContext<PluginTestContext>) => {
  await fullNode.close();
});

test('it can responed to simple query', async (t: ExecutionContext<PluginTestContext>) => {

})