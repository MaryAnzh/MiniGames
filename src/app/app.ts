// src/app/app.ts
import { Component } from '@components';
import { Router } from './router';

export class App {
  private root: HTMLElement;
  private router: Router;

  constructor(root: HTMLElement) {
    this.root = root;
    this.router = new Router(root);
  }

  init() {
    const appContainer = new Component({
      parentNode: this.root,
      attrs: [{ attr: 'id', value: 'app' }],
    });

    this.root.append(appContainer.node);

    this.router.init();
  }
}
