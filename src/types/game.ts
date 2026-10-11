import type { ApiPostState } from './app';

export type TopRecordsType = {
  position: number;
  playerName: string;
  score: number;
  achievedAt: string;
};

export type GameDetailsType = {
  slug: string;
  name: string;
  heroImage: string;
  rating: number;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  fullDescription: string;
  specs: {
    genre: string;
    players: string;
    duration: string;
    price: string;
  };
  topRecords: TopRecordsType[];
};

export type GameDetailsResponse = {
  data: GameDetailsType;
};

export type GameToggleLikeType = {
  gameSlug: string;
  isFavorited: boolean;
  likesCount: number;
};

export type GameToggleLikeResponseType = ApiPostState<GameToggleLikeType>;
