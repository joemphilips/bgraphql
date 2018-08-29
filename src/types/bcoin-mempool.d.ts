declare module 'bcoin' {
  import { DB, Batch } from 'bdb';
  import Logger, { LoggerContext } from 'blgr';
  import { BufferMap } from 'buffer-map';
  import { Lock } from 'bmutex';
  import { RollingFilter } from 'bfilter';
  export namespace mempool {
    class ConfirmStats {
      type: string;
      decay: number;
      maxConfirms: number;
      buckets: Float64Array;
      bucketMap: DoubleMap;
      confAvg: number[];
      curBlockConf: number[];
      unconfTX: number[];
      oldUnconfTx: Int32Array;
      curBlockTX: Int32Array;
      txAvg: Float64Array;
      curBlockVal: Float64Array;
      avg: Float64Array;
      logger?: LoggerContext;
      constructor(type: string, logger?: Logger);
      init(buckets: any[], maxConfirms: number, decay: number);
      clearCurrent(height: number): void;
      record(blocks: number, val: Rate | number): void;
      updateAverages(): void;
      estimateMedian(
        target: number,
        needed: number,
        breakpoint: number,
        greater: boolean,
        height: number
      ): Rate | number;
      addTX(height: number, val: number): number;
      removeTX(
        entryHeight: number,
        bestHeight: number,
        bucketIndex: number
      ): void;
      getSize(): number;
      toRaw(): Buffer;
      fromRaw(data: Buffer): ConfirmStats;
      static fromRaw(data: Buffer, type: string, logger?: Logger): ConfirmStats;
    }

    class DoubleMap {
      public buckets: any[][];
      constructor();
      insert(key, value): void;
      search(key: string): any;
    }

    class PolicyEstimator {
      static VERSION: number;
      public options: MempoolOptions;
      logger: Logger;
      minTrackedFee: number;
      minTrackedPri: number;
      feeStats: ConfirmStats;
      priStats: ConfirmStats;

      feeUnlikely: number;
      feeLikely: number;
      priUnlikely: number;
      priLikely: number;
      map: BufferMap;
      bestHeight: number;
      constructor(logger?: Logger);
      private init(): void;
      private reset(): void;
      private removeTX(hash: HashKey): void;
      isFeePoint(fee: Amount, priority: number): boolean;
      isPriPoint(fee: Amount, priority: number): boolean;
      processTX(entry: MempoolEntry, current: boolean): void;
      processBlockTX(height: number, entry: MempoolEntry): void;
      processBlock(
        height: number,
        entries: MempoolEntry[],
        current: boolean
      ): void;
      estimateFee(target: number, smart: boolean): Rate;
      estimatePriority(target: number, smart: boolean): number;
      getSize(): number;
      toRaw(): Buffer;
      fromRaw(data: Buffer): ConfirmStats;
      static fromRaw(data: Buffer, logger?: Logger): ConfirmStats;
      inject(estimator: PolicyEstimator): PolicyEstimator;
    }

    export class Fees extends PolicyEstimator {}

    export class Mempool {
      opened: boolean;
      options: MempoolOptions;
      network: Network;
      logger: LoggerContext;
      workers: WorkerPool;
      chain: Chain;
      fees: Fees;
      locker: Lock;

      cache: MempoolCache;
      size: number;
      freeCount: number;
      lastTime: number;
      lastFlush: number;
      tip: Buffer;
      waiting: BufferMap;
      orphans: BufferMap;
      map: BufferMap;
      spents: BufferMap;
      rejects: RollingFilter;
      coinIndex: CoinIndex;
      txIndex: TXIndex;

      constructor(options: MempoolArgument);

      public open(): Promise<void>;
      public close(): Promise<void>;
      public addBlock(block: ChainEntry, txs: TX[]): Promise<void>;
      /**
       * Notify the mempool that a block has been disconnected
       * fro the main chain (reinserts transactions into the mempool)
       * @param block
       * @param txs
       */
      public removeBlock(block: ChainEntry, txs: TX[]): Promise<void>;
      public _handleReorg(): Promise<void>;
      public reset(): Promise<void>;
      public limitSize(added: MempoolEntry): Promise<boolean>;
      public getTX(hash: Buffer): TX | null;
      public getEntry(hash: Buffer): MempoolEntry | null;
      public getCoin(hash: Buffer, index: number): Coin | null;
      /**
       * Check to see if a coin has been spent.
       * @param hash
       * @param index
       */
      public isSpent(hash: Buffer, index: number): boolean;
      public getSpent(hash: Buffer, index: number): MempoolEntry | null;
      public getSpentTX(hash: Buffer, index: number): TX | null;
      public getCoinsByAddress(addrs: Address[]): Coin[];
      public getTXByAddress(addrs: Address[]): TX[];
      public getMetaByAddress(addrs: Address[]): primitives.TXMeta[];
      public getMeta(hash: Buffer): primitives.TXMeta | null;
      /**
       * check if tx exists in mempool
       * @param hash - txid
       */
      public hasEntry(hash: Buffer): boolean;
      /**
       * similar to hasEntry, but checks for orphans too
       * @param hash
       */
      public has(hash: Buffer): boolean;
      /**
       * check if has been rejected recently
       * @param hash
       */
      public hasReject(hash: Buffer): boolean;
      /**
       * This will lock the mempool until the transaction is fully processed.
       * It will returns an Array of missing input tx id if fails.
       */
      public addTX(tx: TX, id?: number): Promise<null | Buffer[]>;
      public verify(entry: TX, view: CoinView): Promise<void>;
      /**
       * verify TX but without throwing error.
       * */
      public verifyResult(
        tx: TX,
        view: CoinView,
        flags: script.common.flags
      ): Promise<boolean>;
      private verifyInputs(
        tx: TX,
        view: CoinView,
        flags: script.common.flags
      ): Promise<void>;
      private addEntry(entry: MempoolEntry, view: CoinView): Promise<void>;
      /**
       * Generally called when new block is added to the main chain.
       * @param entry
       */
      private removeEntry(entry: MempoolEntry): void;
      /**
       * remove entry from the mempool ad recursively remove
       * spenders
       */
      public evictEntry(entry: MempoolEntry): void;
      private removeSpenders(entry: MempoolEntry): void;
      public countAncestors(entry: MempoolEntry): number;
      private updateAncestors(entry: MempoolEntry, map: Function): number;
      public countDescendants(entry: MempoolEntry): number;
      public getAncestors(entry: MempoolEntry): MempoolEntry[];
      public getDescendants(entry: MempoolEntry): MempoolEntry[];
      /**
       * Find a unconfirmed transactions that this transaction depends on.
       */
      public getDepends(tx: TX): Buffer[];
      public hasDepends(tx: TX): boolean;
      /**
       * get the full balance of all unspents in the mempool
       * (Useful for testing)
       */
      public getBalance(): Amount;
      public getHistory(): TX[];
      private getOrphan(hash: Buffer): TX;
      hasOrphan(hash: Buffer): boolean;
      private maybeOrphan(tx: TX, view: CoinView, id: number): null | Buffer[];
      public handleOrphans(parent: TX): Promise<TX[]>;
      private resolveOrphan(parent): Orphan[];
      private removeOrphan(hash: Buffer): boolean;
      private limitOrphans(): boolean;
      public isDoubleSpend(tx: TX): Promise<boolean>;
      /**
       * getCoinView with lock.
       */
      public getSpentView(tx: TX): Promise<CoinView>;
      private getCoinView(tx: TX): Promise<CoinView>;
      /**
       * Get all txid in the mempool.
       * Used for answering to MEMPOOL packets
       */
      public getSnapshot(): Buffer[];
      /**
       * Verify Sequence locks
       * @param tx
       * @param view
       * @param flags
       */
      public verifyLocks(
        tx: TX,
        view: CoinView,
        flags: blockchain.common.lockFlags
      );
      public verifyFinal(tx: TX, flags: blockchain.common.lockFlags);
      private trackEntry(entry: MempoolEntry, view: CoinView): any;
      private untrackEntry(entry: MempoolEntry, view: CoinView): any;
      private indexEntry(entry: MempoolEntry, view: CoinView): void;
      private removeDoubleSpends(tx): void;
      public getSize(): number;
      public prioritise(entry: MempoolEntry, pri: number, fee: Amount): void;
    }

    export type MempoolArgument = {
      chain: Chain; // mempool requires blockchain
    } & Partial<MempoolOptions>;

    export class MempoolOptions {
      network: Network | NetworkType;
      chain: Chain;
      logger: Logger;
      workers: WorkerPool;
      fees?: Fees;
      limitFree: boolean;
      limitFreeRelay: number;
      relayPriority: boolean;
      requireStandard: boolean;
      rejectAbsurdFees: number;
      prematureWitness: boolean;
      paranoidChecks: boolean;
      replaceByFee: boolean;
      maxSize: number;
      masOrphans: number;
      maxAncestors: number;
      expiryTime: number;
      minRelay: number;
      prefix?: string;
      location?: string;
      memory: boolean;
      maxFiles: number;
      cacheSize: number;
      compression: boolean;
      persistent: boolean;
      constructor(options: MempoolArgument);
      static fromOptions(options: MempoolArgument): MempoolOptions;
    }

    class TXIndex {
      index: BufferMap;
      map: BufferMap;
      constructor();
      reset(): void;
      get(addr: Buffer): TX[];
      getMeta(addr: Buffer): primitives.TXMeta[];
      insert(entry: primitives.TXMeta, view?: CoinView): void;
      remove(hash: Buffer): void;
    }

    class CoinIndex {
      index: BufferMap;
      map: BufferMap;
      constructor();
      reset(): void;
      get(addr: Buffer): Coin[];
      insert(tx: TX, index: number): void;
      remove(hash: Buffer, index: number): void;
    }

    /**
     * Orphan TX in mempool
     */
    class Orphan {
      id: number;
      tx: TX;
      raw: Buffer;
      missing: Buffer[]; // missing txid in outpoint
      toTX(): Buffer;
    }

    class MempoolCache {
      logger: Logger;
      chain: Chain;
      network: Network;
      /**
       * Exists only if specified `persistent`
       */
      db?: DB;
      batch?: Batch;
      constructor(options: MempoolArgument);
      getVersion(): Promise<number>;
      getTip(): Promise<Buffer>;
      getFees(): Promise<Fees | null>;
      getEntries(): MempoolEntry;
      getKeys(): Buffer[];
      open(): Promise<void>;
      close(): Promise<void>;
      save(entry: MempoolEntry): void;
      remove(hash: Buffer): void;
      /**
       * Save the highest Block hash to the cache
       * @param tip
       */
      sync(tip: Buffer): void;
      writeFees(fees: Fees): void;
      /**
       * clear batch and set new one
       */
      clear(): void;
      flush(): Promise<void>;
      init(): Promise<void>;
      /**
       * Verify...
       * 1. Check mempool cache exists. If it does not, than create new one.
       * 2. Check mempool version mismatch.
       * 3. Check tip equals to this.chain.tip.hash
       */
      verify(): Promise<boolean>;
      /**
       * Delete all Entry from db
       */
      wipe(): Promise<void>;
    }

    export class MempoolEntry {
      tx?: TX;
      height: number;
      size: number;
      sigops: number;
      priority: number;
      fee: number;
      deltaFee: number;
      time: number;
      value: number;
      coinbase: boolean;
      dependencies: boolean;
      descFee: number;
      descSize: number;
      constructor(options?: Partial<MempoolEntry>);
      static fromOptions(options: Partial<MempoolEntry>): MempoolEntry;
      static fromRaw(data: Buffer): MempoolEntry;
    }
  }

  export class Fees extends mempool.Fees {}

  export class Mempool extends mempool.Mempool {}

  export class MempoolEntry extends mempool.MempoolEntry {}
  export interface packets extends net.packets {}

  export class Peer extends net.Peer {}

  export class Pool extends net.Pool {}
}
