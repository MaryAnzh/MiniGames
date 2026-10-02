import type { ERROR_GROUP, RESPONSE_STATUS, SORT_DATA_KEYS } from '@constants';
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

export type GameCardParamsType = {
  featured?: boolean;
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
};

export type ResponseStatusType = KeysTemplateType<typeof RESPONSE_STATUS>;

export type LeaderBoardType = {
  rank: number;
  playerName: string;
  gamesPlayed: number;
  totalScore: number;
  streakDays: number;
  favoriteGameSlug: string;
  favoriteGameName: string;
};

export type CategoryType = {
  slug: string;
  label: string;
  isDefault: boolean;
};

export type CategoryMetaType = {
  totalItems: number;
  description: string;
};

export type SortTypes = KeysTemplateType<typeof SORT_DATA_KEYS>;
