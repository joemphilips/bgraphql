import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Out {
  @Field()
  index: number;

  @Field()
  address: string;
}
