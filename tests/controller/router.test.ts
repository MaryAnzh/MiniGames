import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { Router } from '@route';
import { APP_ROUTES } from '@constants';

/** Store  */
vi.mock('@store', () => ({
  appStore: {
    currentRoute: '',
    routeParams: {},
    queryParams: {},
    currentPageInstance: null,

    isAuth: false,

    showSnack: vi.fn(),
    canOpenAuthDialog: vi.fn().mockReturnValue(true),

    prepareGameDetails: vi.fn(),

    login: vi.fn().mockResolvedValue({ ok: true }),
    register: vi.fn().mockResolvedValue({ ok: true }),
    loginWithGoogle: vi.fn().mockResolvedValue({ ok: true }),
  },
}));

/** Pages */
vi.mock('@pages', () => {
  class HomePage {
    node: HTMLElement;
    destroy: () => void;

    constructor({ parentNode }: { parentNode: HTMLElement }) {
      this.node = document.createElement('home');
      this.destroy = vi.fn();
      parentNode?.append(this.node);
    }
  }

  class CommunityPage {
    node: HTMLElement;
    destroy: () => void;

    constructor({ parentNode }: { parentNode: HTMLElement }) {
      this.node = document.createElement('community');
      this.destroy = vi.fn();
      parentNode?.append(this.node);
    }
  }

  class LibraryPage {
    node: HTMLElement;
    destroy: () => void;

    constructor({ parentNode }: { parentNode: HTMLElement }) {
      this.node = document.createElement('library');
      this.destroy = vi.fn();
      parentNode?.append(this.node);
    }
  }

  class TournamentsPage {
    node: HTMLElement;
    destroy: () => void;

    constructor({ parentNode }: { parentNode: HTMLElement }) {
      this.node = document.createElement('tournaments');
      this.destroy = vi.fn();
      parentNode?.append(this.node);
    }
  }

  class NotFoundPage {
    node: HTMLElement;
    destroy: () => void;

    constructor({ parentNode }: { parentNode: HTMLElement }) {
      this.node = document.createElement('notfound');
      this.destroy = vi.fn();
      parentNode?.append(this.node);
    }
  }

  return {
    HomePage: vi.fn(HomePage),
    CommunityPage: vi.fn(CommunityPage),
    LibraryPage: vi.fn(LibraryPage),
    TournamentsPage: vi.fn(TournamentsPage),
    NotFoundPage: vi.fn(NotFoundPage),
  };
});

/** Portal + AuthDialog */
vi.mock('@components', () => {
  class AuthDialog {
    node: HTMLElement;
    setPending = vi.fn();
    setError = vi.fn();
    onOpenAuthDialog?: (tab: string) => void;
    onSubmit?: (email: string, password: string, username?: string) => void;
    onGoogleSubmit?: () => void;
    onClose?: () => void;

    constructor({ parentNode, onOpenAuthDialog, onSubmit, onGoogleSubmit, onClose }: any) {
      this.node = document.createElement('auth');
      parentNode?.append(this.node);
      this.onOpenAuthDialog = onOpenAuthDialog;
      this.onSubmit = onSubmit;
      this.onGoogleSubmit = onGoogleSubmit;
      this.onClose = onClose;

      parentNode?.append(this.node);
    }
  }

  class Portal {
    node: HTMLElement;
    mount = vi.fn();
    unmount = vi.fn();
    lock = vi.fn();
    unlock = vi.fn();
    onClose: (() => void) | null = null;
    position: string;

    constructor({ position }: { position: string }) {
      this.node = document.createElement('portal');
      this.position = position;
    }
  }

  return {
    AuthDialog: vi.fn(AuthDialog),
    Portal: vi.fn(Portal),
  };
});

/** Game Dialog */
vi.mock('src/components/dialogs/game-details/game-details', () => {
  class GameDetailsDialog {
    node: HTMLElement;
    slug: string;
    navigateTo: (path: string) => void;
    onClose: () => void;

    constructor({ parentNode, slug, navigateTo, onClose }: any) {
      this.node = document.createElement('gamedialog');
      this.slug = slug;
      this.navigateTo = navigateTo;
      this.onClose = onClose;

      parentNode?.append(this.node);
    }
  }

  return {
    GameDetailsDialog: vi.fn(GameDetailsDialog),
  };
});

import { appStore } from '@store';
import { Portal } from '@components';
import { AuthDialog } from '@components';
import { HomePage, NotFoundPage } from '@pages';
import { GameDetailsDialog } from 'src/components/dialogs/game-details/game-details';

describe('Router', () => {
  let root: HTMLElement;
  let portal: Portal;
  let router: Router;

  beforeEach(() => {
    root = document.createElement('div');
    portal = new Portal({ position: 'top' });
    router = new Router(root, portal);
    vi.clearAllMocks();
  });

  it('matchRoute returns correct view', () => {
    const res = (router as any).matchRoute(APP_ROUTES.HOME);
    expect(res.view).toBe(HomePage);
  });

  it('matchRoute returns NotFoundPage for unknown route', () => {
    const res = (router as any).matchRoute('/unknown');
    expect(res.view).toBe(NotFoundPage);
  });

  it('init calls handleRoute', () => {
    const spy = vi.spyOn(router, 'handleRoute' as never);
    router.init();
    expect(spy).toHaveBeenCalled();
  });

  it('navigate pushes history and calls handleRoute', () => {
    const spy = vi.spyOn(router, 'handleRoute' as never);
    router.navigate('/abc');
    expect(spy).toHaveBeenCalled();
  });

  it('handleRoute renders HOME when pathname is empty', () => {
    window.location.href = '/';
    router.init();
    expect(HomePage).toHaveBeenCalled();
  });

  it('renderHome renders HomePage', () => {
    router.renderHome();

    expect(HomePage).toHaveBeenCalled();
    expect(appStore.currentRoute).toBe(APP_ROUTES.HOME);
  });

  it('GAME route opens GameDetailsDialog', () => {
    window.location.href = `${APP_ROUTES.GAME}/slug123`;
    router.init();

    expect(GameDetailsDialog).toHaveBeenCalled();
  });

  it('closePortal navigates HOME when closing GAME dialog with no history', () => {
    window.location.href = `${APP_ROUTES.GAME}/slug`;

    Object.defineProperty(history, 'length', { value: 1 });

    const spy = vi.spyOn(router, 'navigate');
    router.closePortal();

    expect(spy).toHaveBeenCalledWith(APP_ROUTES.HOME);
  });
});

