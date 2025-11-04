const JWT_HEADER = {
  type: 'JWT',
  alg: 'base64',
};

type ExpiresIn = '1h' | '15m' | '1d';

// dont want to install @types/node and do some other stuff, i think this is fine for now
declare const Buffer: {
  from: (
    value: string | Array<[string, unknown]>,
    encoding?: 'base64',
  ) => { toString: (value: 'base64' | 'ascii') => string };
};

export type Payload = Record<string, unknown>;

export function sign(payload: Payload, secret: string, _args?: { expiresIn: ExpiresIn }) {
  const args = { expiresIn: getExpiresIn(_args?.expiresIn) };

  const codedHeader = toBase64(JSON.stringify(JWT_HEADER));
  const codedPayload = toBase64(JSON.stringify({ ...args, ...payload }));

  // This should be done with a better encoding method than base64
  // This is just for educational purposes
  const codedSecret = toBase64(`${codedPayload}.${secret}`);

  return `Bearer ${codedHeader}.${codedPayload}.${codedSecret}`;
}

export function verify(tokenString: string, secret: string) {
  const [, token] = tokenString.split(' ') ?? [];

  const [, encodedPayload, encodedSecretWithPayload] = token.split('.');
  const [payloadFromSecret, encodedSecret] = fromBase64(encodedSecretWithPayload).split('.');

  if (!encodedSecret || encodedSecret !== secret || payloadFromSecret !== encodedPayload) {
    throw new Error('Unathenticated');
  }

  const decodedPayload = JSON.parse(fromBase64(payloadFromSecret));
  if (!decodedPayload.expiresIn || verifyExpirationDate(decodedPayload.expiresIn)) {
    throw new Error('Token expired');
  }

  return decodedPayload;
}

function toBase64(value: string | Array<[string, unknown]>) {
  return Buffer.from(value).toString('base64');
}

function fromBase64(codedValue: string) {
  return Buffer.from(codedValue, 'base64').toString('ascii');
}

function getExpiresIn(time?: ExpiresIn) {
  const date = new Date();
  if (time === '1h') {
    return date.setHours(date.getHours() + 1);
  }

  if (time === '15m') {
    return date.setMinutes(date.getMinutes() + 15);
  }

  return date.setDate(date.getDate() + 1);
}

function verifyExpirationDate(expiresIn: string) {
  return new Date(expiresIn).getTime() > new Date().getTime();
}
