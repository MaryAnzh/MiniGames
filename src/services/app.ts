import * as C from '@constants';
import * as R from './constants';
import { snackbar } from './snackbar';

import type {
  ResponseType,
  GameCardItemType,
  ApiState,
  LeaderBoardType,
  GameCardParamsType,
  CategoryType,
  GameDetailsResponse,
} from '@types';
import type { GameCommentsResponse } from 'src/types/comment';
import { capitalizeFirst } from '@utils';

const { NETWORK } = C.ERROR_GROUP;

export class ApiService {
  private baseUrl = R.API;
  private snackbarPortal: typeof snackbar;

  constructor() {
    this.snackbarPortal = snackbar;
  }

  async get<T>(path: string, resourceName?: string): Promise<ApiState<T>> {
    const name = capitalizeFirst(resourceName ?? path);
    try {
      const response = await fetch(`${this.baseUrl}${path}`);

      if (!response.ok) {
        const errorMsg = this.handleHttpError(response, name);
        this.snackbarPortal.show(errorMsg, 'error');
        return { status: C.ERROR, error: errorMsg };
      }

      const json = await response.json();
      const data = json as T;

      if ('data' in (data as ResponseType<unknown>)) {
        const items = (data as ResponseType<unknown>).data;
        if (Array.isArray(items)) {
          if (items.length === 0) {
            this.snackbarPortal.show(`Data ${name} is empty`, 'info');
          } else {
            this.snackbarPortal.show(`Data ${name} loaded (${items.length})`, 'success');
          }
        }
      } else {
        this.snackbarPortal.show(`Data ${name} loaded successfully`, 'success');
      }

      return { status: C.SUCCESS, data };
    } catch {
      this.snackbarPortal.show('Network error. Check your connection.', 'error');
      return { status: C.ERROR, error: NETWORK };
    }
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

  async getGameDetails(slug: string): Promise<ApiState<GameDetailsResponse>> {
    return await this.get<GameDetailsResponse>(`${R.GAMES}/${slug}`, `Game ${slug}`);
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

export const api = new ApiService();