describe('Router: extended tests', () => {
  let root: HTMLElement;
  let portal: Portal;
  let router: Router;

  beforeEach(() => {
    root = document.createElement('div');
    portal = new Portal({ position: 'top' });
    router = new Router(root, portal);
    vi.clearAllMocks();
  });

  it('openAuthDialog mounts AuthDialog', () => {
    router.openAuthDialog('login');

    expect(AuthDialog).toHaveBeenCalled();
    expect(portal.mount).toHaveBeenCalled();
  });

  it('handleAuthSubmit navigates HOME on successful login', async () => {
    const dialog = {
      node: document.createElement('auth'),
      setPending: vi.fn(),
      setError: vi.fn(),
    } as any;

    const spyNavigate = vi.spyOn(router, 'navigate');

    await (router as any).handleAuthSubmit('login', 'a@a.com', '123', undefined, dialog);

    expect(dialog.setPending).toHaveBeenCalledTimes(2);
    expect(spyNavigate).toHaveBeenCalledWith(APP_ROUTES.HOME);
  });

  it('handleAuthSubmit sets error when login fails', async () => {
    (appStore.login as Mock).mockResolvedValueOnce({
      ok: false,
      error: { name: 'AuthError', code: 'INVALID' },
    });

    const dialog = {
      node: document.createElement('auth'),
      setPending: vi.fn(),
      setError: vi.fn(),
    } as any;

    await (router as any).handleAuthSubmit('login', 'a@a.com', '123', undefined, dialog);

    expect(dialog.setError).toHaveBeenCalledWith('AuthError: INVALID');
  });

  it('handleGoogleSubmit navigates HOME on success', async () => {
    const dialog = {
      node: document.createElement('auth'),
      setPending: vi.fn(),
      setError: vi.fn(),
    } as any;

    const spyNavigate = vi.spyOn(router, 'navigate');

    await (router as any).handleGoogleSubmit(dialog);

    expect(spyNavigate).toHaveBeenCalledWith(APP_ROUTES.HOME);
  });

  it('matchRoute extracts params correctly', () => {
    const routerAny = router as any;

    routerAny.routes.push({
      path: '/game/:slug',
      view: HomePage,
    });

    const res = routerAny.matchRoute('/game/abc123');

    expect(res.params.slug).toBe('abc123');
    expect(res.view).toBe(HomePage);
  });

  it('handleRoute opens AuthDialog when AUTH route', () => {
    history.pushState({}, '', '/prev');

    window.location.href = `${APP_ROUTES.AUTH}?tab=login`;

    router.init();

    expect(AuthDialog).toHaveBeenCalled();
    expect(portal.mount).toHaveBeenCalled();
  });

  it('handleRoute opens GameDetailsDialog when slug exists', () => {
    history.pushState({}, '', '/prev');

    window.location.href = `${APP_ROUTES.GAME}/slug999`;

    router.init();

    expect(GameDetailsDialog).toHaveBeenCalled();
    expect(portal.mount).toHaveBeenCalled();
  });

  it('closePortal navigates HOME when closing AUTH dialog with no history', () => {
    window.location.href = `${APP_ROUTES.AUTH}?auth=true`;

    Object.defineProperty(history, 'length', { value: 1 });

    const spy = vi.spyOn(router, 'navigate');

    router.closePortal();

    expect(spy).toHaveBeenCalledWith(APP_ROUTES.HOME);
  });
});

describe('Router: extra coverage', () => {
  let root: HTMLElement;
  let portal: Portal;
  let router: Router;

  beforeEach(() => {
    root = document.createElement('div');
    portal = new Portal({ position: 'top' });
    router = new Router(root, portal);
    vi.clearAllMocks();
  });

  it('AUTH route forbidden branch triggers showSnack and cleans URL', () => {
    (appStore.canOpenAuthDialog as Mock).mockReturnValue(false);

    window.location.href = `${APP_ROUTES.AUTH}?tab=login&auth=true`;

    router.init();

    expect(appStore.showSnack).toHaveBeenCalled();
    expect(window.location.href.includes('auth=')).toBe(false);
    expect(window.location.href.includes('tab=')).toBe(false);
  });

  it('navigate updates URL and calls handleRoute', () => {
    const spy = vi.spyOn(router, 'handleRoute' as never);

    router.navigate('/library');

    expect(window.location.pathname).toBe('/library');
    expect(spy).toHaveBeenCalled();
  });

  it('popstate event triggers handleRoute', () => {
    const spy = vi.spyOn(router, 'handleRoute' as never);

    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(spy).toHaveBeenCalled();
  });

  it('destroy is called on previous page when navigating', () => {
    window.location.href = APP_ROUTES.HOME;
    router.init();

    const firstInstance = appStore.currentPageInstance;
    const destroySpy = vi.spyOn(firstInstance!, 'destroy');

    router.navigate(APP_ROUTES.COMMUNITY);

    expect(destroySpy).toHaveBeenCalled();
  });
});
