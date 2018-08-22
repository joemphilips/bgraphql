import { Field, ObjectType } from 'type-graphql';
import { Outpoint } from './outpoint';

@ObjectType()
export class In {
  @Field()
  index: number;

  @Field()
  outpoint: Outpoint;
}
