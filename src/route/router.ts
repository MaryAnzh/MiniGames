import { AuthDialog, type Portal } from '@components';
import { APP_ROUTES, LOGIN } from '@constants';
import { HomePage, CommunityPage, LibraryPage, TournamentsPage, NotFoundPage } from '@pages';
import { GameDetailsDialog } from 'src/components/dialogs/game-details/game-details';
import { appStore } from '@store';
import type { AuthTabType, FirebaseUserResponseType } from '@types';

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

  private async handleRoute() {
    const url = new URL(window.location.href);
    let pathname = url.pathname.replace(/\/+$/, '');
    const searchParams = Object.fromEntries(url.searchParams.entries());

    if (pathname === '' || pathname === '/index.html') {
      pathname = '/';
    }

    /** AUTH */
    if (pathname === AUTH) {
      const tab = (searchParams.tab as AuthTabType) ?? LOGIN;

      const forbidden = () => {
        this.store.showSnack('You are already authenticated', 'info');

        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('auth');
        cleanUrl.searchParams.delete('tab');
        history.replaceState({}, '', cleanUrl.toString());
      };

      if (history.length <= 1) {
        this.renderHome();

        if (!this.store.canOpenAuthDialog()) {
          forbidden();
          return;
        }

        this.openAuthDialog(tab);
        return;
      }

      if (!this.store.canOpenAuthDialog()) {
        forbidden();
        return;
      }

      this.openAuthDialog(tab);
      return;
    }

    /** GAME */
    if (pathname.startsWith(GAME)) {
      const slug = pathname.replace(GAME, '').replace(/^\/+/, '');

      if (!slug) {
        if (history.length <= 1) {
          this.renderHome();
          return;
        }

        history.back();
        return;
      }

      this.store.prepareGameDetails();

      if (history.length <= 1) {
        this.renderHome();
        this.openGameDialog(slug);
        return;
      }

      this.openGameDialog(slug);
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

  private async handleAuthSubmit(
    tab: AuthTabType,
    email: string,
    password: string,
    username?: string,
    dialog?: AuthDialog,
  ) {
    dialog?.setPending(true);
    this.portal.lock();

    let res;

    if (tab === LOGIN) {
      res = await this.store.login(email, password);
    } else {
      res = await this.store.register(email, password, username ?? '');
    }
    const result = res as FirebaseUserResponseType;

    dialog?.setPending(false);
    this.portal.unlock();

    if (!result.ok) {
      dialog?.setError(`${result.error.name}: ${result.error.code}`);
      return;
    }

    this.closePortal();
    this.navigate(HOME);
  }

  private async handleGoogleSubmit(dialog: AuthDialog) {
    dialog.setPending(true);
    this.portal.lock();

    const res = await this.store.loginWithGoogle();

    dialog.setPending(false);
    this.portal.unlock();

    if (!res.ok) {
      dialog.setError(res.error.message);
      return;
    }

    this.closePortal();
    this.navigate(HOME);
  }

  renderHome() {
    history.replaceState({}, '', HOME);

    this.store.currentRoute = HOME;
    this.store.routeParams = {};
    this.store.queryParams = {};

    if (this.store.currentPageInstance?.destroy) {
      this.store.currentPageInstance.destroy();
    }

    this.root.innerHTML = '';
    const homeInstance = new HomePage({
      parentNode: this.root,
      navigate: (path: string) => this.navigate(path),
    });
    this.store.currentPageInstance = homeInstance;
  }

  /** PUBLIC  */
  navigate = (path: string) => {
    history.pushState({}, '', path);
    this.handleRoute();
  };

  openAuthDialog = (tab: AuthTabType) => {
    const dialog = new AuthDialog({
      parentNode: null,
      tab,
      onOpenAuthDialog: (nextTab) => this.navigate(`${AUTH}?tab=${nextTab}`),
      onSubmit: (email, password, username) => {
        this.handleAuthSubmit(tab, email, password, username, dialog);
      },
      onGoogleSubmit: () => this.handleGoogleSubmit(dialog),
      onClose: this.closePortal,
    });

    this.portal.mount(dialog.node, dialog);
  };

  openGameDialog = (slug: string) => {
    const dialog = new GameDetailsDialog({
      parentNode: null,
      slug,
      navigateTo: this.navigate,
      onClose: this.closePortal,
    });

    this.portal.mount(dialog.node, dialog);
  };

  closePortal = () => {
    this.portal.unmount();

    const url = new URL(window.location.href);

    // GAME dialog close
    if (url.pathname.startsWith(GAME)) {
      if (history.length > 1) {
        history.back();
        return;
      }

      this.navigate(HOME);
      return;
    }

    // AUTH dialog close
    if (url.searchParams.has('auth')) {
      if (history.length > 1) {
        history.back();
        return;
      }

      this.navigate(HOME);
      return;
    }
  };
}
