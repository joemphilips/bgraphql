// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bcoin
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>
declare module 'bcoin' {
  import { BloomFilter } from 'bfilter';
  import { BufferWriter, BufferReader } from 'bufio';

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

      export enum hashType {
        ALL = 1,
        NONE = 2,
        SINGLE = 3,
        ANYONECANPAY = 0x08
      }

      export type hashTypeByVal = {
        1: 'ALL';
        2: 'NONE';
        3: 'SINGLE';
        0x80: 'ANYONECANPAY';
      };

      /**
       * output script types
       */
      export enum types {
        NONSTANDARD = 0,
        PUBKEY = 1,
        PUBKEYHASH = 2,
        SCRIPTHASH = 3,
        MULTISIG = 4,
        NULLDATA = 5,
        WITNESSMALFORMED = 0x80,
        WITNESSSCRIPTHASH = 0x81,
        WITNESSPUBKEYHASH = 0x82
      }

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

      export type typesByValLower =
        | 'nonstandard'
        | 'pubkey'
        | 'pubkeyhash'
        | 'scripthash'
        | 'multisig'
        | 'nulldata'
        | 'witnessmalformed'
        | 'witnessscripthash'
        | 'witnesspubkeyhash';

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

    /**
     * Witness Program
     */
    export class Program {
      version: number;
      data: Buffer;
      constructor(version: number, data: Buffer);
      getType(): common.types;
      isUnknown(): boolean;
      isMalformed(): boolean;
      inspect(): string;
    }

    export class Script {
      static opcodes: common.opcodes;
      static opcodesByVal: common.opcodesByVal;
      static flags: common.flags;
      static hashType: common.hashType;
      static hashTypeByVal: common.hashTypeByVal;
      static types: common.types;
      static typesByVal: common.typesByVal;
      raw: Buffer;
      code: Opcode[];
      length: number;
      constructor(
        options?: Buffer | Opcode[] | { code: Opcode[]; [key: string]: any }
      );
      static fromOptions(options: { code: Opcode[]; [key: string]: any });
      values(): Iterator<Opcode>;
      entries(): Iterator<[number, Opcode]>;
      toArray(): Array<Opcode>;
      fromArray(code: Opcode[]): Script;
      static fromArray(code: Opcode[]): Script;

      /**
       * Convert script to stack items
       */
      toItems(): Buffer[];
      private fromItems(buffer: Buffer[]): Script;
      static fromItems(items: Buffer[]): Script;
      toStack(): Stack;
      private fromStack(): Script;
      static fromStack(stack: Stack): Script;
      public clone(): Script;
      private inject(script: Script): Script;
      public equals(script: Script): boolean;
      compare(script: Script): number;
      clear(): Script;
      inspect(): string;
      private toString(): string;
      /**
       * Format the script as bitcoind asm
       * @param decode - try to decode hash types
       */
      toASM(decode?: boolean): string;

      /**
       * Re-encode the script internally.
       * Useful if you changed something manually in the `code` array.
       */
      compile(): Script;
      toWriter(bw: BufferWriter): BufferWriter;
      toRaw(): Buffer | string;
      toJSON(): string;
      static fromJSON(json: string): Script;
      getSubscript(index: number): Script;
      removeSeparators(): Script;

