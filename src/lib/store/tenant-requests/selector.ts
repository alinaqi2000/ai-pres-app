import { create } from 'zustand';

import { createSelectors } from '@/lib/utils';
import { type TenantRequest } from '@/models/tenant-request';

interface TenantRequestState {
  currentTenantRequest: TenantRequest | null;

  setCurrentTenantRequest: (tenant: TenantRequest | null) => void;
}

const _useTenantRequest = create<TenantRequestState>((set) => ({
  currentTenantRequest: null,
  setCurrentTenantRequest: (tenant: TenantRequest | null) => {
    set({ currentTenantRequest: tenant });
  },
}));

export const useTenantRequestStore = createSelectors(_useTenantRequest);

export const setCurrentTenantRequest = (tenant: TenantRequest | null) =>
  _useTenantRequest.getState().setCurrentTenantRequest(tenant);
