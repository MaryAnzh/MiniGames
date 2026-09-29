export const APP_ID = 'app';

export const ERROR_GROUP = {
  NETWORK: 'NETWORK',
  SERVER: 'SERVER',
  CLIENT: 'CLIENT',
  EMPTY: 'EMPTY',
  UNKNOWN: 'UNKNOWN',
} as const;

export const RESPONSE_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const { ERROR, LOADING, SUCCESS } = RESPONSE_STATUS;
