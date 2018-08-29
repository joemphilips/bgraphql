declare module 'bcoin' {
  import Config, { ConfigOption } from 'bcfg';
  import { Lock } from 'bmutex';
  import * as bweb from 'bweb';
  import { EventEmitter } from 'events';
  import Logger, { LoggerContext } from 'blgr';
  import { BloomFilter } from 'bfilter';

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
      opened: boolean;
      spv: boolean;
      chain: Chain;
      fees: Fees;
      mempool: Mempool;
      pool: Pool;
      miner: Miner;
      rpc: RPC;
      http: HTTP;
      constructor(options: ConfigOption);
      public open(): Promise<void>;
      public close(): Promise<void>;
      public scan(
        start: number | HashKey,
        filter: BloomFilter,
        Function: blockchain.ScanIterator
      ): Promise<void>;
      private broadcast(item: TX | Block): Promise<void>;
      /**
       * Try to broadcast tx.
       */
      public sendTX(tx: TX): Promise<void>;
      /**
       * Same with `sendTX` , but silence error.
       * @param tx
       */
      public relay(tx: TX): Promise<void>;
      public startSync(): any;
      public stopSync(): any;
      /**
       * Proxy for chain.getBlock
       * @param hash
       */
      getBlock(hash: HashKey): Promise<Block>;
      /**
       * Retrieve a coin from the mempool or chain database.
       * Takes into account spent coins in the mempool.
       * @param hash
       * @param index
       */
      getCoin(hash: HashKey, index: number): Promise<Coin | null>;
      getCoinsByAddress(addrs: Address[]): Promise<Coin[]>;
      getMetaByAddress(addrs: Address[]): Promise<primitives.TXMeta[]>;
      getMeta(hash: HashKey): Promise<primitives.TXMeta>;
      /**
       * retrieve a spent coin viewpoint from mempool or chain database.
       * @param meta - if meta.height is -1, then get from mempool.
       */
      getMetaView(meta: primitives.TXMeta): Promise<CoinView>;
      getTXByAddress(addrs: Address[]): Promise<TX[]>;
      getTX(hash: HashKey): Promise<TX>;
      hasTX(hash: HashKey): Promise<boolean>;
    }

    class RPC {}

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
      network: Network;
      logger: LoggerContext;
      node: Node;
      chain: Chain;
      mempool: Mempool;
      pool: Pool;
      fees: Fees;
      miner: Miner;
      constructor(options: HTTPOptions);
    }

    export class SPVNode extends Node {
      public chain: Chain;
      public pool: Pool;
      public http: HTTP;
      public RPC: RPC;
      scanLock: Lock;
      watchLock: Lock;
      constructor(options?: ConfigOption);
      public open(): Promise<void>;
      public close(): Promise<void>;
    }
  }

  export class Node extends node.Node {}

  export class FullNode extends node.FullNode {
    constructor(options: ConfigOption);
  }

  export class SPVNode extends node.SPVNode {}
}
