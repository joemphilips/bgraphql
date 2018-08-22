import { Chain, Mempool } from 'bcoin';
import { Arg, Field, ID, ObjectType, Query, Resolver } from 'type-graphql';
import { In } from './in';
import { Out } from './out';
import { ResolverError } from './util';
@ObjectType()
export class Transaction {
  @Field(type => ID)
  txid;

  @Field()
  nSequence: number;

  @Field()
  version: number;

  @Field(type => [In])
  inputs: In[];

  @Field(type => [Out])
  outputs: Out[];
}

@Resolver(Transaction)
export class TransactionResolver {
  constructor(private mempool: Mempool, private chain: Chain) {}

  @Query(returns => Transaction)
  async Transaction(@Arg('txid') txid: string) {
    const hash = Buffer.from(txid, 'hex');
    let tx = await this.chain.getMeta(hash);
    if (!tx) {
      tx = await this.mempool.getMeta(hash);
      if (!tx) {
        throw new ResolverError();
      }
    }
    return tx;
  }
}
