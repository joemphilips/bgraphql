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
}
