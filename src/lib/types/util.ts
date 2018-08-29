import { registerEnumType } from 'type-graphql';

export class ResolverError extends Error {}

export enum SighashType {
  ALL = 1,
  NONE = 2,
  SINGLE = 3,
  ANYONECANPAY = 0x08
}

registerEnumType(SighashType, {
  name: 'SighashType',
  description: 'Transaction signature hash'
});
