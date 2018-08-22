declare module 'bfilter' {
  import { Struct, BufferWriter, BufferReader, IStruct } from 'bufio';
  export class BloomFilter extends Struct {
    [key: string]: any;
    getSize(extra: any): number;
    write(bw: BufferWriter, extra: any): BufferWriter;
    read(br: BufferReader, extra: any): IStruct;
    fromString(str: string, extra: any);
    getJSON(): object;
    fromJSON(json: object, extra: any): IStruct;
    fromOptions(options: object, extra: any): IStruct;
  }

  export class RollingFilter {
    private entries: number;
    private generation: number;
    private n: number;
    private limit: number;
    private size: number;
    private items: number;
    private tweak: number;
    private filter: Buffer;
    /**
     * @param items - Expected number of items
     * @param rate - false positive rate
     */
    constructor(items: number | null, rate: number);
    private fromRate(items: number, rate: number): RollingFilter;
    static fromRate(items: number, rate: number): RollingFilter;
    /**
     * Perform murmur3 hash on data.
     * @param value
     * @param n
     */
    public hash(value: Buffer, n: number): Number;
    public reset(): void;
    public add(value: Buffer | string, enc?: string): void;
    public test(value: Buffer | string, enc?: string): boolean;
  }
}
