declare module 'buffer-map' {
  export class BufferMap<T = any> extends Map<Buffer, T> {}
  export class BufferSet<T = any> extends Set<T> {}
}
