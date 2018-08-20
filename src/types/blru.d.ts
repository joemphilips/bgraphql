// Type definitions for blru 1.0.2
// Project: https://github.com/bcoin-org/bweb
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

declare module 'blru' {
  export default class LRU {
    constructor(capacity: number, getSize?: Function, customMap?: Function);
  }
}
