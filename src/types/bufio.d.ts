// Type definitions for bufio 1.0.1
// Project: https://github.com/bcoin-org/bufio
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'bufio' {
  export class BufferReader {
    constructor(data: Buffer, zeroCopy?: boolean);
    /**
     * check if `size` is still available.
     * @param size
     */
    check(size: number);
    getSize(): number;
    left(): number;
    /**
     *
     * @param off - Offset (positive or negative)
     */
    seek(off: number);
    /**
     * Mark the current starting position
     */
    start(): number;

    /**
     * Stop reading. Pop the start position off the stack,
     * Calculate an return the size of the data read. */
    end(): number;

    /**
     * Stop reading. pop the start position and returns the data.
     * @param zeroCopy - perform a fast buffer slice instead of
     * allocating a new buffer
     */
    endData(zeroCopy?: boolean): Buffer;
    destroy();

    readU8(): number;
    readU16(): number;
    readU16BE(): number;
    readU32(): number;
    readU32BE(): number;
    readU64(): number;
    readU64BE(): number;
    readI8(): number;
    readI16(): number;
    readI16BE(): number;
    readI32(): number;
    readI32BE(): number;
    readI64(): number;
    readI64BE(): number;
    readFloat(): number;
    readFloatBE(): number;
    readDouble(): number;
    readDoubleBE(): number;
    readVarint(): number;
    readVarint2(): number;
    readBytes(size: number, zeroCopy?: boolean): Buffer;
    readVarBytes(zeroCopy?: boolean): Buffer;
    /**
     * Slice N bytes and create a child reader
     * @param size
     */
    readChild(size): BufferReader;
    /**
     * read a string
     * @param enc - A buffer supported encoding
     * @param size
     */
    readString(size: number, enc: string): String;
    /**
     * read a 32 byte hash (not 20)
     * @param enc
     */
    readHash(enc: 'hex' | null): Buffer;
    readVarString(enc: string, limit?: number): String;
    readNullString(enc: string): string;

    createChecksum(hash: HashFunction): number;
    verifyChecksum(hash: HashFunction): number;
  }
  export class BufferWriter {
    constructor(data: Buffer, zeroCopy?: boolean);
    static pool(size: number);
    /** allocate and render the final buffer */
    render(): Buffer;
    getSize(): number;
    seek(offset): BufferWriter;
    destroy(): BufferWriter;
    writeU8(value: number): BufferWriter;
    writeU16(value: number): BufferWriter;
    writeU16BE(value: number): BufferWriter;
    writeU32(value: number): BufferWriter;
    writeU32BE(value: number): BufferWriter;
    writeU64(value: number): BufferWriter;
    writeU64BE(value: number): BufferWriter;
    writeI8(value: number): BufferWriter;
    writeI16(value: number): BufferWriter;
    writeI16BE(value: number): BufferWriter;
    writeI32(value: number): BufferWriter;
    writeI32BE(value: number): BufferWriter;
    writeI64(value: number): BufferWriter;
    writeI64BE(value: number): BufferWriter;
    writeFloat(value: number): BufferWriter;
    writeFloatBE(value: number): BufferWriter;
    writeDouble(value: number): BufferWriter;
    writeDoubleBE(value: number): BufferWriter;
    writeVarint(value: number): BufferWriter;
    writeVarint2(value: number): BufferWriter;
    writeBytes(value: number): BufferWriter;
    writeVarBytes(value: number): BufferWriter;
    copy(value: Buffer, start: number, end: number): BufferWriter;
    writeString(value: string, end?: string): BufferWriter;
    /**
     * Write a 32 bytes hash (not 20 byte)
     * @param value
     */
    writeHash(value: string): BufferWriter;
    /**
     * Write a string with a varint length before it.
     * @param value
     * @param enc
     */
    writeVarString(value: string, enc?: string): BufferWriter;
    writeNullString(value: string | Buffer, enc?: string): BufferWriter;
    writeChecksum(hash: HashFunction): BufferWriter;
    /**
     * fill N bytes with size
     * @param value
     * @param size
     */
    fill(value: number | string, size: number): BufferWriter;
  }

  export class StaticWriter {
    constructor(options: Buffer | number);
    static pool(size: number);
    /** allocate and render the final buffer */
    render(): Buffer;
    slice(): Buffer;
    getSize(): number;
    check(size: number): void;
    writeU8(value: number): StaticWriter;
    writeU16(value: number): StaticWriter;
    writeU16BE(value: number): StaticWriter;
    writeU32(value: number): StaticWriter;
    writeU32BE(value: number): StaticWriter;
    writeU64(value: number): StaticWriter;
    writeU64BE(value: number): StaticWriter;
    writeI8(value: number): StaticWriter;
    writeI16(value: number): StaticWriter;
    writeI16BE(value: number): StaticWriter;
    writeI32(value: number): StaticWriter;
    writeI32BE(value: number): StaticWriter;
    writeI64(value: number): StaticWriter;
    writeI64BE(value: number): StaticWriter;
    writeFloat(value: number): StaticWriter;
    writeFloatBE(value: number): StaticWriter;
    writeDouble(value: number): StaticWriter;
    writeDoubleBE(value: number): StaticWriter;
    writeVarint(value: number): StaticWriter;
    writeVarint2(value: number): StaticWriter;
    writeBytes(value: number): StaticWriter;
    writeVarBytes(value: number): StaticWriter;
    copy(value: Buffer, start: number, end: number): StaticWriter;
    writeString(value: string, end?: string): StaticWriter;
    /**
     * Write a 32 bytes hash (not 20 byte)
     * @param value
     */
    writeHash(value: string): StaticWriter;
    /**
     * Write a string with a varint length before it.
     * @param value
     * @param enc
     */
    writeVarString(value: string, enc?: string): StaticWriter;
    writeNullString(value: string | Buffer, enc?: string): StaticWriter;
    writeChecksum(hash: HashFunction): StaticWriter;
    /**
     * fill N bytes with size
     * @param value
     * @param size
     */
    fill(value: number | string, size: number): StaticWriter;
  }

  export type HashFunction = (Buffer) => Buffer;

  export interface IStruct {
    inject(obj: IStruct);
    clone(): IStruct;
    getSize(extra: any);
    write(bw: BufferWriter, extra: any): BufferWriter;
    read(br: BufferReader, extra: any): IStruct;
    toString(): string;
    fromString(str: string, extra: any);
    getJSON(): object;
    fromJSON(json: object, extra): IStruct;
    fromOptions(options: object, extra: any): IStruct;
    fromOptions(options: object, extra: any): IStruct;
    from(options: any, extra: any): IStruct;
    format(): object;
  }

  export abstract class Struct implements IStruct {
    constructor();
    /**
     * Inject another Struct.
     * requires to implement `encode` and `decode`
     * @param obj
     */
    inject(obj: IStruct);
    /**
     * clone the object
     * requires to implement `inject`
     */
    clone(): IStruct;
    abstract getSize(extra: any): number;
    abstract write(bw: BufferWriter, extra: any): BufferWriter;
    abstract read(br: BufferReader, extra: any): IStruct;
    toString(): string;
    abstract fromString(str: string, extra: any);
    abstract getJSON(): object;
    abstract fromJSON(json: object, extra: any): IStruct;
    abstract fromOptions(options: object, extra: any): IStruct;
    static fromOptions(options: object, extra: any): IStruct;
    from(options: any, extra: any): IStruct;
    format(): object;
    encode(extra: any): Buffer;
    decode(data: Buffer, extra: any): IStruct;
    toHex(extra: any): string;
    fromHex(str: string, extra): IStruct;
    toBase64(extra: any): string;
    fromBase64(str: string, extra: string): IStruct;
    toJSON(): object;
    static read(br: BufferReader, extra: any): IStruct;
    static decode(data: Buffer, extra: any): IStruct;
    static fromHex(str: string, extra: any): IStruct;
    static fromBase64(str: string, extra: any): IStruct;
    static fromString(str: string, extra: any): IStruct;
    static fromJSON(json: object, extra: any): IStruct;
    static fromOptions(options: object, extra: any): IStruct;
    static from(options: any, extra: any): IStruct;
    toWriter(bw: BufferWriter, extra): IStruct;
    fromReader(br: BufferReader, extra: any): IStruct;
    toRaw(extra: any): Buffer;
    fromRaw(data: Buffer, extra: any): IStruct;
    static fromReader(br: BufferReader, extra: any): IStruct;
    static fromRaw(data: Buffer, extra: any): IStruct;
  }

  export type Writer = StaticWriter | BufferWriter;
  export function read(data: Buffer, zeroCopy?: boolean): BufferReader;
  export function write(size: number): StaticWriter;
  export function write(): BufferWriter;
  export function pool(size: number): StaticWriter;

  export namespace encoding {
    function concat(a: any, b: any): any;

    function copy(data: any): any;

    function readBytes(data: any, off: any, size: any): any;

    function readDouble(data: any, off: any): any;

    function readDoubleBE(data: any, off: any): any;

    function readFloat(data: any, off: any): any;

    function readFloatBE(data: any, off: any): any;

    function readI(data: any, off: any, len: any): any;

    function readI16(data: any, off: any): any;

    function readI16BE(data: any, off: any): any;

    function readI24(data: any, off: any): any;

    function readI24BE(data: any, off: any): any;

    function readI32(data: any, off: any): any;

    function readI32BE(data: any, off: any): any;

    function readI40(data: any, off: any): any;

    function readI40BE(data: any, off: any): any;

    function readI48(data: any, off: any): any;

    function readI48BE(data: any, off: any): any;

    function readI56(data: any, off: any): any;

    function readI56BE(data: any, off: any): any;

    function readI64(data: any, off: any): any;

    function readI64BE(data: any, off: any): any;

    function readI8(data: any, off: any): any;

    function readIBE(data: any, off: any, len: any): any;

    function readString(data: any, off: any, size: any, enc: any): any;

    function readU(data: any, off: any, len: any): any;

    function readU16(data: any, off: any): any;

    function readU16BE(data: any, off: any): any;

    function readU24(data: any, off: any): any;

    function readU24BE(data: any, off: any): any;

    function readU32(data: any, off: any): any;

    function readU32BE(data: any, off: any): any;

    function readU40(data: any, off: any): any;

    function readU40BE(data: any, off: any): any;

    function readU48(data: any, off: any): any;

    function readU48BE(data: any, off: any): any;

    function readU56(data: any, off: any): any;

    function readU56BE(data: any, off: any): any;

    function readU64(data: any, off: any): any;

    function readU64BE(data: any, off: any): any;

    function readU8(data: any, off: any): any;

    function readUBE(data: any, off: any, len: any): any;

    function readVarint(data: any, off: any): any;

    function readVarint2(data: any, off: any): any;

    function realloc(data: any, size: any): any;

    function sizeVarBytes(data: any): any;

    function sizeVarString(str: any, enc: any): any;

    function sizeVarint(num: any): any;

    function sizeVarint2(num: any): any;

    function sizeVarlen(len: any): any;

    function sliceBytes(data: any, off: any, size: any): any;

    function writeBytes(data: any, value: any, off: any): any;

    function writeDouble(dst: any, num: any, off: any): any;

    function writeDoubleBE(dst: any, num: any, off: any): any;

    function writeFloat(dst: any, num: any, off: any): any;

    function writeFloatBE(dst: any, num: any, off: any): any;

    function writeI(dst: any, num: any, off: any, len: any): any;

    function writeI16(dst: any, num: any, off: any): any;

    function writeI16BE(dst: any, num: any, off: any): any;

    function writeI24(dst: any, num: any, off: any): any;

    function writeI24BE(dst: any, num: any, off: any): any;

    function writeI32(dst: any, num: any, off: any): any;

    function writeI32BE(dst: any, num: any, off: any): any;

    function writeI40(dst: any, num: any, off: any): any;

    function writeI40BE(dst: any, num: any, off: any): any;

    function writeI48(dst: any, num: any, off: any): any;

    function writeI48BE(dst: any, num: any, off: any): any;

    function writeI56(dst: any, num: any, off: any): any;

    function writeI56BE(dst: any, num: any, off: any): any;

    function writeI64(dst: any, num: any, off: any): any;

    function writeI64BE(dst: any, num: any, off: any): any;

    function writeI8(dst: any, num: any, off: any): any;

    function writeIBE(dst: any, num: any, off: any, len: any): any;

    function writeString(data: any, str: any, off: any, enc: any): any;

    function writeU(dst: any, num: any, off: any, len: any): any;

    function writeU16(dst: any, num: any, off: any): any;

    function writeU16BE(dst: any, num: any, off: any): any;

    function writeU24(dst: any, num: any, off: any): any;

    function writeU24BE(dst: any, num: any, off: any): any;

    function writeU32(dst: any, num: any, off: any): any;

    function writeU32BE(dst: any, num: any, off: any): any;

    function writeU40(dst: any, num: any, off: any): any;

    function writeU40BE(dst: any, num: any, off: any): any;

    function writeU48(dst: any, num: any, off: any): any;

    function writeU48BE(dst: any, num: any, off: any): any;

    function writeU56(dst: any, num: any, off: any): any;

    function writeU56BE(dst: any, num: any, off: any): any;

    function writeU64(dst: any, num: any, off: any): any;

    function writeU64BE(dst: any, num: any, off: any): any;

    function writeU8(dst: any, num: any, off: any): any;

    function writeUBE(dst: any, num: any, off: any, len: any): any;

    function writeVarint(dst: any, num: any, off: any): any;

    function writeVarint2(dst: any, num: any, off: any): any;
  }
  function concat(a: any, b: any): any;

  function copy(data: any): any;

  function readBytes(data: any, off: any, size: any): any;

  function readDouble(data: any, off: any): any;

  function readDoubleBE(data: any, off: any): any;

  function readFloat(data: any, off: any): any;

  function readFloatBE(data: any, off: any): any;

  function readI(data: any, off: any, len: any): any;

  function readI16(data: any, off: any): any;

  function readI16BE(data: any, off: any): any;

  function readI24(data: any, off: any): any;

  function readI24BE(data: any, off: any): any;

  function readI32(data: any, off: any): any;

  function readI32BE(data: any, off: any): any;

  function readI40(data: any, off: any): any;

  function readI40BE(data: any, off: any): any;

  function readI48(data: any, off: any): any;

  function readI48BE(data: any, off: any): any;

  function readI56(data: any, off: any): any;

  function readI56BE(data: any, off: any): any;

  function readI64(data: any, off: any): any;

  function readI64BE(data: any, off: any): any;

  function readI8(data: any, off: any): any;

  function readIBE(data: any, off: any, len: any): any;

  function readString(data: any, off: any, size: any, enc: any): any;

  function readU(data: any, off: any, len: any): any;

  function readU16(data: any, off: any): any;

  function readU16BE(data: any, off: any): any;

  function readU24(data: any, off: any): any;

  function readU24BE(data: any, off: any): any;

  function readU32(data: any, off: any): any;

  function readU32BE(data: any, off: any): any;

  function readU40(data: any, off: any): any;

  function readU40BE(data: any, off: any): any;

  function readU48(data: any, off: any): any;

  function readU48BE(data: any, off: any): any;

  function readU56(data: any, off: any): any;

  function readU56BE(data: any, off: any): any;

  function readU64(data: any, off: any): any;

  function readU64BE(data: any, off: any): any;

  function readU8(data: any, off: any): any;

  function readUBE(data: any, off: any, len: any): any;

  function readVarint(data: any, off: any): any;

  function readVarint2(data: any, off: any): any;

  function realloc(data: any, size: any): any;

  function sizeVarBytes(data: any): any;

  function sizeVarString(str: any, enc: any): any;

  function sizeVarint(num: any): any;

  function sizeVarint2(num: any): any;

  function sizeVarlen(len: any): any;

  function sliceBytes(data: any, off: any, size: any): any;

  function writeBytes(data: any, value: any, off: any): any;

  function writeDouble(dst: any, num: any, off: any): any;

  function writeDoubleBE(dst: any, num: any, off: any): any;

  function writeFloat(dst: any, num: any, off: any): any;

  function writeFloatBE(dst: any, num: any, off: any): any;

  function writeI(dst: any, num: any, off: any, len: any): any;

  function writeI16(dst: any, num: any, off: any): any;

  function writeI16BE(dst: any, num: any, off: any): any;

  function writeI24(dst: any, num: any, off: any): any;

  function writeI24BE(dst: any, num: any, off: any): any;

  function writeI32(dst: any, num: any, off: any): any;

  function writeI32BE(dst: any, num: any, off: any): any;

  function writeI40(dst: any, num: any, off: any): any;

  function writeI40BE(dst: any, num: any, off: any): any;

  function writeI48(dst: any, num: any, off: any): any;

  function writeI48BE(dst: any, num: any, off: any): any;

  function writeI56(dst: any, num: any, off: any): any;

  function writeI56BE(dst: any, num: any, off: any): any;

  function writeI64(dst: any, num: any, off: any): any;

  function writeI64BE(dst: any, num: any, off: any): any;

  function writeI8(dst: any, num: any, off: any): any;

  function writeIBE(dst: any, num: any, off: any, len: any): any;

  function writeString(data: any, str: any, off: any, enc: any): any;

  function writeU(dst: any, num: any, off: any, len: any): any;

  function writeU16(dst: any, num: any, off: any): any;

  function writeU16BE(dst: any, num: any, off: any): any;

  function writeU24(dst: any, num: any, off: any): any;

  function writeU24BE(dst: any, num: any, off: any): any;

  function writeU32(dst: any, num: any, off: any): any;

  function writeU32BE(dst: any, num: any, off: any): any;

  function writeU40(dst: any, num: any, off: any): any;

  function writeU40BE(dst: any, num: any, off: any): any;

  function writeU48(dst: any, num: any, off: any): any;

  function writeU48BE(dst: any, num: any, off: any): any;

  function writeU56(dst: any, num: any, off: any): any;

  function writeU56BE(dst: any, num: any, off: any): any;

  function writeU64(dst: any, num: any, off: any): any;

  function writeU64BE(dst: any, num: any, off: any): any;

  function writeU8(dst: any, num: any, off: any): any;

  function writeUBE(dst: any, num: any, off: any, len: any): any;

  function writeVarint(dst: any, num: any, off: any): any;

  function writeVarint2(dst: any, num: any, off: any): any;
}
