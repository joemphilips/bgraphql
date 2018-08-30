// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bcoin
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'bcoin' {
  import AsyncEmitter from 'bevent';
  import Logger, { LoggerContext } from 'blgr';
  import { Lock } from 'bmutex';
  import LRU from 'blru';
  import { BufferMap } from 'buffer-map';
  import { Batch, DB } from 'bdb';
  import BN from 'bcrypto/lib/bn.js';
  import { BloomFilter } from 'bfilter';

  export namespace blockchain {
    export class Chain extends AsyncEmitter {
      opened: boolean;
      options: ChainOptions;
      network: Network;
      logger: LoggerContext;
      workers?: WorkerPool;
      db: ChainDB;

      locker: Lock;
      invalid: LRU;
      state: DeploymentState;

      tip: ChainEntry;
      height: number;
      synced: boolean;

      orphanMap: BufferMap<Orphan>;
      orphanPrev: BufferMap;

      constructor(options?: Partial<ChainOptions>);
      open(): Promise<void>;
      close(): Promise<void>;
      private verifyContext(
        block: Block,
        prev: ChainEntry,
        flags: number
      ): Promise<ContextResult>;
      /**
       * perform all necessary contextual verification on a block,
       * excepts for PoW check.
       * @param block
       */
      public verifyBlock(block: Block): Promise<ContextResult>;
      public isMainHash(hash: HashKey): Promise<boolean>;
      isMainChain(entry: ChainEntry): Promise<boolean>;
      getAncestor(
        entry: ChainEntry,
        height: number
      ): Promise<ChainEntry | null>;
      getPrevious(entry: ChainEntry): Promise<ChainEntry | null>;
      getPrevCache(entry: ChainEntry): Promise<ChainEntry | null>;
      getNext(entry: ChainEntry): Promise<ChainEntry | null>;
      getNextEntry(entry: ChainEntry): Promise<ChainEntry | null>;
      getMedianTime(prev: ChainEntry, time?: number): Promise<number>;
      /**
       * returns true if entry is an ancestor of a checkpoint.
       * @param prev
       */
      isHistorical(prev: ChainEntry): Promise<boolean>;
      private verify(
        block: Block,
        prev: ChainEntry,
        flags: number
      ): Promise<DeploymentState>;
      public getDeployments(
        time: number,
        prev: ChainEntry
      ): Promise<DeploymentState>;
      private setDeploymentState(state: DeploymentState): void;
      private verifyDuplicates(block: Block, prev: ChainEntry): Promise<void>;
      private updateInputs(block: Block, prev: ChainEntry): Promise<CoinView>;
      /**
       * Perform contextual check to block transactions.
       * @param block
       * @param prev
       * @param state
       */
      private verifyInputs(
        block: Block,
        prev: ChainEntry,
        state: DeploymentState
      ): Promise<CoinView>;
      /**
       * Find common ancestor block for two blocks
       */
      private findFork(
        fork: ChainEntry,
        longer: ChainEntry
      ): Promise<ChainEntry>;

      /**
       * Called from setBestChain
       * @param competitor
       */
      private reorganize(competitor: ChainEntry): Promise<void>;
      private setBestChain(
        entry: ChainEntry,
        block: Block,
        prev: ChainEntry,
        flags: number
      ): Promise<void>;
      private saveAlternate(
        entry: ChainEntry,
        block: Block,
        prev: ChainEntry,
        flags: number
      ): Promise<void>;
      public reset(block: HashKey | number): Promise<void>;
      public replay(block: HashKey | number): Promise<void>;
      public invalidate(hash: HashKey): Promise<void>;
      public prune(): Promise<void>;
      public scan(
        start: HashKey,
        filter: BloomFilter,
        iter: ScanIterator
      ): Promise<void>;
      /**
       * Add block to the chain.
       */
      public add(
        block: Block,
        flags?: number,
        id?: number
      ): Promise<ChainEntry | null>;
      private connect(
        prev: ChainEntry,
        block: Block,
        flags: number
      ): Promise<ChainEntry>;
      private handleOrphans(entry: ChainEntry): Promise<void>;
      private isSlow(): boolean;
      private logStatus(
        start: [number, number],
        block: Block,
        entry: ChainEntry
      ): void;
      private verifyCheckpoint(prev: ChainEntry, hash: Buffer): boolean;
      private storeOrphan(block: Block, flags?: number, id?: number): void;
      private addOrphan(orphan: Orphan): Orphan;
      private removeOrphan(orphan: Orphan): Orphan;
      private hasNextOrphan(hash: Buffer): Orphan;
      private resolveOrphan(hash: Buffer): null | Orphan;
      public purgeOrphans(): null;
      public limitOrphans(): null;
      private hasInvalid(block: Block): boolean;
      private setInvalid(hash: Buffer): void;
      private removeInvalid(hash: Buffer): void;
      /**
       * Search chain (including orphans, invalids) to see if it has a block
       * @param hash - Block hash
       */
      public has(hash: Buffer): Promise<boolean>;
      public getEntry(hashOrHeight: Buffer | number): ChainEntry | null;
      public getHash(height: number | Buffer): Buffer | null;
      public getHeight(hash: Buffer): number;
      public hasEntry(hash: Buffer): Promise<boolean>;
      public getNextHash(hash: Buffer): Promise<Buffer | null>;
      public hasCoins(tx: TX): Promise<boolean>;
      public getTips(): Promise<Buffer[]>;
      public getHashes(start?: number, end?: number): Promise<Buffer[] | null>;
      private readCoin(prevOut: Outpoint): Promise<CoinEntry | null>;
      public getCoin(hash: Buffer, index: number): Promise<Coin | null>;
      public getBlock(hash: Buffer | number): Promise<Block | null>;
      public getRawBlock(hash: Buffer | number): Promise<Buffer | null>;
      public getBlockView(block: Block): Promise<CoinView>;
      public getMeta(hash: Buffer): Promise<primitives.TXMeta | null>;
      public getTX(hash: Buffer): Promise<primitives.TX | null>;
      public hasTX(hash: Buffer): Promise<boolean>;
      public getCoinsByAddress(addrs: Address[]): Promise<Coin[] | null>;
      public getHashesByAddress(addrs: Address[]): Promise<Buffer[] | null>;
      public getTXByAddress(addrs: Address[]): Promise<TX[] | null>;
      public getMetaByAddress(
        addrs: Address[]
      ): Promise<primitives.TXMeta[] | null>;
      public getOrphan(hash: Buffer): Block | null;
      public hasOrphan(hash: Buffer): boolean;
      public hasPending(hash: Buffer): boolean;
      public getCoinView(tx: TX): Promise<CoinView>;
      public getSpentView(tx: TX): Promise<CoinView>;
      /**
       * Test the chain if it is fully synced
       */
      public isFull(): boolean;
      /**
       * Check if chain is synced.
       * If it is, emit `"full"` event and set `this.synced` to `true`
       */
      private maybeSync(): void;
      public hasChainWork(): boolean;

      public getProgress(): number;
      /**
       * Calculate chain locator (array of hashes).
       * @param start - Height or hash to treat as the tip.
       * The current tip will be used if not present.
       */
      public getLocator(start?: HashKey): Promise<HashKey[]>;
      public getOrphanRoot(hash: HashKey): HashKey;
      public getProofTime(to: ChainEntry, from: ChainEntry): number;
      public getCurrentTarget(): Promise<number>;
      public getTarget(time: number, prev: ChainEntry): Promise<number>;
      public retarget(prev: ChainEntry, first: ChainEntry): number;
      /**
       * Equivalent to `FindForkInGlobalIndex()` in bitcoind
       * @param locator
       */
      public findLocator(locator: HashKey[]): Promise<HashKey>;

      // -------- bip9 related methods ---------
      /**
       * Check whether a versionbits deployment is active
       * @param prev
       * @param deployment
       * @example
       * await chain.isActive(tip, deployments.segwit);
       */
      public isActive(prev: ChainEntry, deployment: string): Promise<boolean>;
      /**
       * get bip9 state
       * 1. defined
       * 2. started
       * 3. locked_in
       * 4. active
       * 5. failed
       */
      public getState(
        prev: ChainEntry,
        deployment: string
      ): Promise<common.thresholdStates>;
      /**
       * Compute the version for a new block (BIP9: versionbits)
       * @param prev
       */
      public computeBlockVersion(
        prev: ChainEntry
      ): Promise<common.thresholdStates>;
      private getDeploymentState(): Promise<DeploymentState>;
      /**
       * check finality of transaction by calling tx.isFinal()
       * which examines nLocktime an nSequence
       * @param prev
       * @param tx
       * @param flags
       */
      public verifyFinal(
        prev: ChainEntry,
        tx: TX,
        flags: common.lockFlags
      ): Promise<boolean>;
      /**
       * @returns Array - tuple of minimum time and sequence of locks for tx
       *
       */
      private getLocks(
        prev: ChainEntry,
        tx: TX,
        view: CoinView,
        flags: common.lockFlags
      ): Promise<[number, number]>;
      /**
       * verify sequence locks
       */
      public verifyLocks(
        prev: ChainEntry,
        tx: TX,
        view: CoinView,
        flags: common.lockFlags
      ): Promise<boolean>;
    }

    class Orphan {}

    export namespace common {
      /**
       * flags for timelock verification.
       */
      export enum lockFlags {
        VERIFY_SEQUENCE = 1,
        MEDIAN_TIME_PAST = 2
      }

      /**
       * BIP9 threshold
       */
      export enum thresholdStates {
        DEFINED = 0,
        STARTED = 1,
        LOCKED_IN = 2,
        ACTIVE = 3,
        FAILED = 4
      }

      export enum flags {
        VERIFY_NONE = 0,
        VERIFY_POW = 1,
        VERIFY_BODY = 2
      }
    }

    export class VerifyError extends Error {}

    type ContextResult = [CoinView, DeploymentState];

    type ChainOptions = {
      network: Network | NetworkType;
      logger: Logger;
      workers?: WorkerPool;
      prefix?: string;
      location?: string;
      memory?: boolean;
    } & ChainDBOptions;

    class DeploymentState {
      flags: number;
      lockFlags: common.lockFlags;
      bip34: boolean;
      bip91: boolean;
      bip148: boolean;
      constructor();
      [key: string]: any;
    }

    export class ChainDB {
      options: Partial<ChainDBOptions>;
      network: Network;
      db: DB;
      stateCache: StateCache;
      state: ChainState;
      pending: null | ChainState;
      current: Batch | null;
      coinCache: LRU;
      cacheHash: LRU;
      cacheHeight: LRU;
      constructor(options: ChainDBOptions);
      open(): Promise<void>;
      close(): Promise<void>;
      start(): Batch;

      // ----- these methods all works for current batch.------
      put(key: string, value: Buffer): void;
      del(key: string): void;
      /**
       * Get currenct batch
       */
      batch(): Batch;
      drop(): void;
      commit(): Promise<void>;
      // ------------------------------------------------------

      /**
       * @param block - Blockhash or height.
       */
      hasCache(block: Buffer | number): boolean;
      /**
       * @param block - Blockhash or height.
       */
      getCache(block: Buffer | number): Block;
      getHeight(hash: HashKey): Promise<number>;
      getHash(hash: HashKey): Promise<number>;
      private getEntryByHeight(height: number): Promise<ChainEntry>;
      private getEntryByHash(hash: HashKey): Promise<ChainEntry>;
      getEntry(block: number | HashKey): Promise<ChainEntry>;
      hasEntry(hash: HashKey): Promise<boolean>;
      getAncestor(entry: ChainEntry, height: number): Promise<ChainEntry>;
      getPrevious(entry: ChainEntry): Promise<ChainEntry>;
      getPrevCache(entry: ChainEntry): Promise<ChainEntry | null>;
      getPrevious(entry: ChainEntry): Promise<ChainEntry>;
      getNext(entry: ChainEntry): Promise<ChainEntry>;
      getNextEntry(entry: ChainEntry): Promise<ChainEntry>;
      getTip(): Promise<ChainEntry>;
      getState(): Promise<ChainState>;
      getFlags(): Promise<ChainFlags | null>;
      getStateCache(): Promise<StateCache>;

      // ------ these are called on initial db load ------
      private verifyFlags(state: ChainState): Promise<void>;
      private verifyDeployments(): Promise<boolean>;
      private checkDeployments(): Promise<boolean>;

      // ------ these are called only when db initialized -------
      private saveDeployments(): Promise<void>;
      private saveGenesis(): Promise<void>;
      private saveFlags(): Promise<void>;
      private writeDeployments(): Promise<void>;

      /**
       * Retroactively prune the database.
       * Called only when forceFlags is true.
       */
      prune(): Promise<boolean>;
      getNextHash(hash: HashKey): Promise<string>;
      isMainHash(hash: HashKey): Promise<boolean>;
      isMainChain(entry: ChainEntry): Promise<boolean>;
      getHashes(start?: number, end?: number): Promise<string[]>;
      /**
       * get all entries
       */
      getEntries(): Promise<ChainEntry[]>;
      getTips(): Promise<HashKey[]>;
      private readCoin(): Promise<CoinEntry>;
      getCoin(hash: HashKey, index: number): Promise<Coin>;
      /**
       * necessary for bip30
       * @param tx
       */
      hasCoins(tx): Promise<boolean>;
      getCoinView(tx: TX): Promise<CoinView>;
      getSpentView(tx: TX): Promise<CoinView>;
      getUndoCoins(hash: HashKey): Promise<Coin[]>;
      getBlock(hash: HashKey): Promise<Block | null>;
      private getRawBlock(block: HashKey): Promise<Block | null>;

      /**
       * The result view will be passed to `block.getJSON`
       * It is necessary to make sure tx in the block has prevOut.
       * @param block
       */
      getBlockView(block: Block): Promise<CoinView>;
      /**
       * get a TX with metadata.
       * indexTX must be set to `true`.
       * @param hash - transaction's hash
       */
      getMeta(hash: HashKey): Promise<primitives.TXMeta | null>;
      getTX(hash: HashKey): Promise<TX>;
      hasTX(hash: HashKey): Promise<boolean>;
      /**
       * `indexAddress` must be `true` to use this.
       * otherwise it will return empty array.
       * @param addrs
       */
      getCoinsByAddress(addrs: Address[]): Promise<Coin[]>;
      /**
       * returns transaction hashes for the address.
       * @param addrs
       */
      getHashesByAddress(addrs: Address[]): Promise<HashKey[]>;
      getTXByAddress(addrs: Address[]): Promise<TX[]>;
      getMetaByAddress(addrs: Address[]): Promise<primitives.TXMeta>;
      scan(
        start: HashKey | number | null,
        filter: BloomFilter,
        iter: ScanIterator
      ): Promise<void>;
      /**
       * save block as a new tip. Which does not perform any verification.
       * @param entry
       * @param block
       * @param view
       */
      save(entry: ChainEntry, block: Block, view?: CoinView): Promise<void>;
      reconnect(entry: ChainEntry, block: Block, view: CoinView): Promise<void>;
      disconnect(entry: ChainEntry, block: Block): Promise<CoinView>;
      reset(block: HashKey | number): Promise<ChainEntry>;
      private removeChains(): Promise<void>;
      private saveBlock(
        entry: ChainEntry,
        block: Block,
        view?: CoinView
      ): Promise<Block>;
      private removeBlock(entry: ChainEntry): Promise<Block>;
      private saveView(view: CoinView): Promise<void>;
      private connectBlock(
        entry: ChainEntry,
        block: Block,
        view: CoinView
      ): Promise<Block>;
      private disconnectBlock(
        entry: ChainEntry,
        block: Block
      ): Promise<CoinView>;
      private pruneBlock(entry): Promise<void>;
      private indexTX(
        tx: TX,
        view: CoinView,
        entry: ChainEntry,
        index: number
      ): Promise<void>;
      private unindexTX(tx: TX, view: CoinView): Promise<void>;
    }
    export type ScanIterator = (entry: ChainEntry, txs: TX[]) => Promise<void>;

    type ChainDBOptions = Partial<ChainFlagsOption> & {
      network: Network;
      logger: LoggerContext;
      coinCache: number;
      entryCache: number;
      /**
       * Most of ChainFlags can not be retroactively changed.
       * But this option will for change.
       */
      forceFlags: boolean;
    };

    class ChainFlags {
      public network: Network;
      spv: boolean;
      witness: boolean;
      bip91: boolean;
      bip148: boolean;
      prune: boolean;
      indexTX: boolean;
      indexAddress: boolean;
      constructor(options?: Partial<ChainFlagsOption>);
    }

    interface ChainFlagsOption {
      network: Network | NetworkType;
      spv: boolean;
      bip91: boolean;
      bip148: boolean;
      prune: boolean;
      indexTX: boolean;
      indexAddress: boolean;
    }

    class ChainState {
      public tip: HashKey;
      public tx: number;
      public coin: number;
      public value: number;
      public committed: boolean;

      constructor();
    }
    class StateCache {}

    class CacheUpdate {}

    export class ChainEntry {
      static MAX_CHAIN_WORK: BN;
      hash: HashKey;
      version: number;
      prevBlock: string;
      merkleRoot: string;
      time: number;
      bits: number;
      nonce: number;
      height: number;
      chainwork: BN;
      constructor(options?: ChainEntryOptions);
      fromOptions(options: ChainEntryOptions): Promise<ChainEntry>;
      static fromOptions(options: ChainEntryOptions, prev: ChainEntry);
      getProof(): BN;
      getChainwork(prev: ChainEntry): BN;
      isGenesis(): boolean;
      hasUnknown(network: Network): boolean;
      hasBit(bit: number): boolean;
      /**
       * Get little-endian block hash.
       */
      rhash(): HashKey;
      fromBlock(block: Block | MerkleBlock, prev?: ChainEntry): ChainEntry;
      static fromBlock(
        block: Block | MerkleBlock,
        prev?: ChainEntry
      ): ChainEntry;
      toRaw(): Buffer;
      fromRaw(data: Buffer): ChainEntry;
      static fromRaw(data: Buffer): ChainEntry;
      toJSON(): object;
      fromJSON(json: Object): ChainEntry;
      static fromJSON(json: Object): ChainEntry;
      toHeaders(): Headers;
      toInv(): InvItem;
      inspect(): object;
      static isChainEntry(obj: object): boolean;
    }

    export interface ChainEntryOptions {
      hash: HashKey;
      version: number;
      prevBlock: string;
      merkleRoot: string;
      time: number;
      bits: number;
      nonce: number;
      height: number;
      chainwork: BN;
    }
  }

  export class Chain extends blockchain.Chain {}
  export class ChainEntry extends blockchain.ChainEntry {}
}
