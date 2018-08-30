declare module 'bcoin' {
  import { script, Fees, WorkerPool, CoinView } from 'bcoin';
  import { BufferMap } from 'buffer-map';
  import { BufferWriter, BufferReader } from 'bufio';
  import { BloomFilter } from 'bfilter';
  export namespace primitives {
    export class Address {
      type: AddressTypeNum;
      version: number;
      hash: Buffer;
      constructor(options?: Partial<AddressOptions>);
      fromOptions(options: AddressOptions): Address;
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
    export class Block extends AbstractBlock {
      version: number;
      prevBlock: Buffer;
      merkleRoot: Buffer;
      time: number;
      bits: number;
      nonce: number;
      txs?: TX[];
      constructor(options?: BlockOptions);
      static fromOptions(options: BlockOptions);
      refresh(all?: boolean): Block;
      toRaw(): Buffer;
      toNormal(): Buffer;
      toWriter(bw: BufferWriter): BufferWriter;

      verifyBody(): boolean;
    }

    type BlockOptions = {
      txs?: TX[];
    } & BlockHeaderOpts;

    export class TXMeta {
      tx: TX;
      mtime: number;
      height: number;
      block?: Buffer;
      time: number;
      index: number;
      constructor(options?: Partial<TXMetaOptions>);
      static fromOptions(options: Partial<TXMetaOptions>): TXMeta;
      static fromTX(tx: TX, entry: TXMetaEntry, index: number): TXMeta;
      public inspect(): TXMetaView;
      public format(view?: CoinView): TXMetaView;
      public toJSON(): TXMetaJson;
      public getJSON(
        network?: Network,
        view?: CoinView,
        chainHeight?: number
      ): TXMetaJson;
      static fromJSON(json: TXMetaView): TXMeta;
      getSize(): number;
      toRaw(): Buffer;
      private fromRaw(data: Buffer): TXMeta;
      static fromRaw(data: Buffer, enc: 'hex' | 'null'): TXMeta;
      static isTXMeta(obj: object): boolean;
    }

    interface TXMetaEntry {
      height: number;
      hash: Buffer;
      time: number;
    }

    interface TXMetaView {
      mtime: number;
      height: number;
      block: Buffer | null;
      time: number;
    }

    type TXMetaJson = {
      confirmations: number;
    } & TXMetaView;

    type TXMetaOptions = {
      tx: TX;
      index: number;
    } & TXMetaView;

    export class Coin extends IOutput {
      version: number;
      height: number;
      coinbase: boolean;
      hash: Buffer;
      index: number;
      script: Script;
      constructor(options?: Partial<CoinOptions>);
      clone(): Coin;
      public getDepth(height?: number): number;
      public toKey(): string;
      static fromKey(key: string): Coin;
      rhash(): Buffer;
      txid(): Buffer;
      inspect(): CoinOptions & {
        address: Address | null;
        type: script.common.typesByValLower;
      };
      toJSON(): CoinOptions & { address: Address | null };
      getJSON(
        network: NetworkType,
        minmal?: boolean
      ): CoinOptions & { address: Address | null };
      private fromJSON(json: CoinOptions): Coin;
      getSize(): number;
      toWriter(bw: BufferWriter): BufferWriter;
      toRaw(): Buffer | string;
      static fromReader(data: Buffer): Coin;
      static fromRaw(): Coin;
      fromTX(tx: TX, index: number, height: number): Coin;
      static fromTX(tx: TX, index: number, height: number): Coin;
      static isCoin(object: object): boolean;
    }

    export interface CoinOptions {
      version: number;
      height: number;
      value: Amount;
      script: ScriptOptions;
      coinbase: boolean;
      hash: Buffer;
      index: number;
    }

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
    export class Input {
      constructor(options?: InputOptions);
      static fromOptions(options: InputOptions): Input;
      clone(): Input;
      equals(input: Input): boolean;
      /**
       * bip69 comparison.
       */
      compare(input: Input): number;
      /**
       *
       * @param coin - if present. it will check prevout directly. otherwise it will guess.
       */
      getType(coin?: Coin): script.common.typesByValLower | 'coinbase';
      /**
       * Try to get witnessscripthash in case it is p2sh-p2wsh
       * @param coin
       */
      getRedeem(coin?: Coin): Script | null;
      /**
       * Get the redeem script type.
       * @param coin
       */
      getSubtype(coin?: Coin): script.common.typesByValLower | null;
      /**
       * Get the previous output script's address.
       * It will guess when if coin is not available
       */
      getAddress(coin?: Coin): Address | null;
      getHash(coin?: Coin, enc?: string): Buffer;
      isFinal(): boolean;
      isRBF(): boolean;
      isCoinbase(): boolean;
      inspect(): InputDetail;
      format(): InputDetail;
      toJSON(
        network: Network | NetworkType,
        coin?: Coin
      ): InputJson & { address: string };
      private fromJSON(json: InputJson): InputJson;
      static fromJSON(json: InputJson): InputJson;
      getSize(): number;
      toRaw(): Buffer | string;
      toWriter(bw: BufferWriter): BufferWriter;
      static froMRaw(data: Buffer | string, enc?: 'hex'): Input;
      static fromReader(br: BufferReader): Input;
      static fromOutpoint(outpoint: Outpoint): Input;
      static fromCoin(coin: Coin): Input;
      static fromTX(tx: TX, index: number): Input;
      static isInput(obj: object): boolean;
    }

    interface InputOptions {
      prevout?: Outpoint;
      script?: Script;
      sequence?: number;
      witness?: Witness;
    }

    type InputDetail = {
      type: script.common.typesByValLower | 'coinbase';
      subtype: script.common.typesByValLower | null;
      redeem: Script | null;
      address: Address;
      script: Script;
      witness: Witness;
      sequence: number;
      prevout: Outpoint;
      coin?: Coin | null;
    };

    /**
     * return value of `Input.format()`
     */
    interface InputJson {
      prevout: OutpointOptions;
      script: string;
      witness: string;
      sequence: number;
      coin?: CoinOptions & { address: Address | null };
    }

    export class InvItem {}

    export class KeyRing {
      [key: string]: any;
      static generate(compress?: boolean): KeyRing;
    }

    export class MerkleBlock {}

    export class MTX extends ITX {
      mutable: true;
      view: CoinView;
      changeIndex: number;
      constructor(options?: TXOption & { chainIndex?: number });
      static fromOptions(options?: TXOption & { chainIndex?: number }): MTX;
      addInput(options: Input | InputOptions): Input;
      addOutpoint(outpoint: Outpoint | OutpointOptions): Input;
      addCoin(coin: Coin): Input;
      addTX(tx: TX, index: number, height?: number): Input;
      addOutput(
        script: Address | Script | Output | OutputOptions,
        value?: number
      ): Output;
      clone<MTX>(): MTX;
      /**
       * Throws error when failed to verify script
       * @param flags
       */
      check(flags?: script.common.flags): void;
      checkAsync(flags?: script.common.flags, pool?: WorkerPool): Promise<void>;
      /**
       * Almost exactly same with `check`, but never throws error.
       */
      verify(flags?: script.common.flags): boolean;
      verifyAsync(flags?: script.common.types): Promise<boolean>;
      getFee(): Amount;
      getInputValue(): Amount;
      getInputAddress(): Address[];
      getAddresses(): Address[];
      /**
       * Get all input address hashes
       */
      getInputHashes(enc?: 'hex'): Buffer;
      /**
       * Get all addresses in hashes
       * @param enc
       */
      getHashes(enc?: 'hex'): Buffer[];
      hasCoins(): boolean;
      getSigops(flags?: script.common.flags): number;
      getSigopsCost(flags?: script.common.flags): number;
      getSigopsSize(flags?: script.common.flags): number;
      /**
       * perform contextual checks to verify input, output, and fee values,
       * as well as coinbase maturity.
       * @param height - if in mempool, then this will be `chain height + 1`
       */
      verifyInputs(height: number): boolean;
      /**
       *
       * @param height
       * @returns - 1. fee, 2. reason failed 3. score.
       */
      checkInputs(height: number): [number, string, number];
      /**
       * Build input script(or witness) templates.
       * tries to guess what is the type of script we need from prevout.script
       * If it fails, returns `false`
       * Used from `this.template` , `this.sign`
       */
      private scriptInput(
        index: number,
        coin: Coin | Output,
        ring: KeyRing
      ): boolean;
      /**
       * In case previous out does not require script.(i.e. P2PKH, etc.)
       * scriptInput will delegate execution to this function
       * @param prev
       * @param ring
       */
      private scriptVector(prev: Script, ring: KeyRing): null | Stack;
      signInputAsync(
        index: number,
        coin: Coin | Output,
        ring: KeyRing,
        type?: script.common.hashType
      ): Promise<void>;
      /**
       * In case, there was not pool, signInputAsync will delegate to this function. * @param index
       * @param coin
       * @param ring
       * @param type
       */
      private signInput(
        index: number,
        coin: Coin | Output,
        ring: KeyRing,
        type?: script.common.hashType
      ): boolean;
      private signVector(
        prev: Script,
        vector: Stack,
        sig: Buffer,
        ring?: KeyRing
      ): boolean;
      isSigned(): boolean;
      isInputSigned(index: number, coin: Coin | Output): boolean;
      /**
       * Build input scripts (or witness) without signing.
       * @param ring
       */
      template(ring: KeyRing): number;
      sign(ring: KeyRing, type?: script.common.hashType): number;
      signAsync(
        ring: KeyRing,
        type: script.common.hashType,
        pool?: WorkerPool
      ): Promise<void>;
      estimateSize(estimate?: Function): Promise<number>;
      /**
       * returns CoinSelector with `chosen` property filled
       * throws `FundingError` when not
       * @param coins
       * @param options
       */
      selectCoins(coins: Coin[], options?: CoinSelectorOption): CoinSelector;
      /**
       * Attempt to subtract a fee from a single output.
       * @param index
       * @param fee
       */
      subtractIndex(index: number, fee: Amount): void;
      /**
       * throws error when there are no fee to subtract
       * @param fee
       */
      subtractFee(fee: number): void;
      fund(
        coins: Coin[],
        options: CoinSelectorOption & { changeAddress: string }
      );
      sortMembers(): void;
      avoidFeeSniping(height: number): void;
      setLocktime(locktime: number): void;
      setSequence(index: number, locktime: number, seconds?: boolean): void;
      inspect(): TXFormat;
      format(): TXFormat;
      toJSON(): TXJsonResult;
      private fromJSON(json: TXJson);
      static fromJSON(json: TXJson & {}): MTX;
      static fromReader(br: BufferReader): MTX;
      static fromRaw(data: Buffer | string, enc?: string): MTX;
      toTX(): TX;
      commit(): [TX, CoinView];
      static fromTX(tx);
      static isMTX(obj: object): boolean;
    }

    /**
     * Error thrown when funding failed (e.g. not enough inputs.)
     */
    export class FundingError extends Error {}

    class CoinSelector {
      tx: TX;
      coins: Coin[];
      change: number[];
      fee: number; // minimum fee is 10000 satoshi/kb

      outputValue: number;
      index: number;
      chosen: Coin[];
      selection: string;
      subtractFee: boolean;
      subtractIndex: number;
      height: number;
      depth: number;
      hardFee: number;
      rate: number;
      maxFee: number;
      round: boolean;
      changeAddress?: string;
      /**
       * Function to estimate size.
       */
      estimate?: Function;
      inputs: BufferMap<Input>;
      constructor(tx: TX, options?: CoinSelectorOption);
    }

    interface CoinSelectorOption {
      selection?: string;
      subtractFee?: number | boolean;
      subtractIndex?: number;
      height?: number;
      confirmations?: number;
      depth?: number;
      hardFee?: number;
      rate?: number;
      maxFee?: number;
      round?: boolean;
      changeAddress?: string;
      estimate?: Function;
      inputs?: Input[];
    }

    export class Selector extends CoinSelector {}

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

    export class Outpoint {
      hash: Buffer;
      index: number;
      constructor(hash?: Buffer, index?: number);
    }

    interface OutpointOptions {
      hash: Buffer;
      index: number;
    }

    /**
     * Coin extends Output, but some methods type signature is
     * incompatible if we extend directly from Output.
     * so we make a cushion here to avoid a compile error.
     */
    abstract class IOutput {
      value: number;
      script: Script;
      clone(): any;
      equals(to: any): boolean;
      /**
       * bip69 comparison
       * @param output
       */
      compare(to: any): number;
      getType(): script.common.typesByValLower;
      getAddress(): Address;
      getHash(enc?: 'hex'): Buffer | string | null;
      getDustThreshold(rate?: Rate): number;
      getSize(): number;
      isDust(rate?: Rate): boolean;
    }

    export class Output implements IOutput {
      value: number;
      script: Script;
      constructor(options?: OutputOptions);
      clone(): Output;
      equals(output: Output): boolean;
      /**
       * bip69 comparison
       * @param output
       */
      compare(output: Output): number;
      getType(): script.common.typesByValLower;
      getAddress(): Address;
      getHash(enc?: 'hex'): Buffer | string | null;
      inspect(): OutputFormat;
      getJSON(): OutputJson;
      toJSON(): OutputJson;
      getDustThreshold(rate?: Rate): number;
      getSize(): number;
      isDust(rate?: Rate): boolean;
      static fromJSON(json: { value: number; script: string }): Output;
      toWriter(bw: BufferWriter): BufferWriter;
      toRaw(): Buffer;
      static fromReader(br: BufferReader): Output;
      static fromRaw(data: Buffer | string, enc?: 'hex'): Output;
      static isOutput(obj: object): boolean;
    }

    export interface OutputFormat {
      type: script.common.typesByValLower;
      value: number;
      script: Script;
      address: Address;
    }

    /**
     * result of `Output.getJSON`
     */
    export interface OutputJson {
      value: number;
      script: string;
      address: string;
    }

    /**
     * MTX extends TX, but some methods type signature is
     * incompatible if we extend directly from TX.
     * so we make a cushion here to avoid compile error.
     */
    abstract class ITX {
      checksig(
        index: number,
        prev: Script,
        value: Amount,
        sig: Buffer,
        key: Buffer,
        version: number
      ): boolean;
      signature(
        index: number,
        prev: Script,
        value: Amount,
        key: Buffer,
        type: script.common.hashType,
        version: 0 | 1
      );
      isCoinbase(): boolean;
      isRBF(): boolean;
      getFee(view: CoinView): Amount;
      getInputValue(view: CoinView): Amount;
      getOutputValue(): Amount;
      getInputAddress(view: CoinView): Address[];
      getOutputAddresses(): Address[];
      getAddresses(view?: CoinView): Address[];
      isFinal(height: number, time: number): boolean;
      verifyLocktime(index: number, predicate: number): boolean;
      verifySequence(index: number, predicate: number): boolean;
      isSane(): [boolean, string, number];
      isStandard(): [boolean, string, number];
      hasStandardInputs(view: CoinView): boolean;
      hasStandardWitness(view: CoinView): boolean;
      getModifiedSize(size?: number): number;
      getPriority(view: CoinView, height: number, size?: number): number;
      getChainValue(view: CoinView): number;
      isFree(view: CoinView, height?: number, size?: number): boolean;
      getMinFee(size?: number, rate?: Rate): Amount;
      getRoundFee(size?: number, rate?: Rate): Amount;
      getRate(view: CoinView, size?: number): Rate;
      getPrevout(): Buffer[];
      isWatched(filter: BloomFilter): boolean;
      rhash(): Buffer;
      rwhash(): Buffer;
      txid(): Buffer;
    }

    export class TX implements ITX {
      public version: number;
      public inputs: Input[];
      public outputs: Output[];
      public locktime: number;
      public mutable: boolean;
      private _witness: number;
      constructor(option: TXOption);
      clone<T = TX>(): T;
      inject(tx: TX): TX;
      public checksig(
        index: number,
        prev: Script,
        value: Amount,
        sig: Buffer,
        key: Buffer,
        version: number
      ): boolean;
      signature(
        index: number,
        prev: Script,
        value: Amount,
        key: Buffer,
        type: script.common.hashType,
        version: 0 | 1
      );
      /**
       * Verify all transaction inputs
       * @param view
       * @param flags
       */
      check(view: CoinView, flags?: script.common.flags): void;
      checkInput(
        index: number,
        coin: Coin | Output,
        flags?: script.common.flags
      ): void;
      checkAsync(
        view: CoinView,
        flags?: script.common.flags,
        pool?: WorkerPool
      ): Promise<void>;
      checkInputAsync(
        index: number,
        coin: Coin | Output,
        flags?: script.common.flags,
        pool?: WorkerPool
      ): Promise<void>;
      /**
       * Method starts from `verify` is almost same with the one with `check`
       * Only difference is that it wont throw error.
       */
      verify(view: CoinView, flags?: script.common.flags): boolean;
      verifyInput(
        index: number,
        coin: Coin | Output,
        flags?: script.common.flags
      ): boolean;
      verifyAsync(
        view: CoinView,
        flags?: script.common.flags,
        pool?: WorkerPool
      ): Promise<boolean>;
      verifyInputAsync(
        index: number,
        coin: Coin | Output,
        flags?: script.common.flags,
        pool?: WorkerPool
      ): Promise<boolean>;
      isCoinbase(): boolean;
      isRBF(): boolean;
      getFee(view: CoinView): Amount;
      getInputValue(view: CoinView): Amount;
      getOutputValue(): Amount;
      getInputAddress(view: CoinView): Address[];
      getOutputAddresses(): Address[];
      getAddresses(view?: CoinView): Address[];
      getHashes(view: CoinView | null, enc?: 'hex'): Buffer[];
      hasCoins(view: CoinView): boolean;
      isFinal(height: number, time: number): boolean;
      verifyLocktime(index: number, predicate: number): boolean;
      verifySequence(index: number, predicate: number): boolean;
      private getLegacySigops(): number;
      private getScripthashSigops(view: CoinView): number;
      private getWitnessSigops(view: CoinView): number;
      private getSigopsCost(view: CoinView, flags: script.common.flags): number;
      public getSigops(view: CoinView, flags?: script.common.flags): number;
      /**
       * score will be 0 if it is valid
       * it will be 10 if `input.prevout` is null
       * otherwise 100
       * @retruns - 1. result, 2. reason why it's not sane, 3, score
       */
      public isSane(): [boolean, string, number];
      /**
       * Non-contextual checks to determine whether the transaction has all
       * standard output script types and standard input script size with only pushdatas
       * in the code.
       * Will mostly verify coin and output values.
       */
      public isStandard(): [boolean, string, number];
      /**
       * if p2sh, then check redeem script has small sigops enough
       * Otherwise, it will return true in we have coin and not unknown
       * @param view
       */
      public hasStandardInputs(view: CoinView): boolean;
      public hasStandardWitness(view: CoinView): boolean;
      /**
       * Perform contextual checks to verify input, output, and fee.
       * Difference to `verityInput` is that it is contextual.
       * Note this function is consensus critical
       * @param view
       * @param height
       */
      public verifyInputs(view: CoinView, height: number): boolean;
      /**
       * Perform contextual check of tx input
       * This function is consensus critical
       * e.g. Coinbase maturity, fee is not negative, etc.
       * @param view
       * @param height
       */
      public checkInputs(
        view: CoinView,
        height: number
      ): [number, string, number];
      /**
       * Calculate the modified size ot the transaction.
       * This is used in the mempool for calculating priority.
       * @param size
       */
      public getModifiedSize(size?: number): number;
      public getPriority(view: CoinView, height: number, size?: number): number;
      /**
       * Calculate the sum of the inputs on chain.
       * @param view
       */
      public getChainValue(view: CoinView): number;
      /**
       * Test if priority is hight enough.
       * Priority itself is historical thing, so likely
       * we don't have to bother with this method.
       * @param view
       * @param height
       * @param size
       */
      public isFree(view: CoinView, height?: number, size?: number): boolean;
      /**
       * Calculate minimum fee in order for the transaction to be relayable.
       * @param size
       * @param rate
       */
      public getMinFee(size?: number, rate?: Rate): Amount;
      /**
       * Almost exactly same with the `getMinFee`,
       * But it will round the result to the nearest kilobyte.
       * @param size
       * @param rate
       */
      public getRoundFee(size?: number, rate?: Rate): Amount;
      /**
       * Calculate the transaction's fee rate.
       * @param view
       * @param size
       */
      public getRate(view: CoinView, size?: number): Rate;
      /**
       * get all previous outpoint hashes (i.e. txid)
       */
      public getPrevout(): Buffer[];
      /**
       * Test this transaction is included in the filter.
       * This will update the filter according to `filter.update` field
       * @param filter
       */
      public isWatched(filter: BloomFilter): boolean;
      /**
       * Same with txid
       */
      public rhash(): Buffer;
      /**
       * Witness hash in little endian.
       */
      public rwhash(): Buffer;
      public txid(): Buffer;
      public toInv(): InvItem;
      /**
       * Same with `this.format()`.
       */
      public inspect(): TXFormat;
      public format(
        view?: CoinView,
        entry?: ChainEntry,
        index?: number
      ): TXFormat;
      /**
       * Same with `getJSON()`
       */
      public toJSON(): TXJsonResult;
      public getJSON(): TXJsonResult;
      private fromJSON(json: TXJson): TX;
      static fromJSON(json: TXJson): TX;
      /**
       * Automatically detects if it is witness serialization or not.
       */
      static fromRaw(data: Buffer | string, enc?: 'hex'): TX;
      /**
       * Automatically detects if it is witness serialization or not.
       */
      static fromReader(br: BufferReader): TX;
      static isTX(obj: object): boolean;

      /**
       * To avoid compile error in MTX
       */
    }

    class RawTX {
      data: null | Buffer;
      size: number;
      witness: number;
    }
    export interface TXOption {
      version?: number;
      input?: number;
      outputs?: Output[];
      locktime?: number;
    }
    /**
     * result Object of tx.inspect()
     */
    export interface TXFormat {
      hash: Buffer; // txid
      witnessHash: Buffer;
      size: number;
      virtualSize: number;
      value: Amount;
      // ----- these  exists only when CoinView is present.
      fee?: Amount;
      rate?: Amount;
      // ----------

      minFee: Amount;
      // ----- these exists only when ChainEntry is present.
      height?: number;
      block?: Buffer; // block hash
      time?: number;
      date?: number;
      // -----------
      index: number;
      version: number;
      inputs: InputJson[];
      outputs: Output[];
      locktime: number;
    }
    /**
     * result of tx.toJSON()
     */
    export type TXJsonResult = {
      hash: Buffer;
      witnessHash: Buffer;
      fee?: Amount;
      rate?: Amount;
      mtime: number; // returns now
      height?: number;
      block?: Buffer;
      time?: number;
      date?: number;
      hex: string;
    } & TXJson;
    /** value required for TX.fromJSON() */
    export interface TXJson {
      version: number;
      inputs: InputJson[];
      outputs: OutputJson[];
      locktime: number;
    }
  }

  export class Address extends primitives.Address {}
  export class Block extends primitives.Block {}
  export class Coin extends primitives.Coin {}
  export class Headers extends primitives.Headers {}
  export class Input extends primitives.Input {}
  export class InvItem extends primitives.InvItem {}
  export class KeyRing extends primitives.KeyRing {}
  export class MerkleBlock extends primitives.MerkleBlock {}
  export class MTX extends primitives.MTX {}
  export class Outpoint extends primitives.Outpoint {}
  export class Output extends primitives.Output {}
  export class TX extends primitives.TX {}
}