      /**
       * Throws `ScriptError` when it failed to excute
       * @param stack - Script execution stack
       * @param flags - defaults to `STANDARD_VERIFY_FLAGS`
       * @param tx - tx to verify
       * @param index - input index
       * @param value - Previous output value
       * @param version - Sighash Version (0=legacy, 1=segwit)
       */
      public execute(
        stack: Stack,
        flags?: common.flags,
        tx?: TX,
        index?: number,
        value?: Amount,
        version?: 0 | 1
      ): void;
      private findAndDelete(data: Buffer): number;
      private indexOf(data: Buffer): number;
      public isCode(): boolean;
      static fromPubKey(key: Buffer): Script;
      static fromPubkeyhash(hash: Buffer): Script;
      static fromMultisig(m: number, n: number, keys: Buffer[]): Script;
      static fromNulldata(flags: Buffer): Script;
      static fromProgram(version: number, data: Buffer): Script;
      static fromAddress(address: Address | string): Script;
      static fromCommitment(hash: Buffer, flags: string | Buffer): null;
      getRedeem(): Script | null;
      getType(): common.types;
      isUnknown(): boolean;
      isStandard(): boolean;
      getSize(): number;
      getInputAddress(): Address | null;
      getAddress(): Address | null;
      hash160(enc?: string): Buffer;
      sha256(enc?: string): Buffer;

      // ----- methods to test against output script (scriptPubKey)
      /**
       * Test whter the output script is pay-to-pubkey
       * @param minimal
       */
      isPubkey(minimal?: boolean): boolean;
      getPubkey(minimal?: boolean): Buffer | null;
      isPubkeyhash(minimal?: boolean): boolean;
      getPubkeyhash(minimal?: boolean): Buffer | null;
      isMultisig(minimal?: boolean): boolean;
      getMultisig(minimal?: boolean): [number, number];
      isScripthash(): boolean;
      getScripthash(): Buffer | null;
      isNulldata(): boolean;
      getNulldata(): Buffer | null;
      isCommitment(): boolean;
      getCommitment(): Buffer | null;
      isProgram(): boolean;
      getProgram(): Program | null;
      // -------------------------------------------------------

      public forWitness(): Script | null;
      public isWitnessPubkeyhash(): boolean;
      public isWitnessScripthash(): boolean;
      public getWitnessScripthash(): Buffer | null;
      public isUnspendable(): boolean;
      /**
       * guess the type of the input script
       */
      public getInputtype(): common.flags;
      /**
       * Guess whter the input script is an unknown type
       */
      public getInputtype(): boolean;
      public isPubkeyInput(): boolean;
      public getPubkeynput(): Buffer | null;
      public isPubkeyhashInput(): boolean;
      public getPubkeyhashInput(): [Buffer, Buffer] | [null, null];
      public isMultisigInput(): boolean;
      public getMultisigInput(): Buffer[] | null;
      public isScripthashInput(): boolean;
      getCoinbaseHeight(): number;
      static getCoinbaseHeight(raw: Buffer): number;
      test(filter: BloomFilter): boolean;
      public isPushOnly(): boolean;
      getSigops(accurate?: boolean): number;
      private getScripthashSigops(input?: Script): number;
      private getWitnessSigops(input?: Script): number;

      // ----- script mutation ------
      private get(index: number): Opcode | null;
      private pop(): Opcode | null;
      private shift(): Opcode | null;
      private remove(index: number): null;
      private set(index: number, op: Opcode): Script;
      private push(op: Opcode): Script;
      private unshift(op: Opcode): Script;
      private insert(index: number, op: Opcode): Script;

      // methods for mutating with Opcode
      getOp(index: number): Opcode | null;
      popOp(): Opcode | null;
      shiftOp(): Opcode | null;
      removeOp(index: number): null;
      setOp(index: number, op: Opcode): Script;
      pushOp(op: Opcode): Script;
      unshiftOp(op: Opcode): Script;
      insertOp(index: number, op: Opcode): Script;

      // methods for mutating with Buffer
      getData(index: number): Buffer | null;
      popData(): Buffer | null;
      shiftData(): Buffer | null;
      removeData(index: number): null;
      setData(index: number, op: Buffer): Script;
      pushData(op: Buffer): Script;
      unshiftData(op: Buffer): Script;
      insertData(index: number, op: Buffer): Script;

