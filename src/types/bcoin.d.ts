// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bweb
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'bcoin' {
  import { BloomFilter, RollingFilter } from 'bfilter';
  import { BufferWriter, BufferReader } from 'bufio';
  import { BufferMap } from 'buffer-map';
  import BN from 'bn.js';
  import AsyncEmitter from 'bevent';
  import { EventEmitter } from 'events';
  import Logger, { LoggerContext } from 'blgr';
  import * as bweb from 'bweb';
  import * as bclient from 'bclient';
  import { DB, Batch, DBOptions, Bucket } from 'bdb';
  import { Lock, MapLock } from 'bmutex';
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
  type HashKey = Buffer;
  export namespace btc {
    export class Amount {
      // raw value in satoshi.
      value: number;
      constructor(value?: string | number, unit?: string);
      toValue(): Amount;
      /**
       * returns string by default.
       * @param num
       */
      private toSatoshis(num?: boolean): string | Amount;
      private toBits(num?: boolean): string | Amount;
      private toMBTC(num?: boolean): string | Amount;
      private toBTC(num?: boolean): string | Amount;
      /**
       * Returns string by default.
       * Returns `Amount` when specified `num`
       * @param unit
       * @param num
       */
      public to(
        unit: 'sat' | 'ubtc' | 'bits' | 'mbtc' | 'btc',
        num?: boolean
      ): string | Amount;
      private fromSatoshis(value: number | string): string | Amount;
      private fromBits(value: number | string): Amount;
      private fromMBTC(value: number | string): Amount;
      private fromBTC(value: number | string): Amount;
      public from(unit: string, value: number | string): Amount;
      static fromSatoshis(value: number | string): string | Amount;
      static fromBits(value: number | string): Amount;
      static fromMBTC(value: number | string): Amount;
      static fromBTC(value: number | string): Amount;
      static from(unit: string, value: number | string): Amount;
      inspect(): string;
      // ---- private static methods -----
      static btc(value: Amount, num?: boolean): string;
      static value(str: string): Amount;
      static encode(value: Amount, exp: number, num?: boolean): string | number;
      static decode(value: string | number, exp: number): Amount;
    }

    export class URI {}
  }

  export class Amount extends btc.Amount {}

  export class URI extends btc.URI {}
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
      feeRate: Rate;
      maxFeeRate: Rate;
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
      feeRate: Rate;
      maxFeeRate: Rate;
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
       * Default is all available cors in machine.
       */
      size?: number;
      timeout?: number;
      /**
       * defaults to `bcoin/lib/workers/worker.js`
       * You can configure this by `BCOIN_WORKER_FILE`
       */
      file?: string;
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
