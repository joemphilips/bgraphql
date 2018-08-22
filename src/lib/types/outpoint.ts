import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Outpoint {
  @Field(type => ID)
  txid: string;

  @Field()
  index: number;
}
