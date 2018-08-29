// Type definitions for blru 1.0.2
// Project: https://github.com/bcoin-org/bweb
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'blru' {
  export default class LRU<T = any> {
    public map: Function | Map<string | number, T>;
    public size: number;
    public items: number;
    public head: null;
    public tail: null;
    public pending: null | LRUBatch;
    public capacity?: number;
    public getSize?: Function;
    constructor(capacity: number, getSize?: Function, customMap?: Map<any, T>);
    public reset(): void;
    set(key: string | number, value: object);
    get(key: string | number): object;
    has(key: string | number): boolean;
    remove(key: string | number): boolean;
    keys(): string[];
    values(): string[];
    toArray(): object[];

    // ------- batch related methods ------
    /**
     * Create new batch,
     * Usually used from `start()`
     */
    batch(): LRUBatch;
    /**
     * Start pending batch
     * sets this.pending
     */
    start(): void;
    clear(): void;
    drop(): LRUBatch;
    commit(): void;
    push(key: string, value: object): void;
    unpush(key: string): void;
  }

  class LRUBatch {}
  class LRUItem {}
}
