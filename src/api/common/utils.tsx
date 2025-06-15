import type {
  GetNextPageParamFunction,
  GetPreviousPageParamFunction,
} from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { type Router } from 'expo-router';

// eslint-disable-next-line import/no-cycle
import { showErrorMessage } from '@/components/ui';

import type { PaginateQuery } from '../types';
import { type ErrorResponse } from './types';

type KeyParams = {
  [key: string]: any;
};
export const DEFAULT_LIMIT = 10;

export function getQueryKey<T extends KeyParams>(key: string, params?: T) {
  return [key, ...(params ? [params] : [])];
}

// for infinite query pages  to flatList data
export function normalizePages<T>(pages?: PaginateQuery<T>[]): T[] {
  return pages
    ? pages.reduce((prev: T[], current) => [...prev, ...current.results], [])
    : [];
}

// a function that accept a url and return params as an object
export function getUrlParameters(
  url: string | null
): { [k: string]: string } | null {
  if (url === null) {
    return null;
  }
  let regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(url))) {
    if (match[1] !== null) {
      //@ts-ignore
      params[match[1]] = match[2];
    }
  }
  return params;
}

export const getPreviousPageParam: GetNextPageParamFunction<
  unknown,
  PaginateQuery<unknown>
> = (page) => getUrlParameters(page.previous)?.offset ?? null;

export const getNextPageParam: GetPreviousPageParamFunction<
  unknown,
  PaginateQuery<unknown>
> = (page) => getUrlParameters(page.next)?.offset ?? null;

export const handleError = (
  error: AxiosError<ErrorResponse>,
  router: Router | null = null
) => {
  console.log('====================================');
  console.log(error.toJSON());
  console.log('====================================');
  switch (error.response?.status) {
    case 401:
      return router?.replace('/login');
    case 422:
      return showErrorMessage(error.response?.data.message);
    default:
      if (error.response?.data.message) {
        return showErrorMessage(error.response?.data.message);
      }
      break;
  }

  return showErrorMessage('Something went wrong');
};
