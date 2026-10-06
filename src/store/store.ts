import { CUSTOM_EVENTS as e, RATING_DESC } from '@constants';
import { appEvents } from '@utils';
import type * as T from '@types';
import { api, authService } from '@services';

import type { PageComponentType } from '@pages';
import { APP_SESSION_KEY, SESSION_LIFETIME_MS } from './constants';

class AppStore {
  private api: typeof api;
  private auth: typeof authService;

  private _currentRoute = '/';
  routeParams: Record<string, string> = {};
  queryParams: Record<string, string> = {};

  private _isAuth = false;
  userEmail: string = '';

  currentPageInstance: PageComponentType | null = null;

  //Sorting
  currentCategory: string = 'all';
  currentSort: T.SortTypes = RATING_DESC;
  pageLimit = 6;

  constructor() {
    this.api = api;
    this.auth = authService;
    this.restoreSession();
  }

  /** Get/Set */
  get isAuth() {
    return this._isAuth;
  }
  set isAuth(isAuth: boolean) {
    this._isAuth = isAuth;
  }

  get currentRoute() {
    return this._currentRoute;
  }
  set currentRoute(value: string) {
    this._currentRoute = value;
    appEvents.emit(e.ROUTE_CHANGE, value);
  }

  /** API PUBLIC ROUTES */
  async getGames(
    params?: T.GameCardParamsType,
  ): Promise<T.ApiState<T.ResponseType<T.GameCardItemType>>> {
    const data = await this.api.getGames(params);
    return data;
  }

  async getLeaderboard(): Promise<T.ApiState<T.ResponseType<T.LeaderBoardType>>> {
    const data = await this.api.getLeaders();
    return data;
  }

  async getCategories(): Promise<T.ApiState<T.ResponseType<T.CategoryType>>> {
    const data = await this.api.getCategories();
    return data;
  }

  async getGameDetails(slug: string) {
    return this.api.getGameDetails(slug);
  }

  async getGameComments(
    slug: string,
    params?: { limit?: number; sort?: 'newest' | 'oldest'; userEmail?: string },
  ) {
    return this.api.getGameComments(slug, params);
  }

  /** SESSIONS */
  private saveSession(email: string) {
    const session = {
      email,
      expiresAt: Date.now() + SESSION_LIFETIME_MS,
    };
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify(session));
    this._isAuth = true;
    this.userEmail = email;
  }

  private clearSession() {
    localStorage.removeItem(APP_SESSION_KEY);
    this._isAuth = false;
    this.userEmail = '';
  }

  private restoreSession() {
    const raw = localStorage.getItem(APP_SESSION_KEY);
    if (!raw) {
      this.clearSession();
      return;
    }

    try {
      const session = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return;
      }

      this._isAuth = true;
      this.userEmail = session.email;
    } catch {
      this.clearSession();
    }
  }

  /** AUTH */
  async login(email: string, password: string) {
    const res = await this.auth.login(email, password);
    if (res.ok) {
      this.saveSession(res?.user?.email ?? email);
    }
    return res;
  }

  async register(email: string, password: string) {
    const res = await this.auth.register(email, password);
    if (res.ok) {
      this.saveSession(res?.user?.email ?? email);
    }
    return res;
  }

  async logout() {
    const res = await this.auth.logout();
    if (res.ok) {
      this.clearSession();
    }
    return res;
  }
}

const appStore = new AppStore();
export default appStore;
