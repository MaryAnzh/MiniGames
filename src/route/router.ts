import type { Portal } from '@components';
import { APP_ROUTES } from '@constants';
import { HomePage, CommunityPage, LibraryPage, TournamentsPage, NotFoundPage } from '@pages';
import { GameDetailsDialog } from 'src/components/dialogs/game-details/game-details';
import appStore from '@store';

const { HOME, COMMUNITY, GAME, LIBRARY, TOURNAMENTS } = APP_ROUTES;

export class Router {
  private root: HTMLElement;
  private store = appStore;
  private portal: Portal;

  private routes = [
    { path: HOME, view: HomePage },
    { path: LIBRARY, view: LibraryPage },
    { path: TOURNAMENTS, view: TournamentsPage },
    { path: COMMUNITY, view: CommunityPage },
    { path: `${GAME}:id`, view: HomePage }, // базовый маршрут для игр
  ];

  constructor(root: HTMLElement, portal: Portal) {
    this.root = root;
    this.portal = portal;
    window.addEventListener('popstate', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  navigate(path: string) {
    history.pushState({}, '', path);
    this.handleRoute();
  }

  private matchRoute(pathname: string) {
    for (const route of this.routes) {
      const routeParts = route.path.split('/');
      const pathParts = pathname.split('/');

      if (routeParts.length !== pathParts.length) continue;

      const params: Record<string, string> = {};
      let matched = true;

      routeParts.forEach((part, i) => {
        if (part.startsWith(':')) {
          params[part.slice(1)] = pathParts[i];
        } else if (part !== pathParts[i]) {
          matched = false;
        }
      });

      if (matched) return { view: route.view, params };
    }

    return { view: NotFoundPage, params: {} };
  }

  private handleRoute() {
    const url = new URL(window.location.href);
    const pathname = url.pathname;
    const searchParams = Object.fromEntries(url.searchParams.entries());

    const { view, params } = this.matchRoute(pathname);

    this.store.currentRoute = pathname;
    this.store.routeParams = params;
    this.store.queryParams = searchParams;

    if (pathname.startsWith(GAME)) {
      const slug = params.id;

      const dialog = new GameDetailsDialog({
        parentNode: null,
        slug,
        onClose: () => this.portal.unmount(),
      });

      this.portal.mount(dialog.node);
      return;
    }

    if (this.store.currentPageInstance?.destroy) {
      this.store.currentPageInstance.destroy();
    }

    this.root.innerHTML = '';

    const pageInstance = new view({
      parentNode: this.root,
      portal: this.portal, // пробрасываем портал в страницы
    });

    this.store.currentPageInstance = pageInstance;
  }
}
