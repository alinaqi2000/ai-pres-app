export type User = {
  id: number;
  name: string;
  city: string;
  email: string;
  role: Role;
  phone: string | null;
  cnic: string | null;
  gender: Gender;
  nature_of_business: string | null;
};

export type Gender = 'Male' | 'Female';

export type Role = 'tenant' | 'owner' | 'admin';

export type AuthResponse = {
  data: {
    access_token: string;
    token_type: string;
    user: User;
  };
};
