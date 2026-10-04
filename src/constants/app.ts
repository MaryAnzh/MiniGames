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
  EMPTY: 'empty',
} as const;

export const { ERROR, LOADING, SUCCESS, EMPTY } = RESPONSE_STATUS;

export const SORT_DATA_KEYS = {
  RATING_DESC: 'rating-desc',
  RATING_ASC: 'rating-asc',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
} as const;

export const { NAME_ASC, NAME_DESC, RATING_ASC, RATING_DESC } = SORT_DATA_KEYS;
