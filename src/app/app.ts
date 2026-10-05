import { Component, Header, Footer, Portal } from '@components';
import * as C from '@constants';
import { APP_ROUTES } from '@constants';

import { Router } from '@route';
import appStore from '@store';
import type { AuthTabType } from '@types';

export class App {
  private root: HTMLElement;
  private router: Router | null = null;
  store: typeof appStore;
  private portal!: Portal;

  constructor(root: HTMLElement) {
    this.root = root;
    this.store = appStore;
  }

  init() {
    this.portal = new Portal({ position: 'top' });

    const appContainer = new Component({
      parentNode: this.root,
      attrs: [{ attr: 'id', value: C.APP_ID }],
    });

    const main = new Component({
      parentNode: null,
      tagName: 'main',
      attrs: [{ attr: 'id', value: 'page-root' }],
    });

    this.router = new Router(main.node, this.portal);
    this.router.init();

    const header = new Header({
      parentNode: null,
      isAuth: this.store.isAuth,
      router: this.router,
      portal: this.portal,
      onOpenAuthDialog: this.openAuthDialog,
    });

    const footer = new Footer({
      parentNode: null,
      router: this.router,
    });

    appContainer.append(header.node);
    appContainer.append(main.node);
    appContainer.append(footer.node);
  }

  openAuthDialog = (tab: AuthTabType) => {
    const path = `${APP_ROUTES.AUTH}?tab=${tab}`;
    if (!this.router) {
      return;
    }
    this.store.currentRoute = path;
    this.router.navigate(path);
  };
}
