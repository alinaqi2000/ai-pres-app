import { create } from 'zustand';

import type { Role, User } from '@/api/auth/types';
import { client } from '@/api/common';

import { createSelectors } from '../utils';
import type { TokenType } from './utils';
import { getToken, removeToken, setToken } from './utils';

interface AuthState {
  user: User | null;
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (token: TokenType, user: User) => void;
  signOut: () => void;
  setRole: (role: Role) => void;
  hydrate: () => Promise<void>;
}

const _useAuth = create<AuthState>((set, get) => ({
  user: null,
  status: 'idle',
  token: null,
  signIn: (token, user) => {
    setToken(token);
    set({ status: 'signIn', token, user });
  },
  signOut: () => {
    removeToken();
    set({ status: 'signOut', token: null });
  },
  setRole: (role) => {
    const user = get().user;
    if (!user) {
      return;
    }
    user.role = role;
    set({ user });
  },
  hydrate: async () => {
    try {
      const userToken = getToken();
      if (userToken !== null) {
        const response = await client<{ data: User }>({
          url: 'auth/me',
          headers: {
            Authorization: `Bearer ${userToken.access_token}`,
          },
          method: 'GET',
        })
          .then((res) => res.data)
          .catch(() => {
            get().signOut();
          });
        if (response && response.data) {
          get().signIn(userToken, response.data);
          return;
        }

        get().signOut();
      } else {
        get().signOut();
      }
    } catch (e) {
      // catch error here
      // Maybe sign_out user!
    }
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: TokenType, user: User) =>
  _useAuth.getState().signIn(token, user);
export const hydrateAuth = () => _useAuth.getState().hydrate();
