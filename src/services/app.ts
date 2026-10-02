import * as C from '@constants';
import * as R from './constants';

import type {
  ResponseType,
  GameCardItemType,
  ApiState,
  LeaderBoardType,
  GameCardParamsType,
} from '@types';

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

  async getLeaders() {
    return await this.get<ResponseType<LeaderBoardType>>(R.LEADER_BOARD);
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
