import type { ApiPostState } from './app';

export type GameComment = {
  commentId: string;
  authorName: string;
  text: string;
  likesCount: number;
  isLikedByCurrentUser: boolean;
  createdAt: string;
};

export type GameCommentsMeta = {
  totalComments: number;
  returnedCount: number;
  sort: 'newest' | 'oldest' | string;
};

export type CommentToggleType = {
  isLikedByCurrentUser: boolean;
  likesCount: number;
};

export type CommentErrorType = {
  error: string;
};

export type CommentToggleResponseType = ApiPostState<CommentToggleType>;

export type GameCommentsResponse = {
  data: GameComment[];
  meta: GameCommentsMeta;
};
