import { describe, it, expect, beforeEach, vi } from 'vitest';
import { App } from '@app';
import { Router } from '@route';
import { Portal } from '@components';
import { appStore } from '@store';
import type { ComponentProps } from '@types';

vi.mock('@components', () => {
  class ComponentMock {
    node: HTMLElement;

    constructor({ parentNode, tagName = 'div', attrs = [] }: ComponentProps) {
      this.node = document.createElement(tagName ?? 'fiv');
      attrs.forEach((a) => this.node.setAttribute(a.attr, a.value as string));
      if (parentNode) parentNode.append(this.node);
    }

    append(child: HTMLElement) {
      this.node.append(child);
    }
  }

  class HeaderMock {
    node: HTMLElement;

    constructor({ parentNode }: ComponentProps) {
      this.node = document.createElement('header');
      if (parentNode) parentNode.append(this.node);
    }
  }

  class FooterMock {
    node: HTMLElement;

    constructor({ parentNode }: ComponentProps) {
      this.node = document.createElement('footer');
      if (parentNode) parentNode.append(this.node);
    }
  }

  class PortalMock {
    node: HTMLElement;
    mount = vi.fn();
    unmount = vi.fn();
    lock = vi.fn();
    unlock = vi.fn();

    constructor() {
      this.node = document.createElement('portal');
    }
  }

  return {
    Component: ComponentMock,
    Header: HeaderMock,
    Footer: FooterMock,
    Portal: PortalMock,
  };
});

vi.mock('@route', () => {
  class RouterMock {
    root: HTMLElement;
    portal: Portal;
    init = vi.fn();
    navigate = vi.fn();

    constructor(root: HTMLElement, portal: Portal) {
      this.root = root;
      this.portal = portal;
    }
  }

  return { Router: vi.fn(RouterMock) };
});

describe('App', () => {
  let root: HTMLElement;
  let app: App;

  beforeEach(() => {
    root = document.createElement('div');
    app = new App(root);
    vi.clearAllMocks();
  });

  it('init creates Portal instance', () => {
    app.init();
    expect(app.portal).toBeInstanceOf(Portal);
  });

  it('init creates appContainer with id=app', () => {
    app.init();
    const container = root.querySelector('#app');
    expect(container).not.toBeNull();
  });

  it('init creates main element with id=page-root', () => {
    app.init();
    const main = root.querySelector('#page-root');
    expect(main).not.toBeNull();
  });

  it('init creates Header and Footer', () => {
    app.init();
    expect(root.querySelector('header')).not.toBeNull();
    expect(root.querySelector('footer')).not.toBeNull();
  });

  it('init appends header, main, footer into appContainer', () => {
    app.init();
    const container = root.querySelector('#app')!;
    const children = Array.from(container.children).map((el) => el.tagName.toLowerCase());

    expect(children).toEqual(['header', 'main', 'footer']);
  });

  it('openAuthDialog updates store.currentRoute and calls router.navigate()', () => {
    app.init();
    const routerInstance = (app as unknown as { router: Router }).router;

    app.openAuthDialog('login');

    expect(appStore.currentRoute).toBe('/auth?tab=login');
    expect(routerInstance.navigate).toHaveBeenCalledWith('/auth?tab=login');
  });
});
