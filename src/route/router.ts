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

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    if (!window.location.hash) {
      window.location.hash = APP_ROUTES.HOME;
    }

    this.store.currentRoute = window.location.hash.slice(1);
    this.handleRoute();
  }

  navigate(path: string) {
    window.location.hash = path;
    this.store.currentRoute = path;
    this.handleRoute();
  }

  private handleRoute() {
    const currentPath = window.location.hash.slice(1) || APP_ROUTES.HOME;

    const route = this.routes.find((r) => r.path === currentPath) || this.routes[0];

    this.root.innerHTML = '';
    new route.view({ parentNode: this.root });
  }
}
