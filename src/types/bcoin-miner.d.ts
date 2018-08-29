declare module 'bcoin' {
  import { EventEmitter } from 'events';
  import { Network, Chain, ChainEntry, CoinView } from 'bcoin';
  import Logger, { LoggerContext } from 'blgr';
  import { Lock } from 'bmutex';

  export namespace mining {
    export class Miner extends EventEmitter {
      opened: boolean;
      options: MinerOptions;
      network: Network;
      logger: LoggerContext;
      workers: WorkerPool;
      chain: Chain;
      mempool: Mempool;
      addresses: Address[];
      locker: Lock;
      cpu: CPUMiner;
      constructor(options: MinerArgs);
      open(): Promise<void>;
      close(): Promise<void>;
      createBlock(tip?: ChainEntry, address?: Address): Promise<BlockTemplate>;
      updateTime(attempt: BlockTemplate): void;
      createJob(tip?: ChainEntry, address?: Address): Promise<CPUJob>;
      mineBlock(tip?: ChainEntry, address?: Address): Promise<Block>;
      addAddress(address: Address): void;
      getAddress(): Address;
      /**
       * assemble mempool entries for mining
       * returns null if miner don't have mempool
       * @param attempt
       */
      assemble(attempt: BlockTemplate): MempoolEntry[];
    }

    export type MinerArgs = {
      chain: Chain;
    } & Partial<MinerOptions>;

    export class MinerOptions {
      network: Network;
      logger: Logger;
      workers: WorkerPool;
      chain: Chain;
      mempool: Mempool;
      version: number;
      addresses: Address[];
      coinbaseFlags: Buffer;
      preverify: boolean;

      minWeight: number;
      maxWeight: number;
      priorityWeight: number;
      priorityThreshold: number;
      maxSigops: number;
      reservedWeight: number;
      reservedSigops: number;
      constructor(options: MinerArgs);
      static fromOptions(options: MinerArgs): MinerOptions;
    }

    export interface common {
      swap32: (data: Buffer) => Buffer;
      rcmp: (a: Buffer, b: Buffer) => number;
      double256: (target: Buffer) => number;
      getTarget: (bits: number) => Buffer;
      getBits: (data: Buffer) => Buffer;
    }
    export class CPUMiner extends EventEmitter {
      /**
       * Nonce range interval
       */
      static INTERVAL: number;
      opened: boolean;
      miner: Miner;
      network: Network;
      logger: LoggerContext;
      chain: Chain;
      locker: Lock;
      running: boolean;
      stopping: boolean;
      job?: CPUJob;
      stopJob?: { resolve: Function; reject: Function };
      constructor(miner: Miner);
      open(): Promise<void>;
      close(): Promise<void>;
      /**
       * Start mining forever , emits `block` event.
       */
      start(): Promise<void>;
      stop(): Promise<void>;
      private wait(): Promise<void>;

      /**
       * Create CPU job
       * @param tip
       * @param address
       */
      createJob(tip?: ChainEntry, address?: Address): Promise<CPUJob>;

      /**
       *
       * @param tip create job and mine async
       * @param address
       */
      mineBlock(tip?: ChainEntry, address?: Address): Promise<Block>;
      notifyEntry(): void;
      findNonce(job: CPUJob): number;
      findNonceAsync(job: CPUJob): Promise<number>;
      /**+
       * Mine synchronously until the block is found
       */
      mine(job: CPUJob): Block;
      minAsync(job: CPUJob): Promise<Block>;
      /**
       * Emits "status" event which contains hashrate information.
       * @param job
       * @param nonce
       */
      sendStatus(job: CPUJob, nonce: number): void;
    }

    class CPUJob {
      miner: CPUMiner;
      attempt: BlockTemplate;
      destroyed: boolean;
      committed: boolean;
      start: number;
      nonce1: number;
      nonce2: number;
      constructor(miner: CPUMiner, attempt: BlockTemplate);
      getHeader(): Buffer;
      commit(nonce: number): Block;
      mine(): Block;
      mineAsync(): Promise<Block>;
      refresh(): void;
      updateNonce(): void;
      destroy(): void;
      getHashes(nonce: number): number;
      getRate(nonce: number): number;
      addTX(tx: TX, view?: CoinView): void;
    }

    /**
     * Hash until the nonce overflows.
     * @param data¥
     * @param target
     * @param min
     * @param max
     */
    export function mine(
      data: Buffer,
      target: Buffer,
      min: number,
      max: number
    ): number;

    export class BlockTemplate {
      prevBlock: Buffer;
      version: number;
      height: number;
      time: number;
      bits: number;
      target: Buffer;
      locktime: number;
      mtp: number;
      flags: number;
      coinbaseFlags: Buffer;
      witness: boolean;
      address: Address;
      sigops: number;
      weight: number;
      interval: number;
      fees: number;
      items: any[];
      tree: MerkleTree;
      commitment: Buffer;
      left: Buffer;
      right: Buffer;
      constructor(options?: Partial<BlockTemplateOptions>);
      static fromOptions(options: Partial<BlockTemplateOptions>);
      getWitnessHash(): Buffer;
      getWitnessScript(): Script;
      setBits(bits: number): void;
      setTarget(target: Buffer): void;
      getReward(): Amount;
      createCoinbase(hash: Buffer): TX;
      refresh(): void;
      getRawCoinbase(nonce1: number, nonce2: number): Buffer;
      getRoot(nonce1, nonce2): Buffer;
      getHeader(root: Buffer, time: number, nonce: number);
      getProof(
        nonce1: number,
        nonce2: number,
        time: number,
        nonce: number
      ): BlockProof;
      getCoinbase(nonce1: number, nonce2: number): TX;
      /**
       * Create Block from calculated proof
       * @param proof
       */
      commit(proof: BlockProof): Block;
      toCoinbase(): TX;
      toBlock(): Block;
      /**
       * Calculate the target difficulty
       */
      getDifficulty(): number;
      setAddress(): Address;
      addTX(tx: TX, view: CoinView): boolean;
      pushTX(tx: TX, view?: CoinView): boolean;
    }
    interface BlockTemplateOptions {
      prevBlock: Buffer;
      version: number;
      height: number;
      time: number;
      bits: number;
      target: Buffer;
      locktime: number;
      mtp: number;
      flags: number;
      coinbaseFlags: Buffer;
      witness: boolean;
      address: Address;
      sigops: number;
      weight: number;
      interval: number;
      fees: number;
      items: BlockEntry[];
    }

    class BlockProof {
      hash: Buffer;
      root: Buffer;
      nonce1: number;
      nonce2: number;
      time: number;
      nonce: number;
      constructor(
        hash: Buffer,
        root: Buffer,
        nonce1: number,
        nonce2: number,
        time: number,
        nonce: number
      );
      rhash(): Buffer;
      verify(): Buffer;
      getDifficulty(): Buffer;
    }

    export class BlockEntry {
      tx: TX;
      hash: Buffer;
      fee: number;
      rate: number;
      priority: number;
      free: boolean;
      sigops: number;
      descRate: number;
      depCount: number;
      constructor(tx: TX);
      static fromTX(tx: TX, view: CoinView, attempt: BlockTemplate);
    }
    class MerkleTree {
      steps: Buffer[];
      constructor();
      withFirst(hash: Buffer): Buffer;
      toJSON(): string[];
      static fromItems(items: BlockEntry): MerkleTree;
      static fromBlock(txs: TX[]): MerkleTree;
      static fromLeaves(leaves: Buffer[]): MerkleTree;
    }
  }

  export class Miner extends mining.Miner {}
}
