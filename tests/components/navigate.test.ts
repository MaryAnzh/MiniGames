import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Navigate } from '@ui';
import { APP_PAGES, CUSTOM_EVENTS as e } from '@constants';
import { appEvents } from '@utils';
import type { Router } from '@route';
import { appStore } from '@store';

vi.mock('@store', () => ({
  appStore: {
    currentRoute: '/',
  },
}));

vi.mock('@components', () => {
  return {
    Component: class {
      node: HTMLElement;
      constructor({ parentNode, tagName = 'div', className, content }: any) {
        this.node = document.createElement(tagName);
        if (className) {
          this.node.className = Array.isArray(className) ? className.join(' ') : className;
        }
        if (content) this.node.textContent = content;
        parentNode?.append(this.node);
      }
    },
  };
});

describe('Navigate', () => {
  let root: HTMLElement;
  let router: Router;

  beforeEach(() => {
    root = document.createElement('div');
    router = { navigate: vi.fn() } as unknown as Router;
    vi.clearAllMocks();
  });

  it('renders navigation items', () => {
    new Navigate({
      parentNode: root,
      className: 'test-nav',
      router,
    });

    const items = root.querySelectorAll('.app_nav_list_item');
    expect(items.length).toBe(APP_PAGES.length);

    APP_PAGES.forEach(({ name }, i) => {
      expect(items[i].textContent).toBe(name);
    });
  });

  it('calls router.navigate when item clicked', () => {
    new Navigate({
      parentNode: root,
      className: 'test-nav',
      router,
    });

    const firstItem = root.querySelector('.app_nav_list_item')!;
    firstItem.dispatchEvent(new Event('click'));

    expect(router.navigate).toHaveBeenCalledWith(APP_PAGES[0].path);
  });

  it('highlights current route on init', () => {
    const store = appStore;
    store.currentRoute = APP_PAGES[1].path;

    const nav = new Navigate({
      parentNode: root,
      className: 'test-nav',
      router,
    });

    const items = root.querySelectorAll('.app_nav_list_item');

    expect(items[1].classList.contains(nav.highlightClass)).toBe(true);
  });

  it('updates highlight on ROUTE_CHANGE event', () => {
    const nav = new Navigate({
      parentNode: root,
      className: 'test-nav',
      router,
    });

    const items = root.querySelectorAll('.app_nav_list_item');

    appEvents.emit(e.ROUTE_CHANGE, APP_PAGES[2].path);

    expect(items[2].classList.contains(nav.highlightClass)).toBe(true);
  });

  it('highlights first item when path === "/"', () => {
    const nav = new Navigate({
      parentNode: root,
      className: 'test-nav',
      router,
    });

    const items = root.querySelectorAll('.app_nav_list_item');

    nav.highlight('/');

    expect(items[0].classList.contains(nav.highlightClass)).toBe(true);
  });
});
