import { HomePage } from '@pages';

type RouteType = {
  path: string;
  view: typeof HomePage;
};

export class Router {
  private routes: RouteType[];
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;

    this.routes = [
      { path: '/', view: HomePage },
      // ToDo
      //   { path: '/game', view: GamePage },
    ];

    window.addEventListener('popstate', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  navigate(path: string) {
    history.pushState({}, '', path);
    this.handleRoute();
  }

  private handleRoute() {
    const currentPath = window.location.pathname;

    const route = this.routes.find((r) => r.path === currentPath) || this.routes[0];

    this.root.innerHTML = '';

    new route.view(this.root);
  }
}
