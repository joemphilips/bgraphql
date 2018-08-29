declare module 'bcfg' {
  export default class Config {
    /**
     * module name (e.g. `bcoin`, `bpanel`)
     */
    public module: string;
    /**
     * data dir for putting things in.
     * defaults to `$HOME/.{module}`
     */
    public prefix: string;
    public suffix?: string;
    public fallback?: string;
    public alias?: object;
    // ------ configuration will be parsed and set to these fields----
    // ------ Usually You can get by `this.get()`
    public data?: object;
    public argv?: any[];
    public pass?: any[];
    // ------- these are options you can inject by `this.load()` -------
    public env?: object;
    public args?: object;
    public query?: object;
    public hash?: object;
    // ---------------------------------

    /**
     * Config will read from environment variable prefixed by `toUpper(module)`
     * Only if you run `config.load({argv: true})`
     * @param module
     * @param options
     */
    constructor(module: string, options?: ConfigOption);
    /**
     * keys named "hash", "query", "env" , "argv", "config" will be ignored
     * Use `load` method for those.
     * @param options
     */
    inject(options: object);
    /**
     * if arguments are `true`, then read from the following location
     * - hash ... uri
     * - query ... uri query string
     * - env ... process.env
     * - argv ... process.argv
     * @param options
     */
    load(options?: {
      hash?: string | true;
      env?: object | true;
      argv?: object | true;
      query?: string | true;
    });
    /**
     * load from file
     * @param file
     */
    open(file: string): void;
    /**
     * create child config. Filter attributes by name
     * @param name
     */
    filter(name: string): Config;
    /**
     * set default option
     * @param key
     * @param value
     */
    set(key: string, value: object): void;
    has(key: string): boolean;
    get(key: string, fallback?: object): any;
    typeof(key: string): string;
    /**
     * get config option as a string
     * @param key
     * @param fallback
     */
    str(key: string, fallback: string): string;
    /**
     * get config option as a integer
     * @param key
     * @param fallback
     */
    int(key: string, fallback: number): number;
    /**
     * get config option as a boolean
     * @param key
     * @param fallback
     */
    bool(key: string, fallback: boolean): boolean;
    /**
     * create a new file path under `this.prefix`
     * NOTE: does not actually create the file
     * @param file
     */
    location(file: string): string;
  }

  type SpecialOption = 'hash' | 'query' | 'env' | 'argv' | 'config';

  export type ConfigOption = Partial<{
    suffix: string;
    fallback: string;
    sslKey: string;
    alias: {
      [key: string]: string;
    };
    [key: string]: any;
  }>;
}
