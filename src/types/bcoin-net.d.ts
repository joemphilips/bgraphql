declare module 'bcoin' {
  import { BloomFilter, RollingFilter } from 'bfilter';
  import List from 'blst';
  import { BufferSet, BufferMap } from 'buffer-map';
  import { Lock } from 'bmutex';
  import * as tcp from 'btcp';
  import Logger, { LoggerContext } from 'blgr';
  import { EventEmitter } from 'events';
  import { BufferWriter } from 'bufio';
  import { Socket } from 'net';
  export namespace net {
    export interface packets {
      types: {
        VERSION: 0;
        VERACK: 1;
        PING: 2;
        PONG: 3;
        GETADDR: 4;
        ADDR: 5;
        INV: 6;
        GETDATA: 7;
        NOTFOUND: 8;
        GETBLOCKS: 9;
        GETHEADERS: 10;
        HEADERS: 11;
        SENDHEADERS: 12;
        BLOCK: 13;
        TX: 14;
        REJECT: 15;
        MEMPOOL: 16;
        FILTERLOAD: 17;
        FILTERADD: 18;
        FILTERCLEAR: 19;
        MERKLEBLOCK: 20;
        FEEFILTER: 21;
        SENDCMPCT: 22;
        CMPCTBLOCK: 23;
        GETBLOCKTXN: 24;
        BLOCKTXN: 25;
        UNKNOWN: 26;
        // Internal
        INTERNAL: 27;
        DATA: 28;
      };
      typesByVal: Array<string>;
      // Packet: Packet;
      VersionPacket: VersionPacket;
      VerackPacket: VerackPacket;
      PingPacket: PingPacket;
      PongPacket: PongPacket;
      GetAddrPacket: GetAddrPacket;
      AddrPacket: AddrPacket;
      InvPacket: InvPacket;
      GetDataPacket: GetDataPacket;
      NotFoundPacket: NotFoundPacket;
      GetBlocksPacket: GetBlocksPacket;
      GetHeadersPacket: GetHeadersPacket;
      HeadersPacket: HeadersPacket;
      SendHeadersPacket: SendHeadersPacket;
      BlockPacket: BlockPacket;
      TXPacket: TXPacket;
      RejectPacket: RejectPacket;
      MempoolPacket: MempoolPacket;
      FilterLoadPacket: FilterLoadPacket;
      FilterAddPacket: FilterAddPacket;
      FilterClearPacket: FilterClearPacket;
      MerkleBlockPacket: MerkleBlockPacket;
      FeeFilterPacket: FeeFilterPacket;
      SendCmpctPacket: SendCmpctPacket;
      CmpctBlockPacket: CmpctBlockPacket;
      GetBlockTxnPacket: GetBlocksPacket;
      BlockTxnPacket: GetBlockTxnPacket;

      fromRaw: (cmd?: PacketTypeLower, data?: Buffer) => Packet;
    }

    type PacketTypeLower =
      | 'version'
      | 'verack'
      | 'ping'
      | 'pong'
      | 'getaddr'
      | 'addr'
      | 'inv'
      | 'getdata'
      | 'notfound'
      | 'getblocks'
      | 'getheaders'
      | 'headers'
      | 'sendheaders'
      | 'block'
      | 'tx'
      | 'reject'
      | 'mempool'
      | 'filterload'
      | 'filteradd'
      | 'filterclear'
      | 'merkleblock'
      | 'feefilter'
      | 'sendcmpct'
      | 'cmpctblock'
      | 'getblocktxn';

    class Packet {
      type: number;
      cmd: string;
      constructor();
      getSize(): number;
      roWriter(bw: BufferWriter): BufferWriter;
      toRaw(): Buffer;
      fromReader(): any;
      fromRaw(data: Buffer): any;
    }

    class VersionPacket extends Packet {
      constructor(options?: object);
    }

    class VerackPacket extends Packet {
      constructor(options?: object);
    }
    class PingPacket extends Packet {
      constructor(options?: object);
    }
    class PongPacket extends Packet {
      constructor(options?: object);
    }
    class GetAddrPacket extends Packet {
      constructor(options?: object);
    }
    class AddrPacket extends Packet {
      constructor(options?: object);
    }
    class InvPacket extends Packet {
      constructor(options?: object);
    }
    class GetDataPacket extends Packet {
      constructor(options?: object);
    }
    class NotFoundPacket extends Packet {
      constructor(options?: object);
    }
    class GetBlocksPacket extends Packet {
      constructor(options?: object);
    }
    class GetHeadersPacket extends Packet {
      constructor(options?: object);
    }
    class HeadersPacket extends Packet {
      constructor(options?: object);
    }
    class SendHeadersPacket extends Packet {
      constructor(options?: object);
    }
    class BlockPacket extends Packet {
      constructor(options?: object);
    }
    class TXPacket extends Packet {
      constructor(options?: object);
    }
    class RejectPacket extends Packet {
      constructor(options?: object);
    }
    class MempoolPacket extends Packet {
      constructor(options?: object);
    }
    class FilterLoadPacket extends Packet {
      constructor(options?: object);
    }
    class FilterAddPacket extends Packet {
      constructor(options?: object);
    }
    class FilterClearPacket extends Packet {
      constructor(options?: object);
    }
    class MerkleBlockPacket extends Packet {
      constructor(options?: object);
    }
    class FeeFilterPacket extends Packet {
      constructor(options?: object);
    }
    class SendCmpctPacket extends Packet {
      constructor(options?: object);
    }
    class CmpctBlockPacket extends Packet {
      constructor(options?: object);
    }
    class GetBlockTxnPacket extends Packet {
      constructor(options?: object);
    }
    class BlockTxnPacket extends Packet {
      constructor(options?: object);
    }
    class UnknownPacket extends Packet {
      constructor(options?: object);
    }
    export namespace bip152 {
      export class CompactBlock extends primitives.AbstractBlock {
        keyNonce: Buffer;
        ids: any[];
        ptx: any[];
        sipKey: null | any;
        now: number;
        available?: any[];
        idMap: Map<any, any>;
        count: number;
        totalTX: number;
        constructor(options?: CompactBlockOptions);
        verifyBody(): true;
      }

      interface CompactBlockOptions {
        keyNonce: Buffer;
        ids: any[];
        ptx: any[];
        available?: any[];
        idMap?: Map<any, any>;
        count?: number;
        totalTX?: number;
      }
    }

    export class Framer {}

    export class HostList {}

    export class NetAddress {}

    export class Parser extends EventEmitter {
      network: Network;
      pending: Buffer[];
      total: number;
      waiting: number;
      header?: Header;
      constructor(network: Network | NetworkType);
    }
    /**
     * network packet header.
     */
    class Header {
      cmd: Buffer;
      size: number;
      checksum: Buffer;
    }

    export class Peer {}

    export class Pool extends EventEmitter {
      static DISCOVERY_INTERVAL: number;
      opened: boolean;
      options: PoolOptions;
      network: Network;
      logger: LoggerContext;
      chain: Chain;
      mempool: Mempool;
      server: tcp.Server;
      nonces: NonceList;

      locker: Lock;
      connected: boolean;
      disconnecting: boolean;
      syncing: boolean;
      discovering: boolean;
      /**
       * Only present when using spv, or when passed as options explicitly.
       */
      spvFilter?: BloomFilter;
      txFilter: null | RollingFilter;
      blockMap: BufferSet;
      txMap: BufferSet;
      compactBlocks: BufferSet;
      invMap: BufferMap<BroadcastItem>;
      pendingFilter: null | any;

      checkpoints: boolean;
      headerChain: List<HeaderEntry>;
      headerNext: null | HeaderEntry;
      headerTip: null | HeaderEntry;
      peers: PeerList;
      hosts: HostList;
      id: number;
      constructor(options: PoolOptionArgs);
      public open(): Promise<void>;
      public close(): Promise<void>;
      resetChain(): void;
      public connect(): Promise<void>;
      public disconnect(): Promise<void>;
      private listen(): Promise<void>;
      private unlisten(): Promise<void>;
      private startTimer(): void;
      private stopTimer(): void;
      public discover(): Promise<void>;
      private discoverGateWay(): Promise<void>;
      private discoverSeeds(checkPeers?: boolean): Promise<void>;
      private discoverExternal(): Promise<void>;
      private handleSocket(socket?: Socket);
      /**
       * add new loader peer.
       */
      private addLoader(): void;
      private setLoader(peer?: Peer): void;
      public startSync(): void;
      private forceSync(): void;
      /**
       * Send a sync message to each peer
       * @param force
       */
      public sync(force?: boolean): void;
      private stopSync(): void;
      private resync(force?: boolean): Promise<void>;
      private isSyncable(peer: Peer): boolean;
      private sendSync(peer: Peer): boolean;
      private sendLocator(locator: Buffer[], peer: Peer): boolean;
      /**
       * send `mempool` to all peers
       */
      public sendMempool(): void;
      /**
       * Send `getaddr` to all peers.
       */
      public sendGetAddr(): void;
      /**
       * request current heaer chain blocks.
       * @param peer
       */
      private resolveHeaders(peer: Peer): void;
      /**
       * Update local information about peers.
       * Specifically, it will update `peer.bestHeight` .
       * @param hash
       * @param height
       */
      private resolveHeight(hash: Buffer, height: number): void;
      /**
       * Get next checkpoint
       * @param height - current height.
       */
      private getNextTip(height: number): HeaderEntry;
      public announceList(peer: Peer): void;
      private getBroadcasted(peer: Peer, item: InvItem): null | string;
      /**
       * Get a block/tx from anywhere its possible.
       * priority is
       * 1. broadcast map
       * 2. mempool
       * 3. blockchain
       * @param peer
       * @param item
       */
      private getItem(peer: Peer, item: InvItem): Block | null;
      private sendBlock(
        peer: Peer,
        item: InvItem,
        witness?: boolean
      ): Promise<boolean>;
      private createOutbound(addr: NetAddress): Peer;
      private createInbound(socket: Socket): Peer;
      /**
       * Handle following events for the peer
       * 1. error
       * 2. connect
       * 3. open
       * 4. close
       * 5. ban
       * @param peer
       */
      private bindPeer(peer: Peer): void;
      private handlePacket(peer: Peer, packet: Packet): Promise<void>;
      // ---- many `handle.*` methods ...
      private addInbound(socket: Socket): void;
      private getHost(): NetAddress | null;
      private removePeer(peer: Peer): void;
      /**
       * Attempt to refill the pool with peers
       */
      private refill(): void;
      /**
       * Ban peer
       * @param addr
       */
      public ban(addr: NetAddress): void;
      public unban(addr: NetAddress): void;
      public setFilter(filter: BloomFilter): void;

      // ------- spv only methods --------
      public watch(data: Buffer, enc?: string): void;
      public unwatch(): void;
      private queueFilterLoad(): void;
      private sendFilterLoad(): void;
      private watchAddress(): void;
      private watchOutpoint(outpoint: Outpoint): void;
      public resolveOrphan(peer: Peer, orphan: Buffer): Promise<void>;
      public getHeaders(peer: Peer, tip: Buffer, stop?: Buffer): Promise<void>;
      public getBlocks(peer: Peer, tip: Buffer, stop?: Buffer): Promise<void>;
      public getTX(peer: Peer, hashes: Buffer[]): null;
      public hasBlock(hash: Buffer): Promise<boolean>;
      public hasTX(hash: Buffer): boolean;
      /**
       * Check existence of tx, if it does not. then request to peers
       * @param peer
       * @param hashes
       */
      public ensureTX(peer: Peer, hashes: Buffer[]): void;
      public broadcast(msg: TX | Block): Promise<void>;
      public announceBlock(msg: Block): void;
      public announceTX(msg: TX): void;
    }

    class PoolOptions {
      network: Network;
      logger?: LoggerContext;
      chain: Chain;
      mempool?: Mempool;
      nonces: NonceList;
      prefix?: string;
      checkpoints: boolean;
      spv: boolean;
      bip37: boolean;
      listen: boolean;
      compact: boolean;
      noRelay: boolean;
      host: string;
      port: number;
      publicHost: string;
      publicPort: number;
      maxOutbound: number;
      maxInbound: number;
      createSocket: Function;
      createServer: tcp.createServer;
      resolve: Function;
      proxy?: any;
      onion: boolean;
      upnp: boolean;
      selfish: boolean;
      version: number;
      agent: string;
      banScore: number;
      banTime: number;
      feeRate: number;
      seeds: string[];
      nodes: any[];
      invTimeout: number;
      blockMode: number;
      services: common.LOCAL_SERVICES;
      requiredServices: common.REQUIRED_SERVICES;
      memory: boolean;
      constructor(options: PoolOptionArgs);
      static fromOptions(options: PoolOptionArgs): Pool;
      getHeight(): number;
      private isFull(): boolean;
      private getRequiredServices(): number;
      private hasWitness(): boolean;
      private hasWitness(): boolean;
      private createNonce(hostname: string): Buffer;
      private hasNonce(nonce: Buffer): boolean;
      private getRate(hash: Buffer): Rate;
    }

    class PeerList {
      map: Map<string, Peer>;
      ids: Map<string, Peer>;
      list: List;
      load: null | any;
      inbound: number;
      outbound: number;
    }

    type PoolOptionArgs = Partial<PoolOptions> & {
      chain: Chain;
    };

    class BroadcastItem {
      pool: Pool;
      hash: Buffer;
      type: any;
      msg: TX | Block;
      jobs: any[];
      addJob(resolve: Function, reject: Function): void;
      start(): BroadcastItem;
      refresh(): void;
      announce(): void;
      cleanup(): void;
      reject(): void;
      resolve(): void;
      handleAck(peer: Peer): void;
      handleReject(peer: Peer): void;
      inspect(): string;
    }

    class NonceList {
      map: BufferMap;
      hosts: Map<any, any>;
      alloc(hostname: string): any;
    }

    class HeaderEntry {
      hash: Buffer;
      height: number;
      prev?: HeaderEntry;
      next?: HeaderEntry;
    }

    export namespace common {
      export type services = {
        NETWORK: 1;
        GETUTXO: 2;
        BLOOM: 3;
        WITNESS: 4;
      };
      export type LOCAL_SERVICES = 5;
      export type REQUIRED_SERVICES = 1;
    }
  }
}
