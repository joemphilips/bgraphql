declare module 'bevent' {
  import { EventEmitter } from 'events';
  /**
   * currently just extends EventEmitter. Might have its own type definition
   * in the future.
   */
  export default class AsyncEmitter extends EventEmitter {}
}
