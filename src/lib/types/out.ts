import { Field, ObjectType, Resolver } from 'type-graphql';

@ObjectType()
export class Output {
  @Field()
  index: number;

  @Field()
  address: string;
}

@Resolver(Output)
export class OutputResolver {}
