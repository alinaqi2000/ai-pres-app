export type User = {
  id: number;
  name: string;
  city: string;
  email: string;
  role: Role;
};

export type Role = 'tenant' | 'owner' | 'admin';

export type AuthResponse = {
  data: {
    access_token: string;
    token_type: string;
    user: User;
  };
};
