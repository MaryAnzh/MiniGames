import * as C from '@constants';
import type { ResponseType, GameCardItemType, ApiState } from '@types';

const { NETWORK } = C.ERROR_GROUP;

export class ApiService {
  private baseUrl = '/api/';

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

  async getGames() {
    return await this.get<ResponseType<GameCardItemType>>('games');
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
