import type { ERROR_GROUP } from '@constants';
import type { KeysTemplateType } from './common';

export type ErrorGropeType = KeysTemplateType<typeof ERROR_GROUP>;

export type ApiError = {
  group: ErrorGropeType;
  message: string;
  status?: number;
};
