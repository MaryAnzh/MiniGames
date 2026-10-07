import { AuthDialog, type Portal } from '@components';
import { APP_ROUTES, LOGIN } from '@constants';
import { HomePage, CommunityPage, LibraryPage, TournamentsPage, NotFoundPage } from '@pages';
import { GameDetailsDialog } from 'src/components/dialogs/game-details/game-details';
import appStore from '@store';
import type { AuthTabType } from '@types';

const { HOME, COMMUNITY, GAME, LIBRARY, TOURNAMENTS, AUTH } = APP_ROUTES;

export class Router {
  private root: HTMLElement;
  private store = appStore;
  private portal: Portal;

  private routes = [
    { path: HOME, view: HomePage },
    { path: LIBRARY, view: LibraryPage },
    { path: TOURNAMENTS, view: TournamentsPage },
    { path: COMMUNITY, view: CommunityPage },
  ];

  constructor(root: HTMLElement, portal: Portal) {
    this.root = root;
    this.portal = portal;
    this.portal.onClose = this.closePortal;

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

    if (!pathname.startsWith(GAME) && pathname !== AUTH) {
      this.portal.unmount();
    }

    if (pathname.startsWith(GAME)) {
      const slug = pathname.replace(GAME, '').replace(/^\/+/, '');

      this.store.currentRoute = pathname;
      this.store.routeParams = { id: slug };
      this.store.queryParams = searchParams;

      const dialog = new GameDetailsDialog({
        parentNode: null,
        slug,
        onClose: this.closePortal,
      });

      this.portal.mount(dialog.node, dialog);
      return;
    }

    if (pathname === AUTH) {
      this.store.currentRoute = pathname;
      this.store.routeParams = {};
      this.store.queryParams = searchParams;

      if (this.store.isAuth) {
        this.navigate(HOME);
        return;
      }

      const tab = (searchParams.tab as AuthTabType) ?? LOGIN;

      const dialog = new AuthDialog({
        parentNode: null,
        tab,
        onOpenAuthDialog: (nextTab) => {
          this.navigate(`${AUTH}?tab=${nextTab}`);
        },
        onClose: this.closePortal,
      });

      this.portal.mount(dialog.node, dialog);
      return;
    }

    const { view, params } = this.matchRoute(pathname);

    this.store.currentRoute = pathname;
    this.store.routeParams = params;
    this.store.queryParams = searchParams;

    if (this.store.currentPageInstance?.destroy) {
      this.store.currentPageInstance.destroy();
    }

    this.root.innerHTML = '';

    const updateView = view as
      | typeof HomePage
      | typeof CommunityPage
      | typeof LibraryPage
      | typeof TournamentsPage
      | typeof NotFoundPage;

    const pageInstance = new updateView({
      parentNode: this.root,
      navigate: (path: string) => this.navigate(path),
    });

    this.store.currentPageInstance = pageInstance;
  }

  closePortal = () => {
    this.portal.unmount();
    if (history.length <= 1) {
      this.navigate(HOME);
      return;
    }

    // history.back();
  };
}
