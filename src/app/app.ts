import { Component, Header } from '@components';
import * as C from '@constants';

import { Router } from './router';
import appStore from 'src/state/state';

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

    new Header({
      parentNode: appContainer.node,
      isAuth: this.store.isAuth,
    });

    const pageRoot = new Component({
      parentNode: appContainer.node,
      tagName: 'main',
      attrs: [{ attr: 'id', value: 'page-root' }],
    });

    this.router = new Router(pageRoot.node);
    this.router.init();
  }
}
