import { Database } from '@thrain/database/database.ts';
import { User } from '../types.ts';

const db = new Database<User>('./db/users.json', 'users');

export async function getUserByCredentials(email: string, password: string) {
  const [user] = await db.query({
    fields: '*',
    where: {
      field: 'email',
      operator: '=',
      value: decodeURIComponent(email),
      and: [{ field: 'password', operator: '=', value: decodeURIComponent(password) }],
    },
  });

  return (user as User | undefined) ?? null;
}
