import * as C from '@constants';
import * as R from './constants';

import type {
  ResponseType,
  GameCardItemType,
  ApiState,
  LeaderBoardType,
  GameCardParamsType,
  CategoryType,
  GameDetailsResponse,
  GameCommentsResponse,
} from '@types';
import { capitalizeFirst } from '@utils';
import type { SnackbarPortal } from '@components';

const { NETWORK } = C.ERROR_GROUP;

export class ApiService {
  private baseUrl = R.API;
  private snackbar: SnackbarPortal;

  constructor({ snackbar }: { snackbar: SnackbarPortal }) {
    this.snackbar = snackbar;
  }

  async get<T>(path: string, resourceName?: string): Promise<ApiState<T>> {
    const name = capitalizeFirst(resourceName ?? path);
    try {
      const response = await fetch(`${this.baseUrl}${path}`);

      if (!response.ok) {
        const errorMsg = this.handleHttpError(response, name);
        this.snackbar.show(errorMsg, 'error');
        return { status: C.ERROR, error: errorMsg };
      }

      const json = await response.json();
      const data = json as T;
      return { status: C.SUCCESS, data };
    } catch {
      this.snackbar.show('Network error. Check your connection.', 'error');
      return { status: C.ERROR, error: NETWORK };
    }
  }

  async post<T, K>(path: string, body: K, resourceName?: string): Promise<ApiState<T>> {
    const name = capitalizeFirst(resourceName ?? path);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorMsg = this.handleHttpError(response, name);
        this.snackbar.show(errorMsg, 'error');
        return { status: C.ERROR, error: errorMsg };
      }

      const json = await response.json();
      const data = json as T;

      return { status: C.SUCCESS, data };
    } catch {
      this.snackbar.show('Network error. Check your connection.', 'error');
      return { status: C.ERROR, error: NETWORK };
    }
  }

  async toggleFavorite(
    slug: string,
    body: { userEmail: string },
  ): Promise<ApiState<{ data: { isFavorited: boolean; likesCount: number } }>> {
    return this.post(`${R.GAMES}/${slug}/favorite`, body, `Game ${slug} Favorite`);
  }

  async getGames(params?: GameCardParamsType): Promise<ApiState<ResponseType<GameCardItemType>>> {
    const query = new URLSearchParams();

    if (params) {
      if (params.featured) {
        query.set('featured', 'true');
      } else {
        if (params.page) query.set('page', String(params.page));
        if (params.limit) query.set('limit', String(params.limit));
        if (params.category) query.set('category', params.category);
        if (params.sort) query.set('sort', params.sort);
      }
    }

    const url = `${R.GAMES}?${query.toString()}`;
    return await this.get<ResponseType<GameCardItemType>>(url, R.GAMES);
  }

  async getLeaders(): Promise<ApiState<ResponseType<LeaderBoardType>>> {
    return await this.get<ResponseType<LeaderBoardType>>(R.LEADER_BOARD);
  }

  async getCategories(): Promise<ApiState<ResponseType<CategoryType>>> {
    return await this.get<ResponseType<CategoryType>>(R.CATEGORIES);
  }

  async getGameDetails(slug: string, userEmail?: string): Promise<ApiState<GameDetailsResponse>> {
    const query = userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : '';
    return await this.get<GameDetailsResponse>(`${R.GAMES}/${slug}${query}`, `Game ${slug}`);
  }

  async getGameComments(
    gameSlug: string,
    params?: { limit?: number; sort?: 'newest' | 'oldest'; userEmail?: string },
  ): Promise<ApiState<GameCommentsResponse>> {
    const query = new URLSearchParams();

    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.sort) query.set('sort', params.sort);
    if (params?.userEmail) query.set('userEmail', params.userEmail);

    const result = await this.get<GameCommentsResponse>(
      `${R.GAMES}/${gameSlug}/${R.COMMENTS}?${query.toString()}`,
      `Game ${gameSlug} ${R.COMMENTS}`,
    );
    return result;
  }

  async toggleCommentLike(
    slug: string,
    commentId: string,
    body: { userEmail: string },
  ): Promise<ApiState<{ data: { isLiked: boolean; likesCount: number } }>> {
    return this.post(
      `${R.GAMES}/${slug}/${R.COMMENTS}/${commentId}/like`,
      body,
      `Comment ${commentId} Like`,
    );
  }

  private handleHttpError(response: Response, path: string): string {
    const status = response.status;

    if (status === 404) {
      return `Resource ${path.toLocaleUpperCase()} not found.`;
    }

    if (status >= 500) {
      return `Server error for ${path.toLocaleUpperCase()}. Try again later.`;
    }

    return `Unexpected error for ${path.toLocaleUpperCase()}.`;
  }
}
