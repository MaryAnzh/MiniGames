import { CUSTOM_EVENTS as e } from '@constants';
import { appEvents } from '@utils';

class AppStore {
  private _isAuth = false;
  private _currentRoute = '/';

  get isAuth() {
    return this._isAuth;
  }

  set isAuth(value: boolean) {
    this._isAuth = value;
  }

  get currentRoute() {
    return this._currentRoute;
  }

  set currentRoute(value: string) {
    this._currentRoute = value;
    appEvents.emit(e.ROUTE_CHANGE, value);
  }
}

const appStore = new AppStore();
export default appStore;
