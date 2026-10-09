import { LOADING, NAME_ASC, NAME_DESC, RATING_ASC, RATING_DESC } from '@constants';
import type { CategoryType } from '@types';

export const SORT_OPTIONS = [
  { label: 'Rating ↑', value: RATING_ASC, selected: false },
  { label: 'Rating ↓', value: RATING_DESC, selected: true },
  { label: 'Name A→Z', value: NAME_ASC, selected: false },
  { label: 'Name Z→A', value: NAME_DESC, selected: false },
];

export const CHIPS_COUNT = 7;
export const LOADING_CHIP: CategoryType = {
  label: LOADING,
  isDefault: false,
  slug: LOADING,
};
