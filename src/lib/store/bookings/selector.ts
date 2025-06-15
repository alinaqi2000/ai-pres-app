import { create } from 'zustand';

import { type User } from '@/api/auth';
import { createSelectors } from '@/lib/utils';
import { type Booking } from '@/models/booking';
import { type Item } from '@/models/item';

interface BookingState {
  currentTenant: User | null;
  currentItem: Item | null;
  currentBooking: Booking | null;

  setCurrentBooking: (booking: Booking | null) => void;
  setCurrentTenant: (tenant: User | null) => void;
  setCurrentItem: (item: Item | null) => void;
}

const _useTenant = create<BookingState>((set) => ({
  currentTenant: null,
  currentItem: null,
  currentBooking: null,
  setCurrentBooking: (booking: Booking | null) => {
    set({ currentBooking: booking });
  },
  setCurrentTenant: (tenant: User | null) => {
    set({ currentTenant: tenant });
  },
  setCurrentItem: (item: Item | null) => {
    set({ currentItem: item });
  },
}));

export const useBookingStore = createSelectors(_useTenant);

export const setCurrentTenant = (tenant: User | null) =>
  _useTenant.getState().setCurrentTenant(tenant);

export const setCurrentItem = (item: Item | null) =>
  _useTenant.getState().setCurrentItem(item);

export const setCurrentBooking = (booking: Booking | null) =>
  _useTenant.getState().setCurrentBooking(booking);
