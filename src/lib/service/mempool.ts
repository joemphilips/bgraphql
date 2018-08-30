import { Mempool, primitives, TX } from 'bcoin';
import { Inject, Service } from 'typedi';

@Service()
export class MempoolService {
  constructor(@Inject('MEMPOOL') private readonly mempool: Mempool) {}

  async getTX(txid: Buffer): Promise<TX> {
    return this.mempool.getTX(txid);
  }

  async getMeta(txid: Buffer): Promise<primitives.TXMeta> {
    return this.mempool.getMeta(txid);
  }
}
