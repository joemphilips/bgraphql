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
import { ChainService } from '../service/chain';
import { MempoolService } from '../service/mempool';
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
    private readonly mempool: MempoolService,
    private readonly chain: ChainService
  ) {}

  @Query(returns => Transaction, { nullable: true })
  async transactionById(@Arg('txid') txid: string) {
    const hash = Buffer.from(txid, 'hex');
    let tx = await this.chain.getTX(hash);
    if (!tx) {
      tx = await this.mempool.getTX(hash);
      if (!tx) {
        return null;
      }
    }
    return tx;
  }

  @FieldResolver()
  async txid(@Root() tx: Transaction) {
    return tx.txid;
  }
}
