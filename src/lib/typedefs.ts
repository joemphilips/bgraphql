import { gql } from "apollo-server";

export const typeDefs = gql`
  type Block {
    header: BlockHeader!
    tx: [Transaction]
  }

  type Transaction {
    version: number!
    nSequence: number!
    inputs: [In]
    outputs: [Out]
  }

  type In {
    index: number!
    outpoint: Outpoint!
  }

  type Outpoint {
    txid: string!
    index: number!
  }

  type Out {
    index: number!
    address: string!
  }
`