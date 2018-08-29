import { Chain } from 'bcoin';
import { Inject, Service } from 'typedi';

@Service()
export class ChainService {
  constructor(@Inject('CHAIN') private readonly chain: Chain) {}

  async getTX(txid: Buffer) {
    return this.chain.getTX(txid);
  }

  async getMeta(txid: Buffer) {
    return this.chain.getMeta;
  }
}