      // methods for mutating with Push data.
      // Pretty much similar to modifying with data.
      // But only works for pushdata opcode
      getPush(index: number): Buffer | null;
      popPush(): Buffer | null;
      shiftPush(): Buffer | null;
      removePush(index: number): null;
      setPush(index: number, op: Buffer): Script;
      pushPush(op: Buffer): Script;
      unshiftPush(op: Buffer): Script;
      insertPush(index: number, op: Buffer): Script;

      getString(index: number, enc?: string): string | null;
      popString(enc?: string): string | null;
      shiftString(enc?: string): string | null;
      removeString(enc?: string): string | null;
      setString(index: number, op: string): Script;
      pushString(op: string): Script;
      unshiftString(op: string): Script;
      insertString(index: number, op: string): Script;

      getNum(index: number): number | null;
      popNum(): number | null;
      shiftNum(): number | null;
      removeNum(index: number): null;
      setNum(index: number, op: number): Script;
      pushNum(op: number): Script;
      unshiftNum(op: number): Script;
      insertNum(index: number, op: number): Script;

      getInt(index: number): number | null;
      popInt(): number | null;
      shiftInt(): number | null;
      removeInt(index: number): null;
      setInt(index: number, op: number): Script;
      pushInt(op: number): Script;
      unshiftInt(op: number): Script;
      insertInt(index: number, op: number): Script;

      getBool(index: number): boolean;
      popBool(): boolean;
      shiftBool(): boolean;
      removeBool(index: number): boolean;
      setBool(index: number, op: boolean): Script;
      pushBool(op: boolean): Script;
      unshiftBool(op: boolean): Script;
      insertBool(index: number, op: boolean): Script;
      // ----------------------------

      getLength(index: number): number;
      private fromString(code: string): Script;
      static fromString(code: string): Script;
      /**
       * Used from TX.checkInput
       */
      static verify(
        input: Script,
        witness?: Witness,
        output?: Script,
        tx?: TX,
        index?: number,
        value?: Amount,
        flags?: common.flags
      ): void;
      private static verifyProgram(): void;
      static fromReader(br: BufferReader): Script;
      static fromRaw(data: Buffer | string, enc?: string): Script;
      static isScript(obj: object): boolean;
    }

    export class ScriptError extends Error {}

    export class ScriptNum {}

    export class SigCache {}

    export class Stack {}

    export class Witness {
      items: Buffer[];
      constructor(options?: Buffer[] | { items: Buffer[] });
      static fromOptions(options: Buffer[] | { items: Buffer[] });
      toArray(): Buffer[];
      fromArray(): Buffer[];
      static fromArray(): Buffer[];
      toItems(): Buffer[];
      private fromItems(items: Buffer[]);
      static fromItems(items: Buffer[]): Witness;
      toStack(): Stack;
      static fromStack(stack: Stack): Witness;
      inspect(): string;
      clone(): Witness;
      getInputType(): common.types;
      getInputAddress(): Address | null;
      isPubkeyInput(): false;
      getPUbkeyInput(): null;
      test(filter: BloomFilter): boolean;
      getRedeem(): Script;
      indexOf(data: Buffer): number;
      getSize(): number;
      getVarSize(): number;
      private toWriter(bw: BufferWriter): number;
      toRaw(): Buffer | String;
      /**
       * returns hex string
       */
      toJSON(): string;
      /**
       *
       * @param json - hex string
       */
      static fromJSON(json: string): Witness;
      static fromRaw(data: Buffer | string, enc?: 'hex' | 'null'): Witness;
      /**
       * This method must contain only stack items.
       * use `fromJSON` if you want to instantiate from whole witness
       * including push opcodes
       * @param items
       */
      static fromString(items: string | string[]): Witness;
      static isWitness(): boolean;
    }
  }

  export class Opcode extends script.Opcode {}

  export class Program extends script.Program {}

  export class Script extends script.Script {}
  export class ScriptNum extends script.ScriptNum {}

  export class sigcache extends script.SigCache {}
  export class Stack extends script.Stack {}
  export class Witness extends script.Witness {}
}
