import { Component } from '@/components/component';

export class App {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  init() {
    const appContainer = new Component({
      parentNode: this.root,
      tagName: 'div',
      attrs: [{ atr: 'id', value: 'app' }],
      content: 'Mini Game',
    });

    this.root.append(appContainer.node);

    //  router.init(), pages, etc.
  }
}
