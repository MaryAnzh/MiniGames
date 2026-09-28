import { CUSTOM_EVENTS as e } from '@constants';
import { appEvents } from '@utils';
import type { CategoriesType, GameCardDataType, GameRecord, SortOptionType } from '@types';

import categories from '../data/categories.json';
import sortData from '../data/sort.json';
import games from '../data/all-games-seed.json';
import records from '../data/records.json';
import type { PageComponentType } from '@pages';

class AppStore {
  private _isAuth = false;
  private _currentRoute = '/';

  categories: CategoriesType[] = categories.data;
  sort: SortOptionType[] = sortData;
  games: GameCardDataType[] = games.data;
  records: GameRecord[] = records;

  routeParams: Record<string, string> = {};
  queryParams: Record<string, string> = {};

  currentPageInstance: PageComponentType | null = null;

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
