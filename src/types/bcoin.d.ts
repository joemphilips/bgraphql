// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bweb
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'bcoin' {
  import { BloomFilter } from 'bfilter';
  import { BufferWriter, BufferReader } from 'bufio';
  import { BufferMap } from 'buffer-map';
  import BN from 'bn.js';
  import AsyncEmitter from 'bevent';
  import { EventEmitter } from 'events';
  import Logger, { LoggerContext } from 'blgr';
  import * as bweb from 'bweb';
  import * as bclient from 'bclient';
  import { DB, Batch } from 'bdb';
  import { Lock } from 'bmutex';
  import Config, { ConfigOption } from 'bcfg';
  import LRU from 'blru';

  export abstract class BcoinPlugin {
    static init(node: Node): BcoinPluginInstance;
  }

  export abstract class BcoinPluginInstance {
    public open(): Promise<void>;
    public close(): Promise<void>;
  }

  type SighashType = 'ALL' | 'NONE' | 'SINGLE' | 1 | 2 | 3 | 0x08;

  /**
   * Fee rate per kilobyte/satoshi.
   */
  type Rate = number;

  /**
   * Currently, some hashes are represented as hex string
   * for the sake of performance.
   * but in the near future, it will use Buffer instead. This type
   * is supposed to represent that type going to change.
   * refs: https://github.com/bcoin-org/bcoin/issues/533
   */
  type HashKey = string;
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

      orphanMap: BufferMap;
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
      public add(block: Block, flags?: number, id?: number): Promise<void>;
      private connect(
        prev: ChainEntry,
        block: Block,
        flags: number
      ): Promise<ChainEntry>;
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
      network: Network;
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

  export type Chain = blockchain.Chain;
  export type ChainEntry = blockchain.ChainEntry;

  export namespace btc {
    export class Amount {}

    export class URI {}
  }

  export type Amount = btc.Amount;

  export type URI = btc.URI;

  export namespace coins {
    export class Coins {}

    export class CoinEntry {}

    export class CoinView {}
  }

  export type Coins = coins.Coins;
  export type CoinEntry = coins.CoinEntry;
  export type CoinView = coins.CoinView;

  export namespace hd {
    export class HDPrivateKey {}

    export class HDPublicKey {}

    export class Mnemonic {}

    export interface MnemonicOptions {
      bits: number;
      language: string;
      phrase: string;
      entropy: Buffer;
    }
  }

  export type HDPrivateKey = hd.HDPrivateKey;

  export type HDPublicKey = hd.HDPublicKey;

  export type Mnemonic = hd.Mnemonic;

  export namespace mempool {
    export class Fees {
      public options: MempoolOptions;
      constructor(options: MempoolOptions);
    }

    export class MempoolOptions {}

    export class Mempool {}

    export class MempoolEntry {}
  }

  export type Fees = mempool.Fees;

  export type Mempool = mempool.Mempool;

  export type MempoolEntry = mempool.MempoolEntry;

  export namespace mining {
    export class Miner {}
  }

  export type Miner = mining.Miner;

  export namespace net {
    export interface packets {}
    export class Peer {}

    export class Pool {}
  }

  export type packets = net.packets;

  export type Peer = net.Peer;

  export type Pool = net.Pool;

  export namespace node {
    export class Node extends EventEmitter {
      config: Config;
      network: NetworkType;
      /**
       * if use memory db or not. default to true.
       */
      memory: boolean;
      starttime: number;
      bound: any[];
      stack: Array<any>;
      spv: boolean;
      chain?: blockchain.Chain;
      fees?: Fees;
      mempool?: Mempool;
      pool?: Pool;
      miner?: Miner;
      plugins?: Array<BcoinPluginInstance>;
      logger?: Logger;
      workers: WorkerPool;
      http?: bweb.Server;
      constructor(
        module: string,
        config?: Config,
        file?: string,
        options?: ConfigOption
      );

      ensure(): Promise<void>;

      location(name: string): string;
      /**
       * Call this in the first line of `open()`
       */
      public handlePreOpen(): Promise<void>;
      /**
       * Call this in the last line of `open()`
       */
      public handleOpen(): Promise<void>;

      /**
       * Call this in the last line of `close()`
       */
      public handleClose(): Promise<void>;
      use(plugin: BcoinPlugin): void;
      has(name: string): boolean;
      get(name: string): BcoinPluginInstance | null;
    }
    export class FullNode extends Node {
      constructor(options: ConfigOption);
      [key: string]: any;
    }

    export class HTTPOptions {
      network: Network;
      logger: Logger | null;
      node: Node | null;
      apiKey: string;
      apiHash: Buffer;
      adminToken: Buffer;
      serviceHash: Buffer;
      noAuth: boolean;
      cors: boolean;
      prefix: null | string;
      host: string;
      port: number;
      ssl: boolean;
      keyFile: null | string;
      certFile: null | string;
    }

    export class HTTP extends bweb.Server {
      constructor(options: HTTPOptions);
    }

    export class SPVNode {}
  }

  export class Node extends node.Node {}

  export class FullNode extends node.FullNode {
    constructor(options: ConfigOption);
  }

  export class SPVNode extends node.SPVNode {}

  export namespace primitives {
    export class Address {
      type: AddressTypeNum;
      version: number;
      hash: Buffer;
      constructor(options?: Partial<AddressOptions>);
      fromOptions(options: AddressOptions);
      static fromOptions(options: AddressOptions);
      public getHash(enc?: 'hex' | 'null'): Buffer;
      public isNull(): boolean;
      public equals(addr: Address): boolean;
      public getType(): AddressTypeLowerCase;
      /**
       * get network address prefix
       * @param network
       */
      public getPrefix(network?: Network | NetworkType): number;
      public getSize(): number;
      public toRaw(network?: Network | NetworkType): Buffer;
      public toBase58(network?: Network | NetworkType): string;
      public toBech32(network?: Network | NetworkType): string;
      public fromString(addr: string, network?: Network | NetworkType): Address;
      static fromString(addr: string, network?: Network | NetworkType): Address;
      public toString(network?: Network | NetworkType): string;
      inspect(): string;
      fromRaw(data: Buffer, network?: Network | NetworkType): Address;
      static fromRaw(data: Buffer, network?: Network | NetworkType): Address;
      static fromBase58(data: string, network?: Network): Address;
      static fromBech32(data: string, network?: Network): Address;
      /**
       * From output script
       */
      private fromScript(script: Script): Address | null;
      private fromWitness(witness: Witness): Address | null;
      private fromInputScript(script: Script): Address | null;
      static fromScript(script: Script): Address | null;
      static fromWitness(witness: Witness): Address | null;
      static fromInputScript(script: Script): Address | null;
      private fromHash(
        hash: Buffer,
        type: AddressType,
        version: number
      ): Address;
      static fromHash(
        hash: Buffer,
        type: AddressType,
        version: number
      ): Address;
      private fromPubkeyhash(hash: Buffer): Address;
      static fromPubkeyhash(hash: Buffer): Address;
      private fromScripthash(hash: Buffer): Address;
      static fromScripthash(hash: Buffer): Address;
      private fromWitnessPubkeyhash(hash: Buffer): Address;
      static fromWitnessPubkeyhash(hash: Buffer): Address;
      private fromWitnessScripthash(hash: Buffer): Address;
      static fromWitnessScripthash(hash: Buffer): Address;
      private fromProgram(version: number, hash: Buffer): Address;
      static fromProgram(version: number, hash: Buffer): Address;
      public isPubkeyhash(): boolean;
      public isScriptHash(): boolean;
      public isWitnessPubkeyhash(): boolean;
      public isWitnessScripthash(): boolean;
      public isUnknown(): boolean;

      static getHash(
        data: string | Address | Buffer,
        enc?: string,
        network?: Network
      ): Buffer;
      static getType(prefix: number, network: Network): AddressTypeNum;
    }

    export type AddressOptions =
      | { hash: Buffer | string; type: AddressType; version?: number }
      | string;

    export type AddressType = AddressTypeNum | AddressTypeVal;

    export type AddressTypeNum =
      | 0 // PUBKEYHASH
      | 1 // SCRIPTHASH
      | 2; // WITNESS
    export type AddressTypeVal = 'PUBKEYHASH' | 'SCRIPTHASH' | 'WITNESS';
    export type AddressTypeLowerCase = 'pubkeyhash' | 'scripthash' | 'witness';
    export class Block {}

    export class TXMeta {}

    export class Coin {}

    export class Headers extends AbstractBlock {
      constructor(options: BlockHeaderOpts);
      verifyBody(): true;
      getSize(): 81;
    }

    interface BlockHeaderOpts {
      version: number;
      prevBlock: Buffer;
      merkleRoot: Buffer;
      time: number;
      bits: number;
      nonce: number;
      mutable?: boolean;
    }
    export abstract class AbstractBlock {
      private parseOptions(options: BlockHeaderOpts): any;
      private parseJson(options: BlockHeaderOpts): any;
      public isMemory(): boolean;
      /**
       * Serialize Block headers.
       */
      public toHead();
      private fromHead(data: Buffer): any;
      public writeHead(bw: BufferWriter): any;
      public readHead(br: BufferReader): any;
      public verify(): boolean;
      public verifyPOW(): boolean;
      abstract verifyBody(): boolean;
      public rhash(): Buffer;
      public toInv(): InvItem;
      Buffer;
    }
    export class Input {}

    export class InvItem {}

    export class KeyRing {}

    export class MerkleBlock {}

    export class MTX {}

    export type AddOutputOptions =
      | Address
      | Script
      | Output
      | { address: Address | Script | Output; value: number };

    export type OutputOptions = {
      address?: string | Address;
      value?: number;
      script?: ScriptOptions;
    };

    export type ScriptOptions =
      | Buffer
      | Opcode[]
      | { raw?: Buffer; code?: Opcode[] };

    export class Outpoint {}

    export class Output {}

    export class TX {}
  }

  export type Address = primitives.Address;
  export type Block = primitives.Block;
  export type Coin = primitives.Coin;
  export type Headers = primitives.Headers;
  export type Input = primitives.Input;
  export type InvItem = primitives.InvItem;
  export type KeyRing = primitives.KeyRing;
  export type MerkleBlock = primitives.MerkleBlock;
  export type MTX = primitives.MTX;
  export type Outpoint = primitives.Outpoint;
  export type Output = primitives.Output;
  export type TX = primitives.TX;

  export namespace protocol {
    export interface consensus {}
    export class Network {
      type: NetworkType;
      /**
       * url for seed node
       */
      seeds: string;
      magic: number;
      port: number;
      checkPointMap: { [key: string]: string };
      lastCheckpoint: number;
      halvingInterval: number;
      genesis: primitives.BlockHeaderOpts & { hash: string };
      genesisBlock: string;
      pow: POW;
      block: BlockConstants;
      /**
       * Map of historical blocks which create duplicate tx hashes.
       */
      bip30: { [key: string]: string };
      activationThreshold: number;
      minerWindow: number;
      deployments: DeployMents;
      deploys: Deploy[];
      unknownBits: number;
      keyPrefix: KeyPrefix;
      addressPrefix: AddressPrefix;
      /**
       * default value for whether the mempool
       * accepts non-standard tx.
       */
      requireStandard: boolean;
      rpcPort: number;
      walletPort: number;
      minRelay: number;
      feeRate: number;
      maxFeeRate: number;
      selfConnect: boolean;
      requestMempool: boolean;
      time: TimeData;
      public checkpoints: { hash: string; height: number }[];
      constructor(options: Partial<NetworkOptions>);
      static get(type: NetworkType): Network;
      private init(): void;
      /**
       * Get deployment info by bit index.
       * @param bit
       */
      public byBit(bit: number): Deploy;
      /**
       * get network adjusted time.
       */
      public now(): number;
      /**
       * Get network adjusted time in milliseconds.
       */
      public ms(): number;
      static create(): Network;
      /**
       * Set the default network.
       * @param type
       */
      static set(type: NetworkType): Network;
      static get(type: NetworkType): Network;
      private static by(
        value: object,
        compare: Function,
        network: Network | null,
        name: string
      );
      static fromMagic(value, network): Network;
      static fromWIF(prefix, network): Network;
      /**
       * from xpubkey prefix
       * @param prefix
       * @param network
       */
      static fromPublic(prefix: number, network?: Network): Network;
      static fromPrivate(prefix: number, network?: Network): Network;
      static fromPublic58(prefix: string, network?: Network): Network;
      static fromPrivate58(prefix: string, network?: Network): Network;
      static fromAddress(prefix: number, network?: Network): Network;
      static fromBech32(prefix: number, network?: Network): Network;
      toString(): NetworkType;
    }

    export interface NetworkOptions {
      type: NetworkType;
      /**
       * url for seed node
       */
      seeds: string;
      magic: number;
      port: number;
      checkPointMap: { [key: string]: string };
      lastCheckpoint: number;
      halvingInterval: number;
      genesis: primitives.BlockHeaderOpts & { hash: string };
      genesisBlock: string;
      pow: POW;
      block: BlockConstants;
      /**
       * Map of historical blocks which create duplicate tx hashes.
       */
      bip30: { [key: string]: string };
      activationThreshold: number;
      minerWindow: number;
      deployments: DeployMents;
      deploys: Deploy[];
      unknownBits: number;
      keyPrefix: KeyPrefix;
      addressPrefix: AddressPrefix;
      /**
       * default value for whether the mempool
       * accepts non-standard tx.
       */
      requireStandard: boolean;
      rpcPort: number;
      walletPort: number;
      minRelay: number;
      feeRate: number;
      maxFeeRate: number;
      selfConnect: boolean;
      requestMempool: boolean;
    }

    export interface TimeData {}

    interface AddressPrefix {
      pubkeyhash: number;
      scripthash: number;
      witnesspubkeyhash: number;
      witnessscripthash: number;
      bech32: string;
    }

    interface KeyPrefix {
      privkey: number;
      xpubkey: number;
      xpubkey58: string;
      xprivkey58: string;
      coinType: number;
    }

    interface DeployMents {
      [key: string]: Deploy;
    }

    interface Deploy {
      name: 'csv';
      bit: number;
      startTime: number;
      timeout: number;
      threshold: number;
      window: number;
      required: boolean;
      force: boolean;
    }
    /**
     * Constants of blockchain itself.
     * It differs among network parameters.
     */
    interface BlockConstants {
      bip34height: number;
      bip34hash: string;
      bip65height: number;
      bip65hash: string;
      bip66height: number;
      bip66hash: string;
      /**
       * Safe height to start pruning
       */
      pruneAfterHeight: number;
      /**
       * safe number to
       */
      keepBlocks: number;
      /**
       * Used for the time delta to determine whether the chain is synced
       */
      maxTipAge: number;
      /**
       * Height at which block processing is slow enough that we can output
       * logs without spamming
       */
      slowHeight: number;
    }
    interface POW {
      limit: BN;
      bits: number; // compact pow limit.
      chainwork: BN;
      targetTimespan;
      targetSpacing: number;
      retargetInterval: number;
      targetRest: boolean;
      noRetargeting: boolean;
    }

    export interface networks {
      type: NetworkType;
    }

    export interface policy {}
  }

  export class Network extends protocol.Network {}

  export type NetworkType = 'main' | 'testnet' | 'regtest' | 'simnet';

  export type consensus = protocol.consensus;
  export type networks = protocol.networks;
  export type policy = protocol.policy;
  export namespace script {
    export namespace common {
      export type opcodes = {
        // Push
        OP_0: 0x00;

        OP_PUSHDATA1: 0x4c;
        OP_PUSHDATA2: 0x4d;
        OP_PUSHDATA4: 0x4e;

        OP_1NEGATE: 0x4f;

        OP_RESERVED: 0x50;

        OP_1: 0x51;
        OP_2: 0x52;
        OP_3: 0x53;
        OP_4: 0x54;
        OP_5: 0x55;
        OP_6: 0x56;
        OP_7: 0x57;
        OP_8: 0x58;
        OP_9: 0x59;
        OP_10: 0x5a;
        OP_11: 0x5b;
        OP_12: 0x5c;
        OP_13: 0x5d;
        OP_14: 0x5e;
        OP_15: 0x5f;
        OP_16: 0x60;

        // Control
        OP_NOP: 0x61;
        OP_VER: 0x62;
        OP_IF: 0x63;
        OP_NOTIF: 0x64;
        OP_VERIF: 0x65;
        OP_VERNOTIF: 0x66;
        OP_ELSE: 0x67;
        OP_ENDIF: 0x68;
        OP_VERIFY: 0x69;
        OP_RETURN: 0x6a;

        // Stack
        OP_TOALTSTACK: 0x6b;
        OP_FROMALTSTACK: 0x6c;
        OP_2DROP: 0x6d;
        OP_2DUP: 0x6e;
        OP_3DUP: 0x6f;
        OP_2OVER: 0x70;
        OP_2ROT: 0x71;
        OP_2SWAP: 0x72;
        OP_IFDUP: 0x73;
        OP_DEPTH: 0x74;
        OP_DROP: 0x75;
        OP_DUP: 0x76;
        OP_NIP: 0x77;
        OP_OVER: 0x78;
        OP_PICK: 0x79;
        OP_ROLL: 0x7a;
        OP_ROT: 0x7b;
        OP_SWAP: 0x7c;
        OP_TUCK: 0x7d;

        // Splice
        OP_CAT: 0x7e;
        OP_SUBSTR: 0x7f;
        OP_LEFT: 0x80;
        OP_RIGHT: 0x81;
        OP_SIZE: 0x82;

        // Bit
        OP_INVERT: 0x83;
        OP_AND: 0x84;
        OP_OR: 0x85;
        OP_XOR: 0x86;
        OP_EQUAL: 0x87;
        OP_EQUALVERIFY: 0x88;
        OP_RESERVED1: 0x89;
        OP_RESERVED2: 0x8a;

        // Numeric
        OP_1ADD: 0x8b;
        OP_1SUB: 0x8c;
        OP_2MUL: 0x8d;
        OP_2DIV: 0x8e;
        OP_NEGATE: 0x8f;
        OP_ABS: 0x90;
        OP_NOT: 0x91;
        OP_0NOTEQUAL: 0x92;
        OP_ADD: 0x93;
        OP_SUB: 0x94;
        OP_MUL: 0x95;
        OP_DIV: 0x96;
        OP_MOD: 0x97;
        OP_LSHIFT: 0x98;
        OP_RSHIFT: 0x99;
        OP_BOOLAND: 0x9a;
        OP_BOOLOR: 0x9b;
        OP_NUMEQUAL: 0x9c;
        OP_NUMEQUALVERIFY: 0x9d;
        OP_NUMNOTEQUAL: 0x9e;
        OP_LESSTHAN: 0x9f;
        OP_GREATERTHAN: 0xa0;
        OP_LESSTHANOREQUAL: 0xa1;
        OP_GREATERTHANOREQUAL: 0xa2;
        OP_MIN: 0xa3;
        OP_MAX: 0xa4;
        OP_WITHIN: 0xa5;

        // Crypto
        OP_RIPEMD160: 0xa6;
        OP_SHA1: 0xa7;
        OP_SHA256: 0xa8;
        OP_HASH160: 0xa9;
        OP_HASH256: 0xaa;
        OP_CODESEPARATOR: 0xab;
        OP_CHECKSIG: 0xac;
        OP_CHECKSIGVERIFY: 0xad;
        OP_CHECKMULTISIG: 0xae;
        OP_CHECKMULTISIGVERIFY: 0xaf;

        // Expansion
        OP_NOP1: 0xb0;
        OP_CHECKLOCKTIMEVERIFY: 0xb1;
        OP_CHECKSEQUENCEVERIFY: 0xb2;
        OP_NOP4: 0xb3;
        OP_NOP5: 0xb4;
        OP_NOP6: 0xb5;
        OP_NOP7: 0xb6;
        OP_NOP8: 0xb7;
        OP_NOP9: 0xb8;
        OP_NOP10: 0xb9;

        // Custom
        OP_INVALIDOPCODE: 0xff;
      };

      export type opcodesByVal = {
        0x00: 'OP_0';

        0x4c: 'OP_PUSHDATA1';
        0x4d: 'OP_PUSHDATA2';
        0x4e: 'OP_PUSHDATA4';

        0x4f: 'OP_1NEGATE';

        0x50: 'OP_RESERVED';

        0x51: 'OP_1';
        0x52: 'OP_2';
        0x53: 'OP_3';
        0x54: 'OP_4';
        0x55: 'OP_5';
        0x56: 'OP_6';
        0x57: 'OP_7';
        0x58: 'OP_8';
        0x59: 'OP_9';
        0x5a: 'OP_10';
        0x5b: 'OP_11';
        0x5c: 'OP_12';
        0x5d: 'OP_13';
        0x5e: 'OP_14';
        0x5f: 'OP_15';
        0x60: 'OP_16';

        // Control
        0x61: 'OP_NOP';
        0x62: 'OP_VER';
        0x63: 'OP_IF';
        0x64: 'OP_NOTIF';
        0x65: 'OP_VERIF';
        0x66: 'OP_VERNOTIF';
        0x67: 'OP_ELSE';
        0x68: 'OP_ENDIF';
        0x69: 'OP_VERIFY';
        0x6a: 'OP_RETURN';

        // Stack
        0x6b: 'OP_TOALTSTACK';
        0x6c: 'OP_FROMALTSTACK';
        0x6d: 'OP_2DROP';
        0x6e: 'OP_2DUP';
        0x6f: 'OP_3DUP';
        0x70: 'OP_2OVER';
        0x71: 'OP_2ROT';
        0x72: 'OP_2SWAP';
        0x73: 'OP_IFDUP';
        0x74: 'OP_DEPTH';
        0x75: 'OP_DROP';
        0x76: 'OP_DUP';
        0x77: 'OP_NIP';
        0x78: 'OP_OVER';
        0x79: 'OP_PICK';
        0x7a: 'OP_ROLL';
        0x7b: 'OP_ROT';
        0x7c: 'OP_SWAP';
        0x7d: 'OP_TUCK';

        // Splice
        0x7e: 'OP_CAT';
        0x7f: 'OP_SUBSTR';
        0x80: 'OP_LEFT';
        0x81: 'OP_RIGHT';
        0x82: 'OP_SIZE';

        // Bit
        0x83: 'OP_INVERT';
        0x84: 'OP_AND';
        0x85: 'OP_OR';
        0x86: 'OP_XOR';
        0x87: 'OP_EQUAL';
        0x88: 'OP_EQUALVERIFY';
        0x89: 'OP_RESERVED1';
        0x8a: 'OP_RESERVED2';

        // Numeric
        0x8b: 'OP_1ADD';
        0x8c: 'OP_1SUB';
        0x8d: 'OP_2MUL';
        0x8e: 'OP_2DIV';
        0x8f: 'OP_NEGATE';
        0x90: 'OP_ABS';
        0x91: 'OP_NOT';
        0x92: 'OP_0NOTEQUAL';
        0x93: 'OP_ADD';
        0x94: 'OP_SUB';
        0x95: 'OP_MUL';
        0x96: 'OP_DIV';
        0x97: 'OP_MOD';
        0x98: 'OP_LSHIFT';
        0x99: 'OP_RSHIFT';
        0x9a: 'OP_BOOLAND';
        0x9b: 'OP_BOOLOR';
        0x9c: 'OP_NUMEQUAL';
        0x9d: 'OP_NUMEQUALVERIFY';
        0x9e: 'OP_NUMNOTEQUAL';
        0x9f: 'OP_LESSTHAN';
        0xa0: 'OP_GREATERTHAN';
        0xa1: 'OP_LESSTHANOREQUAL';
        0xa2: 'OP_GREATERTHANOREQUAL';
        0xa3: 'OP_MIN';
        0xa4: 'OP_MAX';
        0xa5: 'OP_WITHIN';

        // Crypto
        0xa6: 'OP_RIPEMD160';
        0xa7: 'OP_SHA1';
        0xa8: 'OP_SHA256';
        0xa9: 'OP_HASH160';
        0xaa: 'OP_HASH256';
        0xab: 'OP_CODESEPARATOR';
        0xac: 'OP_CHECKSIG';
        0xad: 'OP_CHECKSIGVERIFY';
        0xae: 'OP_CHECKMULTISIG';
        0xaf: 'OP_CHECKMULTISIGVERIFY';

        // Expansion
        0xb0: 'OP_NOP1';
        0xb1: 'OP_CHECKLOCKTIMEVERIFY';
        0xb2: 'OP_CHECKSEQUENCEVERIFY';
        0xb3: 'OP_NOP4';
        0xb4: 'OP_NOP5';
        0xb5: 'OP_NOP6';
        0xb6: 'OP_NOP7';
        0xb7: 'OP_NOP8';
        0xb8: 'OP_NOP9';
        0xb9: 'OP_NOP10';

        // Custom
        0xff: 'OP_INVALIDOPCODE';
      };

      export enum flags {
        VERIFY_NONE = 0,
        VERIFY_P2SH = 1,
        VERIFY_STRICTENC = 2,
        VERIFY_DERSIG = 4,
        VERIFY_LOW_S = 8,
        VERIFY_NULLDUMMY = 16,
        VERIFY_SIGPUSHONLY = 32,
        VERIFY_MINIMALDATA = 64,
        VERIFY_DISCOURAGE_UPGRADABLE_NOPS = 128,
        VERIFY_CLEANSTACK = 256,
        VERIFY_CHECKLOCKTIMEVERIFY = 512,
        VERIFY_CHECKSEQUENCEVERIFY = 1024,
        VERIFY_WITNESS = 2048,
        VERIFY_DISCOURAGE_UPGRADABLE_WITNESS_PROGRAM = 4096,
        VERIFY_MINIMALIF = 8192,
        VERIFY_NULLFAIL = 16384,
        VERIFY_WITNESS_PUBKEYTYPE = 32768,
        /**
         * Consensus verify flags ... used for block validation.
         */
        MANDATORY_VERIFY_FLAGS = 1,
        /**
         * Used for mempool validation.
         */
        STANDARD_VERIFY_FLAGS = 65503,
        /**
         * `STANDARD_VERIFY_FLAGS & ~MANDATORY_VERIFY_FLAGS`
        /**
         */
        ONLY_STANDARD_VERIFY_FLAGS = 65502
      }

      export type hashType = {
        ALL: 1;
        NONE: 2;
        SINGLE: 3;
        ANYONECANPAY: 0x08;
      };

      export type hashTypeByVal = {
        1: 'ALL';
        2: 'NONE';
        3: 'SINGLE';
        0x80: 'ANYONECANPAY';
      };

      /**
       * output script types
       */
      export type types = {
        NONSTANDARD: 0;
        PUBKEY: 1;
        PUBKEYHASH: 2;
        SCRIPTHASH: 3;
        MULTISIG: 4;
        NULLDATA: 5;
        WITNESSMALFORMED: 0x80;
        WITNESSSCRIPTHASH: 0x81;
        WITNESSPUBKEYHASH: 0x82;
      };

      export type typesByVal = {
        0: 'NONSTANDARD';
        1: 'PUBKEY';
        2: 'PUBKEYHASH';
        3: 'SCRIPTHASH';
        4: 'MULTISIG';
        5: 'NULLDATA';
        0x80: 'WITNESSMALFORMED';
        0x81: 'WITNESSSCRIPTHASH';
        0x82: 'WITNESSPUBKEYHASH';
      };

      /**
       * check a signature is it holds valid sighash type or not.
       */
      export type isHashType = (sig: Buffer) => boolean;
      export type isLowDER = (sig: Buffer) => boolean;
      export type isKeyEncoding = (key: Buffer) => boolean;
      export type isCompressedEncoding = (key: Buffer) => boolean;
      export type isSignatureEncoding = (sig: Buffer) => boolean;
    }
    export class Opcode {
      constructor(value?: number, data?: Buffer);
      isMinimal(): boolean;
    }

    export class Program {}

    export class Script {}

    export class ScriptNum {}

    export class SigCache {}

    export class Stack {}

    export class Witness {}
  }

  export type Opcode = script.Opcode;

  export type Program = script.Program;

  export type Script = script.Script;
  export type ScriptNum = script.ScriptNum;

  export type SigCache = script.SigCache;
  export type Stack = script.Stack;
  export type Witness = script.Witness;

  export namespace utils {
    export interface util {}
  }

  export type util = utils.util;

  // ------------ wallet ------------

  namespace wallet {
    type WID = number;
    type Passphrase = Buffer | string;
    type Base58String = string;
    export class Wallet extends EventEmitter {
      public wdb: WalletDB;
      public db: DB;
      public network: Network;
      public logger: Logger;
      public wid: WID;
      public id: string;
      public watchOnly: boolean;
      public accountDepth: number;
      public token: Buffer;
      public tokenDepth: number;
      /**
       *
       */
      public master: MasterKey;
      public txdb: TXDB;
      private writeLock: Lock;
      private fundLock: Lock;
      static fromOptions(
        wdb: WalletDB,
        options?: Partial<WalletOptions>
      ): Wallet;
      constructor(wdb: WalletDB, options?: Partial<WalletOptions>);
      public init(
        options: AccountOptions,
        passphrase: Passphrase
      ): Promise<void>;
      public open(): Promise<void>;
      /**
       * erase the wallet completely from db
       */
      public destroy(): Promise<void>;

      public addSharedKey(
        acct: number | string,
        key: HDPublicKey
      ): Promise<boolean>;

      public removeSharedKey(
        acct: number | string,
        key: HDPublicKey
      ): Promise<boolean>;

      public setPassphrase(
        passphrase: Passphrase,
        old: Passphrase
      ): Promise<void>;

      public encrypt(passphrase: Passphrase): Promise<void>;
      public decrypt(passphrase: Passphrase): Promise<void>;
      public retoken(passphrase: Passphrase): Promise<Buffer>;
      /**
       * Change wallet id
       * @param id - new id
       */
      public rename(id: string): Promise<void>;
      public renameAccount(acct: Account, name: string): Promise<void>;
      /**
       * Lock the wallet. delete decrypted key from memory.
       * Usually, there is no need to call this manually since
       * it will be deleted when timeout (default 60)
       */
      public lock(): Promise<void>;
      /**
       * unlock the wallet for use
       * @param passphrase
       * @param timeout - Default is 60
       */
      public unlock(passphrase: Passphrase, timeout: number);
      /**
       * Wallet id is represented as HASH160(m/44->public|magic)
       * and translated as `address` with a prefix `0x03be04
       * (`WLT` in base58)`
       */
      private getID(): Base58String;
      private getToken(nonce: number);

      public createAccount(
        options: AccountOptions,
        passphrase: Passphrase
      ): Promise<Account>;

      /**
       * if it already has an account with the name `options.name`, returns that.
       * Otherwise create new account with that name.
       * @param options
       * @param passphrase
       */
      public ensureAccount(
        options: AccountOptions,
        passphrase: Passphrase
      ): Promise<Account>;

      /**
       * Returns all account in this wallet.
       */
      public getAccounts(): Promise<Account>;

      /**
       * Used for retrieving privkey associated to the address
       * by this.getPrivateKey
       * @param acct - account name or index
       */
      public getAddressHashes(acct?: string | number): Promise<Buffer[] | null>;

      public getAccountHashes(acct: string | number): Promise<Buffer[] | null>;

      public getAccount(acct: number | string): Promise<Account | null>;

      /**
       * if argument is a number, than returns that. otherwise converts to number
       * returns -1 when not found.
       * @param acct
       */
      public getAccountIndex(acct: string): Promise<number>;
      /**
       * Opposite of `getAccountIndex`
       * @param acct
       */
      public getAccountName(acct: number): Promise<string>;

      /**
       * if argument is a number, than returns that. otherwise converts to number
       * throws error when not found.
       * @param acct
       */
      public ensureIndex(acct: string | number): Promise<number>;

      public hasAccount(acct: string | number): Promise<boolean>;

      /**
       * get key for receiving address
       * @param acct - defaults to `0`
       */
      public createReceive(acct?: string | number): Promise<WalletKey>;

      /**
       * get key for change address
       * @param acct - defaults to `0`
       */
      public createChange(acct?: string | number): Promise<WalletKey>;

      /**
       * get key with incrementing HD path depth.
       * @param acct - defaults to `0`
       */
      public createNested(acct?: string | number): Promise<WalletKey>;

      /**
       * create a new address (increments depth)
       * @param acct
       * @param branch
       */
      public createKey(
        acct: number | string | null,
        branch: number
      ): Promise<WalletKey>;

      /**
       * save this wallet to a database
       * @param b
       */
      public save(b: Batch): Promise<void>;

      /**
       * increment this wallet's wid in db
       * @param b
       */
      public increment(b: Batch): Promise<void>;

      /**
       * test if the wallet has an address or not.
       * @param address
       */
      public hasAddress(address: Address | Buffer): Promise<boolean>;

      /**
       * get path for deriving the key for spending the address
       * @param address - address you own
       */
      public getPath(address: Address | Buffer): Promise<Path | null>;
      private readPath(address: Address | Buffer): Promise<Path | null>;
      public hasPath(address: Address | Buffer): Promise<boolean>;
      public getPaths(acct?: string | number): Promise<boolean>;
      public getAccountPaths(acct: string | number): Promise<Path[]>;

      /**
       * Import a keyring.
       * It will not exist on derivation chain.
       * @param acct
       */
      public importKey(
        acct: string | number,
        ring: WalletKey,
        passphrase?: Passphrase
      ): Promise<void>;

      /**
       * throws an error when...
       * - This wallet is not watchOnly.
       * - It has been imported already.
       * @param acct
       * @param address
       */
      public importAddress(
        acct: string | number,
        address: Address
      ): Promise<void>;

      public fund(mtx: MTX, options?: FundOptions, force?: boolean);
      public getAccountByAddress(
        address: Address | string | Buffer
      ): Promise<Account>;

      /**
       * Input size estimator for max possible tx size
       * used for passing to `mtx.fund`
       * @param prev - previous scriptPubKey
       */
      private estimateSize(prev: Script): Promise<number>;

      /**
       * Build a transaction, fill it with outputs and inputs,
       * sort the members according to BIP69
       * @param options
       */
      public createTX(options?: createTXOptions, force?: boolean): Promise<MTX>;

      /**
       * Create tx and broadcast
       * @param options
       * @param passphrase
       */
      public send(options?: createTXOptions, passphrase?: Passphrase);

      /**
       * Intentionally double-spend by increasing fee for an existing output
       * @param hash - txid
       * @param rate
       */
      public increaseFee(
        hash: Buffer,
        rate: Rate,
        passphrase?: Passphrase
      ): Promise<primitives.TX>;

      /**
       * resend all pending wallet tx
       */
      public resend(): Promise<TX[]>;

      /**
       * derive necessary keys for signing a transaction
       * @param mtx
       */
      public deriveInputs(mtx: primitives.MTX): Promise<WalletKey[]>;

      /**
       * get keyring associated to the address
       * may not hold private key.
       * @param address
       */
      public getKey(address: Address | Buffer): Promise<WalletKey | null>;

      /**
       * get keyring associated to (mostly for spending from) the address.
       * @param address
       * @param passphrase
       */
      public getPrivateKey(
        address: Address | Buffer,
        passphrase: Buffer | string
      ): Promise<WalletKey | null>;

      /**
       * Used in deriveInputs to get associated path for mtx inputs
       * @param mtx
       */
      private getInputPaths(mtx: MTX): Promise<Path[]>;

      /**
       * Not used currently.
       * @param tx
       */
      public getOutputPaths(tx: primitives.TX): Promise<Path[]>;

      /**
       * increase lookahead for account.
       * @param acct
       * @param lookahead
       * @param
       * @param number
       */
      public setLookahead(
        acct: number | string,
        lookahead: number
      ): Promise<void>;

      /** Sync address depths based on a transaction's outputs */
      private syncOutputDepth(tx: primitives.TX): Promise<WalletKey[]>;

      /**
       * build input scripts (or witness)
       * leave alone if the input is not redeemable by this wallet.
       * @param mtx
       * @returns Promise<number> - total number of scripts build
       */
      public template(mtx: MTX): Promise<number>;
      public sign(mtx: MTX, passphrase?: Passphrase): Promise<number>;

      // -------- below are all proxy for the methods from `TXDB` ------

      public getCoinView(tx): Promise<CoinView>;
      public getSpentView(tx: TX): Promise<CoinView>;

      public toDetails(wtx: TXRecord): Promise<Details>;
      /**
       * retrieve tx from txdb before calling `toDetails`
       * @param hash
       */
      public getDetails(hash: Buffer): Promise<Details>;
      public getCoin(hash: Buffer, index: number): Promise<Coin>;
      public getTX(hash: Buffer): Promise<TX>;
      public getBlocks(hash: Buffer): Promise<BlockRecord>;
      /**
       * add transaction to the wallets TX history
       * @param tx
       * @param block
       */
      public add(tx: TX, block: BlockMeta);

      /**
       * revert wallet state to `height`
       * @param height
       */
      public revert(height: number): Promise<void>;

      public remove(hash: Buffer): Promise<void>;

      /**
       * zap pending transactions older than `age`
       * @param acct
       * @param age
       * @returns Buffer - txid of zapped tx
       */
      public zap(acct?: number | string, age?: number): Promise<Buffer>;

      public abandon(hash: Buffer): Promise<any>;

      public lockCoin(
        coin: primitives.Coin | primitives.Outpoint
      ): Promise<void>;

      public unLockCoin(
        coin: primitives.Coin | primitives.Outpoint
      ): Promise<void>;

      public isLocked(
        coin: primitives.Coin | primitives.Outpoint
      ): Promise<void>;

      /**
       * get all locked outpoints
       */
      public getLocked(): Promise<Outpoint[]>;

      /**
       * Get all transactions in transaction history.
       * @param acct
       */
      public getHistory(acct?: string | number): Promise<TX>;

      /**
       * get all coins
       * @param acct
       */
      public getCoins(acct?: string | number): Promise<Coin[]>;

      public getCredits(acct?: string | number): Promise<Credit[]>;

      public getSmartCoins(acct?: string | number): Promise<Coin[]>;

      public getPending(acct?: string | number): Promise<TX[]>;

      public getBalance(acct?: string | number): Promise<Balance>;

      /**
       * get range of txs between two timestamps
       * @param acct
       */
      public getRange(
        acct: string | number | null,
        options: { start: number; end: number }
      ): Promise<TX[]>;

      /**
       * Get last N transactions
       * @param acct
       * @param limit
       */
      public getLast(
        acct: string | number | null,
        limit: number
      ): Promise<TX[]>;

      public accountKey(acct?: string | number): Promise<HDPublicKey>;

      public inspect(): {
        id: string;
        wid: WID;
        network: NetworkType;
        accountDepth: number;
        token: string;
        master: MasterKey;
      };

      public toJSON(
        unsafe?: Boolean
      ): {
        network: NetworkType;
        wid: WID;
        id: string;
        watchOnly: boolean;
        accountDepth: number;
        token: string;
        tokenDepth: number;
        master: MasterKey;
        balance: BalanceJSON;
      };

      public getSize(): number;

      public toRaw(): Buffer;

      private fromRaw(data: Buffer): Wallet;

      private static fromRaw(wdb: WalletDB, data: Buffer): Wallet;

      public static isWallet(obj: object): boolean;
    }

    interface Balance {
      toJSON(): BalanceJSON;
    }

    interface BalanceJSON {}

    interface TXRecord {}
    interface BlockRecord {}

    interface BlockMeta {}
    interface Details {}

    interface Credit {}

    export interface FundOptions {
      /**
       * If no account has specified, coins from entire wallet will be selected
       */
      account?: string | number;
      /**
       * coin selection algorithm. Defaults to `"age"`.
       */
      selection?: 'age' | 'random' | 'all';
      /**
       * whether to round to the nearest kilobyte for fee calculation.
       */
      round?: boolean;
      /**
       * Rate used for fee calculation.
       * estimates automatically when not specified
       */
      rate?: Rate;
      /**
       * Whether to select from coins unconfirmed or not.
       * default: false
       */
      smart?: boolean;
      /**
       * Do not apply fee if the transaction priority is high enough to be considered free.
       */
      free?: boolean;
      /**
       * Use a hard fee  rather than calculating one
       */
      hardFee: Amount;
      /**
       * Whether to subtract the fee from existing outputs rather than adding more inputs.
       */
      subtractFee: number | boolean;
    }

    export type createTXOptions = FundOptions & {
      outputs?: primitives.OutputOptions[];
      sort?: boolean;
      locktime?: number;
    };

    export interface WalletOptions {
      master: MasterKey | string;
      mnemonic: Partial<hd.MnemonicOptions>;
      wid: WID;
      id: string;
      watchOnly: boolean;
      accountDepth: number;
      token: Buffer;
      tokenDepth: number;
    }

    /**
     * defined as `WalletNode` internally.
     */
    export class Node extends node.Node {
      public opened: boolean;
      public client: Client;
      public wdb: WalletDB;
      public rpc: RPC;
      public http: HTTP;
      constructor(options?: ConfigOption);
      public open(): Promise<void>;
      public close(): Promise<void>;
    }

    export class RPC {}

    export class HTTP extends bweb.Server {
      public network: Network;
      public logger: LoggerContext | null;
      public node: Node | null;
      public chain: blockchain.Chain | null;
      public mempool: Pool | null;
      public fees: Fees | null;
      public miner: Miner | null;
      public rpc: any | null;
      constructor(options: Partial<HTTPOptions>);
    }

    export class HTTPOptions extends node.HTTPOptions {
      walletAuth: boolean;
    }
    /**
     * defined as `WalletClient` internally.
     * client for wallet to communicate with the node
     */
    export class Client extends bclient.NodeClient {}

    export class NodeClient {}
    export class TXDB {}
    export class MasterKey {}
    export class Account {
      constructor(wdb: WalletDB, options: AccountOptions);
    }
    interface AccountOptions {
      wid: number;
      accountIndex: number;
      name?: string;
      initialized?: boolean;
      witness?: boolean;
      watchOnly?: boolean;
      type?: string | number;
      m?: number;
      n?: number;
      receiveDepth?: number;
      changeDepth?: number;
      nestedDepth?: number;
      lookahead?: number;
      accountKey?: HDPublicKey;
    }
    export class WalletKey {}
    export class Path {}
    export class WalletDB {}

    /**
     * type emitted by walletdb
     */
    export type WalletDBEvent = 'address';
    export type WalletEvent = 'address';
  }

  export type Wallet = wallet.Wallet;

  export type Path = wallet.Path;
  export type WalletKey = wallet.WalletKey;
  export type WalletDB = wallet.WalletDB;

  /// ------ worker ------

  export namespace workers {
    export class WorkerPool {
      enabled: boolean;
      size: number;
      timeout: number;
      file: string;
      children: Map<number, Worker>;
      uid: number;
      constructor(options: WorkerPoolOptions);
      open(): Promise<void>;
      close(): Promise<void>;
      /**
       * Spawn new worker, if one with the `id` already exists,
       * then replace with the new one.
       * @param id
       */
      spawn(id: number): Worker;
      /**
       * Allocate a new worker. consider `size` and make sure
       * it wont make too much worker.
       */
      alloc(): Worker;
      sendEvent(...args: any[]): boolean;
      /**
       * Destroy wll workers.
       */
      destroy(): void;
      execute(packet: Packet, timeout: number): Promise<void>;
      /**
       * Execute the tx check jobs
       * @param tx
       * @param view
       * @param flags
       */
      check(tx: TX, view?: CoinView, flags?: number): Promise<null>;

      sign(mtx: MTX, ring?: KeyRing[], type?: SighashType): Promise<null>;

      checkInput(
        tx: TX,
        index: number,
        coin?: Coin | Output,
        flags?: number
      ): Promise<void>;

      signInput(
        tx: MTX,
        index: number,
        coin?: Coin | Output,
        keyring?: KeyRing,
        type?: SighashType
      ): Promise<void>;

      ecVerify(msg: Buffer, sig: Buffer, key: Buffer): Promise<number>;
      ecSign(msg: Buffer, key: Buffer): Promise<number>;
      mine(
        data: Buffer,
        target?: Buffer,
        min?: number,
        max?: number
      ): Promise<number>;

      script(
        passwd: Buffer,
        salt?: Buffer,
        N?: number,
        r?: number,
        p?: number,
        len?: number
      ): Promise<any>;
    }
    /**
     * Unit for workers to communicate with master.
     */
    abstract class Packet {
      public id: number;
      public cmd: number;
      constructor();
      abstract getSize(): number;
      abstract toWriter(): BufferWriter;
      abstract fromRaw(data: Buffer): any;
      static fromRaw(data): any;
    }

    class CheckPacket implements Packet {
      public id: number;
      public cmd: 5;
      constructor(tx?: TX, view?: CoinView, flags?: number);
      getSize(): number;
      toWriter(): BufferWriter;
      fromRaw(data: Buffer): CheckPacket;
      static fromRaw(data): CheckPacket;
    }

    class SignPacket implements Packet {
      public id: number;
      public cmd: 7;
      constructor(tx?: MTX, rings?: KeyRing[], type?: SighashType);
      getSize(): number;
      toWriter(): BufferWriter;
      fromRaw(data: Buffer): SignPacket;
      static fromRaw(data): SignPacket;
    }

    interface WorkerPoolOptions {
      enabled: boolean;
      /**
       * Number of cpu core to use.
       */
      size: number;
      timeout: number;
      /**
       * defaults to `bcoin/lib/workers/worker.js`
       * You can configure this by `BCOIN_WORKER_FILE`
       */
      file: string;
    }

    interface Worker {}
    export class Framer {}
    export class jobs {}
    export class packets {}

    export class Parser {}
  }

  export class WorkerPool extends workers.WorkerPool {}

  export interface pkg {
    readonly version: string;
    readonly url: string;
  }
}
