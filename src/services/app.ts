import type { ApiState } from '@types';
import * as C from '@constants';

const { CLIENT, NETWORK, SERVER, UNKNOWN } = C.ERROR_GROUP;

export class ApiService {
  private baseUrl = 'https://faxb76kxra.execute-api.eu-central-1.amazonaws.com/api';

  async get<T>(path: string): Promise<ApiState<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`);

      if (!response.ok) {
        return this.handleHttpError(response);
      }

      const json = await response.json();

      if (Array.isArray(json) && json.length === 0) {
        return { status: 'empty' };
      }

      return { status: 'success', data: json };
    } catch {
      return {
        status: 'error',
        error: {
          group: NETWORK,
          message: 'Network error. Check your connection.',
        },
      };
    }
  }

  private handleHttpError(response: Response) {
    const status = response.status;

    if (status === 404) {
      return {
        status: 'error',
        error: {
          group: CLIENT,
          message: 'Resource not found.',
          status,
        },
      };
    }

    if (status >= 500) {
      return {
        status: 'error',
        error: {
          group: SERVER,
          message: 'Server error. Try again later.',
          status,
        },
      };
    }

    return {
      status: 'error',
      error: {
        group: UNKNOWN,
        message: 'Unexpected error.',
        status,
      },
    };
  }
}

export const api = new ApiService();
