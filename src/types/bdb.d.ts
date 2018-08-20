// Type definitions for bdb 0.2.3
// Project: https://github.com/bcoin-org/bdb
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'bdb' {
  export type KeyType = string | Buffer;
  export class Iterator {
    constructor(db: DB, options?: IteratorOptions, prefix?: Buffer);
    start(): void;
    bucket(prefix: Buffer): Iterator;
    root(): Iterator;
    child(prefix): Iterator;
    wrap(obj: Batch | Iterator): Bucket;
    cleanup(): void;
    each(db: Function): Promise<void>;
    next(): Promise<boolean>;
    private read(): Promise<void>;
    seek(key: Buffer): Iterator;
    end(): Promise<void>;
    range(): Promise<IteratorItem[]>;
    range(parse: Function): Promise<any[]>;
    keys(): Promise<Buffer[]>;
    keys(parse: Function): Promise<any[]>;
    values(): Promise<any[]>;
    values(parse: Function): Promise<any[]>;
  }

  export type IteratorOptions = Partial<{
    gte: Buffer;
    lte: Buffer;
    gt: Buffer;
    lt: Buffer;
    keys: boolean;
    values: boolean;
    fillCache: boolean;
    keyAsBuffer: boolean;
    valueAsBuffer: boolean;
    reverse: boolean;
    highWaterMark: number;
  }>;
  export interface IteratorItem {
    key: Buffer;
    value: Buffer;
  }
  export interface Batch {
    constructor(binding: object | Backend, prefix?: Buffer);
    bucket(prefix?: Buffer): Batch;
    root(): Batch;
    child(prefix?: Buffer): Batch;
    wrap(obj: Batch | Iterator): Batch;
    put(key: Buffer, value: Buffer): Batch;
    del(key: Buffer): Batch;
    /**
     * Write a batch to database.
     * Internally, it iterators this.ops (BatchOp)
     * and inserts or deletes those values from this.db
     */
    write(): Promise<void>;

    clear(): Promise<Batch>;
  }

  export interface DBOptions {
    createIfMissing: boolean;
    errorIfExists;
  }

  interface BatchOp {}

  export interface Backend {
    ops: Array<BatchOp>;
    search(key: KeyType): Buffer;
    open(options?: object, callback?: Function): void;
    close(callback?: Function): void;
    get(key: KeyType, options?: object, callback?: Function): void | Buffer;
    put(
      key: KeyType,
      value: Buffer,
      options?: object,
      callback?: Function
    ): void;
    del(key: KeyType, options?: object, callback?: Function);
    batch(ops?: object[], options?: object, callback?: Function);
    iterator(options: object): Iterator;
    getProperty(name): string;
    approximateSize(start: KeyType, end: KeyType, callback?: Function): void;
    /**
     * commit a batch
     * @param callback
     */
    write(callback: Function): Backend;
  }

  export class Bucket {
    constructor(db: DB, prefix: Buffer);
    /**
     *  return a new Bucket which holds a reference to the same db.
     * @param prefix
     */
    bucket(prefix: Buffer): Bucket;
    /**
     * return a root bucket.
     */
    root(): Bucket;
    /**
     * get a child bucket
     * @param prefix
     */
    child(prefix: Buffer): Bucket;
    wrap(obj: Batch | Iterator): Batch;
    has(key: Buffer): Promise<boolean>;
    get(key: Boolean): Promise<any>;
    iterator(options?: IteratorOptions): Iterator;
    range(options?: IteratorOptions): Promise<any[]>;
    keys(options?: IteratorOptions): Promise<Buffer[]>;
    values(options?: IteratorOptions): Promise<any[]>;
  }

  export class DB {
    private backend: Backend;
    /**
     * lower-level binding of the backend
     */
    private binding: Backend | object;
    private options: DBOptions;
    public loading: boolean;
    public closing: boolean;
    public loaded: boolean;
    public leveldown: boolean;
    constructor(
      backend: Backend,
      location: string,
      options?: Partial<DBOptions>
    );
    public open(): Promise<void>;
    public close(): Promise<void>;
    public repair(): Promise<void>;
    public backup(path): Promise<void>;
    /**
     * create new bucket
     * @param prefix
     */
    public bucket(prefix: Buffer): Bucket;
    /**
     * get a child bucket
     * @param prefix
     */
    public child(prefix: Buffer): Bucket;
    /**
     *
     * @param obj
     */
    public wrap(obj: { [key: string]: any; root: Function }): object;

    public get(key: Buffer): Promise<Buffer>;

    public put(key: Buffer, value: Buffer): Promise<void>;

    public del(key: Buffer): Promise<void>;

    public batch(): Batch;

    public iterator(options: object): Iterator;

    public getProperty(name: string): string;

    public approximateSize(start?: Buffer, end?: Buffer): Promise<number>;

    public compactRange(start?: Buffer, end?: Buffer): Promise<void>;

    public has(key: Buffer): Promise<boolean>;

    public keys(options?: IteratorOptions): Promise<Array<Buffer>>;

    public values(options?: IteratorOptions): Promise<Array<object>>;

    /**
     * dump database (for debugging)
     */
    public dump(): Promise<object>;

    public verify(key: Buffer, name: string, version: number): Promise<void>;

    public clone(path: string): Promise<DB>;

    public cloneTo(db: object): Promise<any>;
  }

  type ID = string | number;
  export class Key {
    constructor(id: ID, ops?: string[]);
    build(
      id?: Buffer,
      ...args: { getSize: Function; [key: string]: any }[] | null
    ): Buffer;
    parse(key: Key);
  }

  export function create(
    options?: Partial<
      {
        memory: boolean;
        location: string;
      } & DBOptions
    >
  ): DB;

  export function key(id?: string, args?: string[]): Key;
}
