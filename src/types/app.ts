import type { ERROR_GROUP, RESPONSE_STATUS } from '@constants';
import type { KeysTemplateType } from './common';

export type ErrorGropeType = KeysTemplateType<typeof ERROR_GROUP>;

export type MetaType = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  appliedFilter: Record<string, boolean>;
};

export type ResponseType<T> = {
  data: T[];
  meta: MetaType;
};

export type ApiSuccess<T> = {
  status: 'success';
  data: T;
};

export type ApiError = {
  status: 'error';
  error: string;
};

export type ApiState<T> = ApiSuccess<T> | ApiError;

export type GameCardItemType = {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  rating: number;
  likesCount: number;
  cardImage: string;
};

export type ResponseStatusType = KeysTemplateType<typeof RESPONSE_STATUS>;
