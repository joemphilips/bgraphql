// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bcoin
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'bcoin' {
  import { BufferWriter, BufferReader } from 'bufio';
  import { BufferMap } from 'buffer-map';
  export namespace coins {
    export class Coins {
      map: Map<number, CoinEntry>;
      add(index: Coin, coin: CoinEntry): CoinEntry;
      addOutput(index: number, output: Output): CoinEntry;
      addIndex(tx: TX, index: number, height: number): CoinEntry;
      addCoin(coin: Coin): CoinEntry;
      has(index: number): boolean;
      isUnspent(index: number): boolean;
      get(index: number): CoinEntry | null;
      getOutput(index: number): Output | null;
      getCoin(prevout: Outpoint): Coin | null;
      spend(index: number): CoinEntry | null;
      remove(index: number): CoinEntry | null;
      isEmpty(): boolean;
      private fromTX(tx: TX, height: number): Coins;
      static fromTX(tx: TX, height: number): Coins;
    }

    export class CoinEntry {
      version: number;
      height: number;
      coinbase: boolean;
      output: Output;
      spent: boolean;
      raw: null | Buffer;
      toOutput(): Output;
      toCoin(prevOut: Outpoint): Coin;
      private fromOutput(output: TX): CoinEntry;
      static fromOutput(output: Output): CoinEntry;
      private fromCoin(coin: Coin): CoinEntry;
      static fromCoin(coin: Coin): CoinEntry;
      private fromTX(tx: TX, index: number, height: number): CoinEntry;
      static fromTX(tx: TX, index: number, height: number);
      getSize(): number;
      toWriter(bw: BufferWriter): BufferWriter;
      toRaw(): Buffer;
      private fromReader(br: BufferReader): CoinEntry;
      static fromReader(br: BufferReader): CoinEntry;
      private fromRaw(data: Buffer): CoinEntry;
      static fromRaw(data: Buffer): CoinEntry;
    }

    export class CoinView {
      public map: BufferMap<Coins>;
      public undo: UndoCoins;
      constructor();
      get(hash: Buffer): Coins;
      has(hash: Buffer): boolean;
      add(hash: Buffer, coins: Coins): Coins;
      ensure(hash: HashKey): Coins;
      remove(hash: HashKey): Coins | null;
      addTX(tx: TX, height: number): Coins;
      removeTX(tx: TX, height: number): Coins;
      addEntry(prevout: Outpoint, coin: CoinEntry): CoinEntry | null;
      addCoin(coin: Coin): CoinEntry | null;
      addOutput(prevout: Outpoint, output: Output): CoinEntry | null;
      /**
       *
       * @param tx
       * @param index - index of an output for the tx.
       * @param height
       */
      addIndex(tx: TX, index: number, height: number): CoinEntry | null;
      spendEntry(prevout: Outpoint): CoinEntry | null;
      removeEntry(prevout: Outpoint): CoinEntry | null;
      hasEntry(prevout: Outpoint): boolean;
      getEntry(prevout: Outpoint): CoinEntry | null;
      isUnspent(prevout: Outpoint): boolean;
      getCoin(prevout: Outpoint): Coin | null;
      getOutput(prevout: Outpoint): Output | null;
      getHeight(prevout: Outpoint): number;
      isCoinbase(prevout: Outpoint): boolean;
      hasEntryFor(input: Input): CoinEntry | null;
      isUnspentFor(input: Input): boolean;
      getCoinFor(input: Input): Coin | null;
      getHeightFor(input: Input): number;
      isCoinbaseFor(input: Input): boolean;
      /**
       * Get coins from database.
       * and add to view as CoinEntry
       * @param db
       * @param prevout
       */
      readCoin(
        db: blockchain.ChainDB,
        prevout: Outpoint
      ): Promise<CoinEntry | null>;
      /**
       * perform `readCoin` to every inputs of TX.
       * @param db
       */
      readInputs(db: blockchain.ChainDB): Promise<boolean>;
      spendInputs(db: blockchain.ChainDB, tx: TX): Promise<boolean>;
      getSize(tx: TX): number;
      toWriter(bw: BufferWriter, tx: TX): BufferWriter;
      private fromReader(bw: BufferReader, tx: TX): CoinView;
      static fromReader(bw: BufferReader, tx: TX): CoinView;
    }
    export class UndoCoins {
      items: UndoCoin[];
      constructor();
      push(coin: CoinEntry): number;
      getSize(): number;
      toRaw(): Buffer;
      private fromRaw(data: Buffer): UndoCoins;
      static fromRaw(data: Buffer): UndoCoins;
      isEmptry(): boolean;
      apply(view: CoinView, prevout: Outpoint): void;
    }

    class UndoCoin {}
  }

  export class Coins extends coins.Coins {}
  export class CoinEntry extends coins.CoinEntry {}
  export class CoinView extends coins.CoinView {}
  export class UndoCoins extends coins.UndoCoins {}
}
