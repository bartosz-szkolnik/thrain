// dont want to install @types/node and do some other stuff, i think this is fine for now
declare const Buffer: {
  from: (
    value: string | Array<[string, unknown]>,
    encoding?: 'base64',
  ) => { toString: (value: 'base64' | 'ascii') => string };
};

export class Encoder {
  static toBase64(value: string | Array<[string, unknown]>) {
    return Buffer.from(value).toString('base64');
  }

  static fromBase64(codedValue: string) {
    return Buffer.from(codedValue, 'base64').toString('ascii');
  }
}
