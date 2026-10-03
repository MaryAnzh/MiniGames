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
} from '@types';
import type { GameCommentsResponse } from 'src/types/comment';

const { NETWORK } = C.ERROR_GROUP;

export class ApiService {
  private baseUrl = R.API;

  async get<T>(path: string): Promise<ApiState<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`);

      if (!response.ok) {
        return {
          status: 'error',
          error: this.handleHttpError(response),
        };
      }

      const json = await response.json();
      return { status: 'success', data: json as T };
    } catch {
      return {
        status: 'error',
        error: NETWORK,
      };
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
    return await this.get<ResponseType<GameCardItemType>>(url);
  }

  async getLeaders(): Promise<ApiState<ResponseType<LeaderBoardType>>> {
    return await this.get<ResponseType<LeaderBoardType>>(R.LEADER_BOARD);
  }

  async getCategories(): Promise<ApiState<ResponseType<CategoryType>>> {
    return await this.get<ResponseType<CategoryType>>(R.CATEGORIES);
  }

  async getGameDetails(slug: string): Promise<ApiState<GameDetailsResponse>> {
    return await this.get<GameDetailsResponse>(`${R.GAMES}/${slug}`);
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
    );
    console.log(result);
    return result;
  }

  private handleHttpError(response: Response): string {
    const status = response.status;

    if (status === 404) {
      return 'Resource not found.';
    }

    if (status >= 500) {
      return 'Server error. Try again later.';
    }

    return 'Unexpected error.';
  }
}

export const api = new ApiService();
