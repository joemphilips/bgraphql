declare module 'bsert' {
  export default interface bsert {
    ok(value: any, message: string): void;
    equal<T = any>(actual: T, expected: T, message: string): void;
    notEqual(actual: any, expected: any, message: string): void;
    fail(message: string): void;
  }

  export default function bsert(value: any, message?: string): void;
}
