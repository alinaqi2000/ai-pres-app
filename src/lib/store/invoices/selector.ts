import { create } from 'zustand';

import { type User } from '@/api/auth';
import { createSelectors } from '@/lib/utils';
import { type Invoice } from '@/models/invoice';

interface InvoiceState {
  currentTenant: User | null;
  currentInvoice: Invoice | null;

  setCurrentTenant: (tenant: User | null) => void;
  setCurrentInvoice: (invoice: Invoice | null) => void;
}

const _useTenant = create<InvoiceState>((set) => ({
  currentTenant: null,
  currentInvoice: null,
  setCurrentInvoice: (invoice: Invoice | null) => {
    set({ currentInvoice: invoice });
  },
  setCurrentTenant: (tenant: User | null) => {
    set({ currentTenant: tenant });
  },
}));

export const useInvoiceStore = createSelectors(_useTenant);

export const setCurrentTenant = (tenant: User | null) =>
  _useTenant.getState().setCurrentTenant(tenant);

export const setCurrentInvoice = (invoice: Invoice | null) =>
  _useTenant.getState().setCurrentInvoice(invoice);
