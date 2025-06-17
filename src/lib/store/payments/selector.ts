import { create } from 'zustand';

import { type User } from '@/api/auth';
import { createSelectors } from '@/lib/utils';
import { type Payment } from '@/models/payment';

interface PaymentState {
  currentTenant: User | null;
  currentPayment: Payment | null;
  currentPaymentMode: 'owner' | 'tenant' | null;

  setCurrentTenant: (tenant: User | null) => void;
  setCurrentPayment: (payment: Payment | null) => void;
  setCurrentPaymentMode: (mode: 'owner' | 'tenant' | null) => void;
}

const _useTenant = create<PaymentState>((set) => ({
  currentTenant: null,
  currentPayment: null,
  currentPaymentMode: null,
  setCurrentPayment: (payment: Payment | null) => {
    set({ currentPayment: payment });
  },
  setCurrentTenant: (tenant: User | null) => {
    set({ currentTenant: tenant });
  },
  setCurrentPaymentMode: (mode: 'owner' | 'tenant' | null) => {
    set({ currentPaymentMode: mode });
  },
}));

export const usePaymentStore = createSelectors(_useTenant);

export const setCurrentTenant = (tenant: User | null) =>
  _useTenant.getState().setCurrentTenant(tenant);

export const setCurrentPaymentMode = (mode: 'owner' | 'tenant' | null) =>
  _useTenant.getState().setCurrentPaymentMode(mode);

export const setCurrentPayment = (payment: Payment | null) =>
  _useTenant.getState().setCurrentPayment(payment);
