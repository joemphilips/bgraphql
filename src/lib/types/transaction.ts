import { Chain, Mempool } from 'bcoin';
import {
  Arg,
  Field,
  FieldResolver,
  ID,
  Int,
  ObjectType,
  Query,
  Resolver,
  ResolverInterface,
  Root
} from 'type-graphql';
import { In } from './in';
import { Output } from './out';
import { ResolverError } from './util';
@ObjectType()
export class Transaction {
  @Field(type => ID)
  txid;

  @Field()
  nSequence: number;

  @Field(type => Int)
  version: number;

  @Field(type => [In])
  inputs: In[];

  @Field(type => [Output])
  outputs: Output[];
}

@Resolver(Transaction)
export class TransactionResolver implements ResolverInterface<Transaction> {
  constructor(
    private readonly mempool: Mempool,
    private readonly chain: Chain
  ) {}

  @Query(returns => Transaction)
  async transactionById(@Arg('txid') txid: string) {
    const hash = Buffer.from(txid, 'hex');
    let tx = await this.chain.getTX(hash);
    if (!tx) {
      tx = await this.mempool.getTX(hash);
      if (!tx) {
        throw new ResolverError();
      }
    }
    return tx;
  }

  @FieldResolver()
  async txid(@Root() tx: Transaction) {
    return tx.txid;
  }
}
