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

export type GameCardDataType = {
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  rating: number;
  likesCount: number;
  cardImage: string;
  featured: boolean;
  players: string;
  duration: string;
};

export type GameRecord = {
  position: number;
  playerName: string;
  score: number;
  achievedAt: string; // ISO date
};

export type GameComment = {
  commentId: string;
  authorName: string;
  text: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string; // ISO date
};
