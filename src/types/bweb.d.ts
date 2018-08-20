// Type definitions for bweb 0.1.3
// Project: https://github.com/bcoin-org/bweb
// Definitions by: Joe Miyamoto <joemphilips@gmail.com>

// tslint:disable:no-method-signature

declare module 'bweb' {
  import { EventEmitter } from 'events';
  import { Wallet } from 'bcoin';
  import * as http from 'http';
  import * as https from 'https';
  import { Socket, Server as BsockServer } from 'bsock';

  export class Response extends EventEmitter {
    constructor(req, res);
    public setType(type: mimeType): Response;
    public setStatus(code: number): Response;
    public setLength(length: number): Response;
    public setHeader(key: string, value: string): Response;
    public setCookie(key: string, value: string, options: any): Response;
    public getHeader(key: string): Response;
    public redirect(code: number, path: string): Response;
    public redirect(path: string): Response;
    public text(code: number, msg?: string);
    public json(code: number, json?: object);
    public html(code: number, msg?: string);
    public sendFile(file: string);
  }

  export class Request extends EventEmitter {
    private req: any;
    private res: any;
    private trailing: boolean;
    private original: any | null;
    public socket: any;
    public method: string;
    public headers: object;
    public type: string;
    public pathname: string;
    /**
     * pathname after separated by "/"
     */
    public path: string[];
    public username: string | null;
    public query: object;
    public params: object;
    public body: object; // when use json middleware
    public cookies: object;
    public hasBody: boolean;
    public readable: boolean;
    public writable: boolean;
    public admin: boolean;
    public wallet: null | Wallet;
    constructor(req, res, url);
    public parse(url: string): void;
    /**
     * change `url`, `pathname`, `path`, `query` of this to `url`'s
     * @param url
     */
    public navigate(url: string): void;
    [key: string]: any;
  }

  export type RequestHandler = (
    req?: Request,
    res?: Response,
    next?: any
  ) => any;

  export type mimeType =
    | 'atom'
    | 'bin'
    | 'bmp'
    | 'css'
    | 'dat'
    | 'form'
    | 'gif'
    | 'gz'
    | 'htc'
    | 'html'
    | 'ico'
    | 'jpg'
    | 'jpeg'
    | 'log'
    | 'manifest'
    | 'mathml'
    | 'md'
    | 'mkv'
    | 'mml'
    | 'mp3'
    | 'mp4'
    | 'mpeg'
    | 'mpg'
    | 'oga'
    | 'ogg'
    | 'ogv'
    | 'otf'
    | 'pdf'
    | 'png'
    | 'rdf'
    | 'rss'
    | 'svg'
    | 'swf'
    | 'tar'
    | 'torrent'
    | 'txt'
    | 'ttf'
    | 'wav'
    | 'webm'
    | 'woff'
    | 'xhtml'
    | 'xbl'
    | 'xml'
    | 'xsl'
    | 'xslt'
    | 'zip';
  export abstract class Server extends EventEmitter {
    public options: { [key: string]: any };
    public config: ServerOptions;
    public http: http.Server | https.Server;
    public io: BsockServer;
    public rpc: RPC;
    public routes: Router;
    public mounted: boolean;
    public bound: boolean;
    public mounts: Array<Hook>;
    private stack: Array<Hook>;
    constructor(options?: ServerOptions);
    on(type: string, handler: Function);
    /**
     * Optional Abstract Method, it needs to be implemented only when
     * you want to handle a websocket.
     * @param socket
     */
    handleSocket(socket: Socket): void;
    /**
     * Optional Abstract Method. It needs to be implemented only when
     * you want to handle a websocket
     */
    handleCall(): void;
    open(): Promise<void>;
    close(): Promise<void>;
    /**
     * setup onError handler
     */
    error(handler: Function): void;

    /**
     *
     * @param path
     * @param server - child server to mount. push `Hook (path, server)` to `this.mounts`
     */
    private mount(path: string, server: Server): void;
    /**
     * Attach this to another server.
     * 1. bind `"error"` `"connection"` , and `"error"` events to this.
     * 2.
     * @param path - subpath to be attached
     * @param server - Parent server to attach
     */
    public attach(path: string, server: Server): void;
    public use(path: string, handler: RequestHandler): void;
    public use(handler: RequestHandler): void;
    public hook(path: string, handler: RequestHandler): void;
    public hook(handler: RequestHandler): void;

    // method handlers
    public get(path: string, handler: RequestHandler): void;
    public post(path: string, handler: RequestHandler): void;
    public put(path: string, handler: RequestHandler): void;
    public del(path: string, handler: RequestHandler): void;

    // websocket channel related methods
    /**
     *  get a websocket channel
     * @param name - channel name
     */
    public channel(name: string): any;
    public join(socket: object, name: string): any;
    /**
     * leave a channel
     * @param socket
     * @param name
     */
    public leave(socket: object, name: string): any;
    /**
     * emit event to channel
     * @param name - channel name
     * @param args
     */
    public to(name: string, ...args: any[]): void;
    /**
     * emit event to all sockets
     * @param args
     */
    public all(...args: any[]): void;

    /**
     * execute rpc call
     * @param json
     * @param help
     */
    execute(json: object, help: boolean): any;

    /**
     *  get server address
     */
    address(): string;

    // built-in-middlewares
    /**
     * returns Router middleware
     * @param routes - if not present, use this.routes (defaults to new Route())
     */
    router(routes?: Router): RequestHandler;
    cors(): RequestHandler;
    basicAuth(): RequestHandler;
    bodyParser(options?: BodyParserOptions): RequestHandler;
    jsonRPC(rpc: object): RequestHandler;
    /**
     * static file middleware
     * @param prefix
     */
    fileServer(prefix): RequestHandler;
    cookieParser(): RequestHandler;
  }

  export type BodyParserOptions = Partial<{
    keyLimit: number;
    bodyLimit: number;
    type: null | string;
    timeout: number;
  }>;

  export type ServerOptions = Partial<{
    host: string;
    port: number;
    ssl: boolean;
    keyFile: string;
    certFile: string;
    key: string;
    cert: string;
    ca: Array<any>;
    sockets: boolean;
  }>;

  class Hook {
    public path: string;
    public handler: Function;
    constructor(path: string, handler: RequestHandler);
    /**
     * if pathname is subpath of this.path, returns true
     * @param pathname
     */
    public isPrefix(pathname: string): boolean;
  }

  export function createServer(options?: ServerOptions): Server;
  export function server(options?: ServerOptions): Server;
  class Router {
    hooks: Hook[];
    handle(req: any, res: any): Promise<boolean>;
    hook(path: string, handler: RequestHandler): void;
    get(path: string, handler: RequestHandler): void;
    post(path: string, handler: RequestHandler): void;
    put(path: string, handler: RequestHandler): void;
    del(path: string, handler: RequestHandler): void;
  }
  export function router(): Router;
  export class RPC extends EventEmitter {
    [key: string]: any;
  }

  export function rpc(): RPC;
  export class RPCError extends Error {}
  /**
   * possible rpc errors. Follows JSON-RPC 2.0
   */
  export type errors = {
    INVALID_REQUEST: -32600;
    METHOD_NOT_FOUND: -32601;
    INVALID_PARAMS: -32602;
    INTERNAL_ERROR: -32603;
    PARSE_ERROR: -32700;
  };
  export interface middleware {
    basicAuth: any;
    bodyParser: any;
    cookieParser: any;
    cors: any;
    fileServer: any;
    jsonRPC: any;
    router: any;
  }
}
