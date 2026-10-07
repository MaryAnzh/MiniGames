import { CUSTOM_EVENTS, CUSTOM_EVENTS as e, RATING_DESC } from '@constants';
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
  username: string = '';

  currentPageInstance: PageComponentType | null = null;

  //Sorting
  currentCategory: string = 'all';
  currentSort: T.SortTypes = RATING_DESC;
  pageLimit = 6;

  constructor() {
    this.api = api;
    this.auth = authService;
    this.restoreSession();
    this.startSessionWatcher();
  }

  /** Get/Set */
  get isAuth() {
    return this._isAuth;
  }
  set isAuth(value: boolean) {
    this._isAuth = value;
    appEvents.emit(CUSTOM_EVENTS.AUTH_CHANGE, value ? 'true' : 'false');
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

  setAuthData({
    isAuth,
    email = '',
    userName = '',
  }: {
    isAuth: boolean;
    email?: string;
    userName?: string;
  }) {
    this.userEmail = email;
    this.username = userName;
    this.isAuth = isAuth;
  }

  /** SESSIONS */
  private saveSession(email: string, username?: string) {
    const session = {
      email,
      username,
      expiresAt: Date.now() + SESSION_LIFETIME_MS,
    };
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify(session));
    this.setAuthData({ isAuth: true, email, userName: username ?? '' });
  }

  private clearSession() {
    localStorage.removeItem(APP_SESSION_KEY);
    this.setAuthData({ isAuth: false });
  }

  private restoreSession() {
    const raw = localStorage.getItem(APP_SESSION_KEY);
    if (!raw) {
      this.clearSession();
      this.setAuthData({ isAuth: false });
      return;
    }

    try {
      const session = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        this.isAuth = false;
        this.userEmail = '';
        this.username = '';
        return;
      }

      this.isAuth = true;
      this.userEmail = session.email ?? '';
      this.username = session.username ?? '';
    } catch {
      this.clearSession();
      this.setAuthData({ isAuth: false });
    }
  }

  private startSessionWatcher() {
    setInterval(() => {
      const raw = localStorage.getItem(APP_SESSION_KEY);
      if (!raw) {
        this.setAuthData({ isAuth: false });
        return;
      }

      try {
        const session = JSON.parse(raw);
        if (Date.now() > session.expiresAt) {
          this.clearSession();
          this.auth.logout();
        }
      } catch {
        this.clearSession();
      }
    }, 10000);
  }

  /** AUTH */
  async login(email: string, password: string) {
    const res = await this.auth.login(email, password);
    if (res.ok) {
      this.saveSession(res?.user?.email ?? email);
    }
    return res;
  }

  async register(email: string, password: string, username: string) {
    const res = await this.auth.register(email, password);
    if (res.ok) {
      this.saveSession(res?.user?.email ?? email, username);
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
