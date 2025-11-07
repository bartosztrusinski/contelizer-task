export type User = {
  id: number;
  name: string;
  email: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive';
};

export type QueryUserBy = keyof Pick<User, 'name' | 'email'>;
