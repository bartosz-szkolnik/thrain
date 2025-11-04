import { verify, sign } from '@thrain/common/jsonwebtoken.ts';
import { Validator } from '@thrain/common/index.ts';
import { User } from './types.ts';

const APP_SECRET = Deno.env.get('AUTH_SECRET') ?? '';
export const APP_TOKEN_NAME = 'example-app-token';

export function verifyToken(token: string) {
  return verify(token, APP_SECRET);
}

const loginSchema = Validator.object({
  email: Validator.string(),
  password: Validator.string(),
});

export function createCookieWithToken(user: User) {
  const { id: userId, role } = user;
  const tokenValue = { userId, role };

  const token = sign(tokenValue, APP_SECRET);
  return getCookie(token);
}

export function getCookie(token: string, maxAge = 3600) {
  const cookieOptions = {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: true, // Use 'true' if using HTTPS
    sameSite: 'Strict', // Helps prevent CSRF attacks
    maxAge, // Cookie expiration time in seconds
  };

  return `${APP_TOKEN_NAME}=${token}; HttpOnly=${cookieOptions.httpOnly}; Secure=${cookieOptions.secure}; Max-Age=${cookieOptions.maxAge}; SameSite=${cookieOptions.sameSite}`;
}

export function validateData(data: Record<string, unknown>) {
  const values = loginSchema.safeParse(data);
  if (!values) {
    throw new Error('Invalid data from user.');
  }

  return values;
}
