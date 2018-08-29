declare module 'bcoin' {
  export namespace hd {
    export type HDKey = HDPrivateKey | HDPublicKey;
    type PrivateKeyJson = { xprivkey: string; [key: string]: any };
    type PublicKeyJson = { xpubkey: string; [key: string]: any };
    export function fromBase58(
      xkey: string,
      network?: Network | NetworkType
    ): HDKey;

    export function generate(): HDPrivateKey;

    export function fromSeed(options: Buffer): HDPrivateKey;
    export function fromMnemonic(options: Mnemonic): HDPrivateKey;
    export function fromJSON(json: PrivateKeyJson | PublicKeyJson): HDKey;
    export function fromRaw(
      data: Buffer,
      network?: Network | NetworkType
    ): HDKey;
    export function from(
      options: Mnemonic | MnemonicOptions | string | Buffer
    ): HDKey;

    export function isPrivate(obj: object): boolean;

    export function isPublic(obj: object): boolean;

    export type wordlist = ReadonlyArray<string>;
    export class HDPrivateKey {
      depth: number;
      parentFingerPrint: number;
      childIndex: number;
      chainCode: Buffer;
      privateKey: Buffer;
      publicKey: Buffer;
      fingerPrint: number;
      constructor(options?: PrivateKeyOption);
      fromSeed(seed: Buffer);
      static fromOptions(options: PrivateKeyOption): HDPrivateKey;
      toPublic(): HDPublicKey;
    }

    interface PrivateKeyOption {
      depth: number;
      parentFingerPrint: number;
      childIndex: number;
      chainCode: Buffer;
      privateKey: Buffer;
    }

    export class PrivateKey extends HDPrivateKey {}

    export class HDPublicKey {}

    export class PublicKey extends HDPublicKey {}

    export class Mnemonic {}

    export interface MnemonicOptions {
      bits: number;
      language: string;
      phrase: string;
      entropy: Buffer;
    }
  }

  export class HDPrivateKey extends hd.HDPrivateKey {}

  export class HDPublicKey extends hd.HDPublicKey {}

  export class Mnemonic extends hd.Mnemonic {}
}
