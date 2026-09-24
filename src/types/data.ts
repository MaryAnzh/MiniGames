export type CategoriesType = {
  slug: string;
  label: string;
  isDefault: boolean;
};

export type SortOptionType = {
  label: string;
  value: string;
  selected?: boolean;
};

export type GameCardData = {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  rating: number;
  likesCount: number;
  cardImage: string;
  featured: boolean;
};
