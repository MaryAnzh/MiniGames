import { CUSTOM_EVENTS, CUSTOM_EVENTS as e, RATING_DESC } from '@constants';
import { type SnackbarPortal } from '@components';
import type { PageComponentType } from '@pages';
import { ApiService, AuthService } from '@services';
import type * as T from '@types';
import { appEvents } from '@utils';

import { snackbar } from './helpers/snackbar';
import { APP_SESSION_KEY, SESSION_LIFETIME_MS } from './constants';
import type { AuthStoreDataType, SessionType, UserDataType } from './types';

class AppStore {
  private api: ApiService;
  private auth: AuthService;
  private snackbar: SnackbarPortal;

  private _currentRoute = '/';
  routeParams: Record<string, string> = {};
  queryParams: Record<string, string> = {};

  private _isAuth = false;
  userEmail: string = '';
  username: string = '';
  photoURL: string = '';

  currentPageInstance: PageComponentType | null = null;

  //Sorting
  currentCategory: string = 'all';
  currentSort: T.SortTypes = RATING_DESC;
  pageLimit = 6;

  constructor() {
    this.snackbar = snackbar;
    this.api = new ApiService({ snackbar });
    this.auth = new AuthService({ snackbar });

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
    this.checkSession();
    return this.api.getGameDetails(slug, this.userEmail || undefined);
  }

  async getGameComments(
    slug: string,
    params?: { limit?: number; sort?: 'newest' | 'oldest'; userEmail?: string },
  ) {
    this.checkSession();

    return this.api.getGameComments(slug, {
      ...params,
      userEmail: this.userEmail || undefined,
    });
  }

  async toggleFavorite(slug: string) {
    this.checkSession();
    return this.api.toggleFavorite(slug, {
      userEmail: this.userEmail,
    });
  }

  async toggleCommentLike(slug: string, commentId: string) {
    this.checkSession();
    return this.api.toggleCommentLike(slug, commentId, {
      userEmail: this.userEmail,
    });
  }

  setAuthData({ isAuth, email = '', displayName = '', avatarUrl = '' }: AuthStoreDataType) {
    this.userEmail = email;
    this.username = displayName;
    this.photoURL = avatarUrl;
    this.isAuth = isAuth;
  }

  /** SESSIONS */
  private isValidSession(session: SessionType): session is SessionType {
    return (
      typeof session === 'object' &&
      typeof session.email === 'string' &&
      typeof session.displayName === 'string' &&
      typeof session.expiresAt === 'number' &&
      (typeof session.avatarUrl === 'string' || session.avatarUrl === undefined)
    );
  }

  private saveSession({ email, avatarUrl = '', displayName = '' }: UserDataType) {
    const session: SessionType = {
      email,
      displayName,
      expiresAt: Date.now() + SESSION_LIFETIME_MS,
      avatarUrl,
    };
    localStorage.setItem(APP_SESSION_KEY, JSON.stringify(session));
    this.setAuthData({ isAuth: true, email, displayName, avatarUrl });
  }

  private clearSession() {
    localStorage.removeItem(APP_SESSION_KEY);
    this.setAuthData({ isAuth: false });
  }

  private async restoreSession() {
    const raw = localStorage.getItem(APP_SESSION_KEY);
    if (!raw) {
      if (this.isAuth) {
        this.clearSession();
      }
      return;
    }

    try {
      const session: SessionType = JSON.parse(raw);

      if (!this.isValidSession(session)) {
        this.clearSession();
        await this.logout(true);
        return;
      }

      if (Date.now() > session.expiresAt) {
        this.clearSession();
        await this.logout(true);
        return;
      }
      this.userEmail = session.email ?? '';
      this.username = session.displayName ?? '';
      this.photoURL = session.avatarUrl ?? '';
      this.isAuth = true;
    } catch {
      this.clearSession();
      this.logout(true);
    }
  }

  private startSessionWatcher() {
    setInterval(() => {
      const raw = localStorage.getItem(APP_SESSION_KEY);
      if (!raw) {
        if (this.isAuth) {
          this.setAuthData({ isAuth: false });
        }
        return;
      }

      try {
        const session: SessionType = JSON.parse(raw);
        if (Date.now() > session.expiresAt) {
          this.clearSession();
          this.auth.logout(true);
        }
      } catch {
        if (this.isAuth) {
          this.clearSession();
          this.logout(true);
        }
      }
    }, 10000);
  }

  public async checkSession(): Promise<boolean> {
    const raw = localStorage.getItem(APP_SESSION_KEY);
    if (!raw) {
      if (this.isAuth) {
        this.setAuthData({ isAuth: false });
      }
      return false;
    }

    try {
      const session: SessionType = JSON.parse(raw);

      if (!this.isValidSession(session)) {
        this.clearSession();
        await this.logout(true);
        return false;
      }

      const isExpired = Date.now() > session.expiresAt;

      if (isExpired) {
        this.clearSession();
        this.auth.logout(true);
        return false;
      }

      return true;
    } catch {
      this.clearSession();
      this.auth.logout(true);
      return false;
    }
  }

  /** AUTH */
  async loginWithGoogle() {
    const res = await this.auth.loginWithGoogle();

    if (res.ok) {
      this.saveSession({
        email: res.user.email ?? '',
        displayName: res.user.displayName ?? '',
        avatarUrl: res.user.photoURL ?? '',
      });
    }

    return res;
  }

  async login(email: string, password: string): Promise<T.FirebaseUserResponseType> {
    const res = await this.auth.login(email, password);
    if (res.ok) {
      this.saveSession({
        email: res.user.email ?? '',
        displayName: res.user.displayName ?? '',
        avatarUrl: res.user.photoURL ?? '',
      });
    }
    return res;
  }

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<T.FirebaseUserResponseType> {
    const res = await this.auth.register(email, password, username);
    if (res.ok) {
      this.saveSession({
        email: res.user.email ?? '',
        displayName: res.user.displayName ?? '',
      });
    }
    return res;
  }

  async logout(isSessionExpired?: boolean) {
    const res = await this.auth.logout(Boolean(isSessionExpired));
    if (res.ok) {
      this.clearSession();
    }
    return res;
  }

  public showSnack(message: string, type: 'error' | 'success' | 'info') {
    this.snackbar.show(message, type);
  }
}

const appStore = new AppStore();
export default appStore;
