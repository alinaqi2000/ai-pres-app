import { Linking } from 'react-native';
import type { StoreApi, UseBoundStore } from 'zustand';

export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const getFloorSuffix = (number: number): string => {
  if (number === 0) return 'Basement';
  if (number === 1) return 'Ground Floor';

  const lastDigit = number % 10;
  if (lastDigit === 1) return `${number}st Floor`;
  if (lastDigit === 2) return `${number}nd Floor`;
  if (lastDigit === 3) return `${number}rd Floor`;
  return `${number}th Floor`;
};

export const toTitleCase = (str: string) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );

/**
 * Format a number as currency with $ symbol
 * @param amount - The amount to format
 * @param currency - The currency symbol (default: $)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = 'Rs'): string => {
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
