import { Encoder } from './encoder.ts';

const JWT_HEADER = {
  type: 'JWT',
  alg: 'base64',
};

type ExpiresIn = '1h' | '15m' | '1d';

export type Payload = Record<string, unknown>;

export function sign(payload: Payload, secret: string, _args?: { expiresIn: ExpiresIn }) {
  const args = { expiresIn: getExpiresIn(_args?.expiresIn) };

  const codedHeader = Encoder.toBase64(JSON.stringify(JWT_HEADER));
  const codedPayload = Encoder.toBase64(JSON.stringify({ ...args, ...payload }));

  // This should be done with a better encoding method than base64
  // This is just for educational purposes
  const codedSecret = Encoder.toBase64(`${codedPayload}.${secret}`);

  return `Bearer ${codedHeader}.${codedPayload}.${codedSecret}`;
}

export function verify(tokenString: string, secret: string) {
  const [, token] = tokenString.split(' ') ?? [];

  const [, encodedPayload, encodedSecretWithPayload] = token.split('.');
  const [payloadFromSecret, encodedSecret] = Encoder.fromBase64(encodedSecretWithPayload).split('.');

  if (!encodedSecret || encodedSecret !== secret || payloadFromSecret !== encodedPayload) {
    throw new Error('Unathenticated');
  }

  const decodedPayload = JSON.parse(Encoder.fromBase64(payloadFromSecret));
  if (!decodedPayload.expiresIn || verifyExpirationDate(decodedPayload.expiresIn)) {
    throw new Error('Token expired');
  }

  return decodedPayload;
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
