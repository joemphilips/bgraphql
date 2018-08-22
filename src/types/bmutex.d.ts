declare module 'bmutex' {
  export class Lock {
    constructor(named?: boolean, CustomMap?: Function);
    /**
     *
     * @param arg1 - Job name
     * @param arg2 - Bypass the lock.
     */
    lock(arg1?: string, arg2?: boolean);
  }
  export class MapLock {
    constructor(CustomMap?: Function, CustomSet?: Function);
    lock(key: string | number, force: boolean);
  }
}
