import { create } from 'zustand';

import { type User } from '@/api/auth';
import { createSelectors } from '@/lib/utils';

interface TenantState {
  editTenant: User | null;
  removedTenant: boolean;

  setEditTenant: (tenant: User | null) => void;
  toggleRemovedTenant: () => void;
}

const _useTenant = create<TenantState>((set, get) => ({
  editTenant: null,
  removedTenant: false,
  setEditTenant: (tenant: User | null) => {
    set({ editTenant: tenant });
  },
  toggleRemovedTenant: () => {
    set({ removedTenant: !get().removedTenant });
  },
}));

export const useTenantStore = createSelectors(_useTenant);

export const setEditTenant = (tenant: User | null) =>
  _useTenant.getState().setEditTenant(tenant);

export const toggleRemovedTenant = () =>
  _useTenant.getState().toggleRemovedTenant();
