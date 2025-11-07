import { Database } from '@thrain/database/database.ts';
import { User } from '../types.ts';
import { Logger } from '@thrain/middlewares/logger.ts';

const db = new Database<User>('./db/users.json', 'users');
const logger = Logger.instance;

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

export async function insertNewUser(data: Omit<User, 'id'>) {
  const user = await db.insert(data);
  logger.info(`Created a new user with id ${user.id}`);
}

export async function deleteUser(id: User['id']) {
  await db.delete(id);
}
