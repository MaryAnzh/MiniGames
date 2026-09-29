import type { ERROR_GROUP } from '@constants';
import type { KeysTemplateType } from './common';

export type ErrorGropeType = KeysTemplateType<typeof ERROR_GROUP>;

export type ApiError = {
  group: ErrorGropeType;
  message: string;
  status?: number;
};

export type ApiState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; error: ApiError };
