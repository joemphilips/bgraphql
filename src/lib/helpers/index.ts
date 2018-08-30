import { MTX, Chain, Miner, Address, KeyRing, script, Block } from 'bcoin';
import * as assert from 'assert';

export async function prepareChain(
  chain: Chain,
  miner: Miner
): Promise<[Block, string]> {
  // tslint:disable-next-line
  console.log('preparing blockchain ...');
  const ring = KeyRing.generate();
  const address = ring.getAddress();
  const mtx = new MTX();
  for (let i = 0; i < 200; i++) {
    const block = await miner.cpu.mineBlock(null, address);
    assert.ok(block);
    chain.add(block);
  }

  const fund = (await chain.getBlock(chain.height - 100)).txs[0];
  mtx.addTX(fund, 0);
  mtx.addOutput({
    value: 4950000000, // 49.5 BTC
    address: Address.fromBech32('bc1qnjhhj5g8u46fvhnm34me52ahnx5vhhhuk6m7ng')
  });
  mtx.addOutput({ value: 40000000 /* 0.4 BTC */, address: ring.getAddress() });
  mtx.sign(ring, script.common.hashType.ALL);
  const [tx, view] = mtx.commit();

  const job = await miner.cpu.createJob();
  job.addTX(tx, view);
  job.refresh();
  return [await job.mineAsync(), tx.txid().toString('hex')];
}
