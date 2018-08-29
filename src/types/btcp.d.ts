declare module 'btcp' {
  import net from 'net';
  export const unsupported: boolean;
  export type Socket = net.Socket;
  export class Server {}

  export type connect = Function;
  export type createSocket = Function;
  export type createServer = (handler?: Function) => Server;
}
