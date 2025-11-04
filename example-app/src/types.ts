export type User = {
  id: string;
  name: string;
  surname: string;
  age: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};
