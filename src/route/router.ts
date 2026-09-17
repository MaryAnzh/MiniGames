import { APP_ROUTES } from '@constants';
import { HomePage, CommunityPage, LibraryPage, TournamentsPage } from '@pages';
import appStore from '@state';

type PageViewType =
  typeof HomePage | typeof CommunityPage | typeof LibraryPage | typeof TournamentsPage;

type RouteType = {
  path: string;
  view: PageViewType;
};

export class Router {
  private routes: RouteType[];
  private root: HTMLElement;
  private store = appStore;

  constructor(root: HTMLElement) {
    this.root = root;

    this.routes = [
      { path: APP_ROUTES.HOME, view: HomePage },
      { path: APP_ROUTES.LIBRARY, view: LibraryPage },
      { path: APP_ROUTES.TOURNAMENTS, view: TournamentsPage },
      { path: APP_ROUTES.COMMUNITY, view: CommunityPage },
    ];

    window.addEventListener('popstate', () => this.handleRoute());
  }

  init() {
    appStore.currentRoute = window.location.pathname;
    this.handleRoute();
  }

  navigate(path: string) {
    // history.pushState({}, '', path);
    this.store.currentRoute = path;
    this.handleRoute();
  }

  private handleRoute() {
    const currentPath = window.location.pathname;
    const route = this.routes.find((r) => r.path === currentPath) || this.routes[0];

    this.root.innerHTML = '';

    new route.view({ parentNode: this.root });
  }
}
