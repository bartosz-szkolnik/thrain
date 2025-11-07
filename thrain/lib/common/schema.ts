// deno-lint-ignore-file no-explicit-any
const __type = Symbol('thrain-schema');
type __Type = typeof __type;

type ValidatorT<T = unknown> = {
  validate(o: any): o is T;
  parse(o: any): T;
  safeParse(o: any): T | null;
  [__type]: T;
};

export type TypeOf<T extends ValidatorT<any>> = T[__Type];
type ObjectRecord = Record<keyof any, ValidatorT>;
type TypeOfRecord<T extends ObjectRecord> = {
  [K in keyof T]: T[K] extends ObjectRecord ? TypeOfRecord<T[K]> : TypeOf<T[K]>;
};

function throwTypeError(expected: string, got: unknown): never {
  throw new TypeError(`Expected ${expected}, received ${JSON.stringify(got)}`);
}

export const Validator = {
  any() {
    return {
      validate(_value: any) {
        return true;
      },
      parse(value: any): any {
        return value;
      },
      safeParse(value: any): any | null {
        try {
          return this.parse(value);
        } catch {
          return null;
        }
      },
    } as ValidatorT<any>;
  },
  string() {
    return {
      validate(str: unknown): str is string {
        return typeof str === 'string';
      },
      parse(str: unknown): string {
        if (!this.validate(str)) throwTypeError('string', str);
        return str;
      },
      safeParse(str: unknown): string | null {
        try {
          return this.parse(str);
        } catch {
          return null;
        }
      },
    } as ValidatorT<string>;
  },
  number() {
    return {
      validate(num: unknown): num is number {
        return typeof num === 'number';
      },
      parse(num: unknown): number {
        if (!this.validate(num)) throwTypeError('number', num);
        return num;
      },
      safeParse(num: unknown): number | null {
        try {
          return this.parse(num);
        } catch {
          return null;
        }
      },
    } as ValidatorT<number>;
  },
  boolean() {
    return {
      validate(bool: unknown): bool is boolean {
        return typeof bool === 'boolean';
      },
      parse(bool: unknown): boolean {
        if (!this.validate(bool)) throwTypeError('boolean', bool);
        return bool;
      },
      safeParse(bool: unknown): boolean | null {
        try {
          return this.parse(bool);
        } catch {
          return null;
        }
      },
    } as ValidatorT<boolean>;
  },
  literal<T extends boolean | string | number>(val: T) {
    return {
      validate: (o: unknown): o is T => o === val,
      parse(o: unknown): T {
        if (!this.validate(o)) throwTypeError(`literal ${String(val)}`, o);
        return o;
      },
      safeParse(o: unknown): T | null {
        try {
          return this.parse(o);
        } catch {
          return null;
        }
      },
    } as ValidatorT<T>;
  },
  array<T extends Array<any>>() {
    return {
      validate: (o: unknown): o is T => Array.isArray(o),
      parse(o: unknown): T {
        if (!this.validate(o)) throwTypeError('array', o);
        return o;
      },
      safeParse(o: unknown): T | null {
        try {
          return this.parse(o);
        } catch {
          return null;
        }
      },
    } as ValidatorT<T>;
  },
  typedArray<T, A extends Array<T>>(obj: ValidatorT) {
    return {
      validate: (o: unknown): o is A => {
        if (!Array.isArray(o)) {
          return false;
        }

        const arr = o as unknown[];
        return arr.every(e => obj.validate(e));
      },
      parse(o: unknown): A {
        if (!this.validate(o)) throwTypeError('array', o);
        const arr = o as unknown[];
        return arr.map(e => obj.parse(e)) as A;
      },
      safeParse(o: unknown): A | null {
        try {
          return this.parse(o);
        } catch {
          return null;
        }
      },
    } as ValidatorT<A>;
  },
  object<T extends ObjectRecord>(obj: T) {
    return {
      validate(o: unknown): o is TypeOfRecord<T> {
        if (typeof o !== 'object' || o === null) {
          return false;
        }

        const rec = o as Record<string, unknown>;
        return Object.entries(rec).every(([key, val]) => {
          return key in obj && obj[key].validate(val);
        });
      },
      parse(o: unknown): TypeOfRecord<T> {
        if (!this.validate(o)) throwTypeError('object', o);
        const rec = o as Record<string, unknown>;

        const result: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(rec)) {
          const validator = obj[key];
          // validator is guaranteed to exist by validate above
          result[key] = validator.parse(val);
        }

        return result as TypeOfRecord<T>;
      },
      safeParse(o: unknown): TypeOfRecord<T> | null {
        try {
          return this.parse(o);
        } catch {
          return null;
        }
      },
    } as ValidatorT<TypeOfRecord<T>>;
  },
};
