export class App {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  init() {
    const appContainer = document.createElement('div');
    appContainer.id = 'app';
    appContainer.textContent = 'Mini Game';

    this.root.append(appContainer);

    //  router.init(), pages, etc.
  }
}
