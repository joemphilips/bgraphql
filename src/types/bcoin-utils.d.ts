// Type definitions for bcoin 1.0.2
// Project: https://github.com/bcoin-org/bcoin
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>
declare module 'bcoin' {
  export namespace utils {
    export interface binary {
      /**
       * Perform binary search to an array and return the index of the item
       * @param items
       * @param key
       * @param compare
       * @param insert
       */
      search(
        items: any[],
        key: any,
        compare: Function,
        insert?: boolean
      ): number;
      /**
       * Perform binary insert to the sorted array
       * @param items
       * @param key
       * @param compare
       * @param insert
       */
      insert(items: any[], key: any, compare: Function, uniq?: boolean): number;
      remove(items: any[], key: any, compare: Function): number;
    }
    /**
     * functions to handle numbers safely without floating point arithmetic
     */
    export interface fixed {
      encode(num: number, exp: number): string;
      decode(str: string, exp: number): number;
      toFloat(num: number, exp: number): number;
      fromFloat(num: number, exp: number): number;
    }
    export interface util {
      bench(time: [number, number]): [number, number];
      now(): number;
      ms(): number;
      date(time?: number): string;
      time(date?: string): number;
      revHex(buf: Buffer): string;
      fromRev(str: string): Buffer;
    }
  }

  export type util = utils.util;
}
