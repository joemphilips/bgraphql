declare module 'blgr' {
  export type LogLevel =
    | 'none'
    | 'error'
    | 'warning'
    | 'info'
    | 'debug'
    | 'spam';
  export default class Logger {
    levels: {
      NONE: 0;
      ERROR: 1;
      WARNING: 2;
      INFO: 3;
      DEBUG: 4;
      SPAM: 5;
    };
    public contexts: LoggerContext[] | {};
    public level: number;
    private colors: boolean;
    private console: boolean;
    constructor(options?: LoggerOptions);
    private set(options: any): void;
    public open(): Promise<void>;
    public close(): Promise<void>;
    private truncate(): Promise<void>;
    public setFile(filename: string): void;
    public setLevel(name: LogLevel);
    public error(...args: any[]): void;
    public warning(...args: any[]): void;
    public info(...args: any[]): void;
    public debug(...args: any[]): void;
    public spam(...args: any[]): void;
    private log(level: string, module?: string, args?: Array<object>);
    public context(module: string): LoggerContext;
    private writeConsole(...args: any[]): any;
    private writeStream(...args: any[]): any;
    private writeError(level: number, err: Error): void;
    private memoryUsage(): object;
    private memory(): object;
  }
  export interface LoggerOptions {
    level?: string | number;
    colors?: boolean;
    shrink?: boolean;
    closed?: boolean;
    closing?: boolean;
    filename?: boolean;
    stream?: boolean;
  }

  export class LoggerContext extends Logger {
    logger: Logger;
    module: string;
  }
}
