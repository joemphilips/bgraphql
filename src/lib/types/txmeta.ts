import { Field, ObjectType } from 'type-graphql';
import { Transaction } from './transaction';

@ObjectType()
export class TXMeta {
  @Field()
  tx: Transaction;

  @Field()
  mtime: number;

  @Field()
  height: number;

  @Field()
  block: Buffer; // block hash

  @Field()
  time: number;

  @Field()
  index: number;
}
