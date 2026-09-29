import { Component, Footer, Header } from '@components';
import { APP_ID } from '@constants';
import { Router } from '@route';
import appStore from '@store';

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
      attrs: [{ attr: 'id', value: APP_ID }],
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
      router: this.router,
    });

    appContainer.append(header.node);
    appContainer.append(main.node);
    appContainer.append(footer.node);
  }
}
