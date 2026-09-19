import { Component, Header, Footer } from '@components';
import * as C from '@constants';

import { Router } from '@route';
import appStore from '@state';

export class App {
  private root: HTMLElement;
  private router: Router | null = null;
  store: typeof appStore;

  constructor(root: HTMLElement) {
    this.root = root;
    this.store = appStore;
  }

  init() {
    const appContainer = new Component({
      parentNode: this.root,
      attrs: [{ attr: 'id', value: C.APP_ID }],
    });

    const main = new Component({
      parentNode: null,
      tagName: 'main',
      attrs: [{ attr: 'id', value: 'page-root' }],
    });

    this.router = new Router(main.node);
    this.router.init();

    const header = new Header({
      parentNode: null,
      isAuth: this.store.isAuth,
      router: this.router,
    });
    const footer = new Footer({
      parentNode: null,
    });

    appContainer.append(header.node);
    appContainer.append(main.node);
    appContainer.append(footer.node);
  }
}
