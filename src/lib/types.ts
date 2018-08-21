import { FullNode } from 'bcoin';
import {Arg, Field, ID, ObjectType, Query, Resolver} from 'type-graphql'
@ObjectType()
export class Transaction {

  @Field(type => ID)
  txid

  @Field()
  nSequence: number

  @Field()
  version: number

  @Field(type => [In])
  inputs: In[]

  @Field(type => [Out])
  outputs: Out[]
}

@Resolver(Transaction)
export class TransactionResolver {

  constructor(private node: FullNode) {}

  @Query(returns => Transaction)
  async Transaction(@Arg("txid") txid: Buffer) {
    const tx =  await this.node.getTX(txid);
    if (!tx) {throw new ResolverError()}
    return tx
  }

}

class ResolverError extends Error {}

@ObjectType()
export class TXMeta {
  @Field()
  tx: Transaction

  @Field()
  mtime: number

  @Field()
  height: number

  @Field()
  block: Buffer // block hash

  @Field()
  time: number

  @Field()
  index: number
}

@ObjectType()
export class In {
  @Field()
  index: number

  @Field()
  outpoint: Outpoint
}

export class Out {
  @Field()
  index: number

  @Field()
  address: string
}

@ObjectType()
export class Outpoint {
  @Field(type => ID)
  txid: string

  @Field()
  index: number
}