import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BurgerMenu } from '@ui';
import { APP_PAGES, CUSTOM_EVENTS as e, LOGIN } from '@constants';
import { appEvents } from '@utils';
import { appStore } from '@store';
import type { Router } from '@route';
import type { ComponentProps } from '@types';

vi.mock('@components', async (importOriginal) => {
  const actual = await importOriginal();

  class ComponentMock {
    node: HTMLElement;

    constructor({ parentNode, tagName = 'div', className, attrs, content }: ComponentProps) {
      this.node = document.createElement(tagName ?? 'div');

      if (className) {
        this.node.className = Array.isArray(className) ? className.join(' ') : className;
      }

      if (attrs) {
        attrs.forEach((a: any) => this.node.setAttribute(a.attr, a.value));
      }

      if (content) {
        this.node.textContent = content as string;
      }

      parentNode?.append(this.node);
    }

    destroy() {
      this.node.remove();
    }
  }

  return {
    ...(actual as {}),
    Component: ComponentMock,
  };
});

vi.mock('@ui', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...(actual as {}),
    Button: class ButtonMock {
      node = document.createElement('button');
      constructor({ parentNode, className, ariaLabel }: any) {
        this.node.className = className ?? '';
        if (ariaLabel) this.node.setAttribute('aria-label', ariaLabel);
        parentNode?.append(this.node);
      }
    },
  };
});

vi.mock('@store', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as {}),
    appStore: {
      currentRoute: '/',
      isAuth: false,
      username: 'Mary',
      logout: vi.fn(),
    },
  };
});

describe('BurgerMenu', () => {
  let root: HTMLElement;
  let router: Router;
  let onClose: () => void;
  let onOpenAuth: () => void;

  beforeEach(() => {
    root = document.createElement('div');
    router = { navigate: vi.fn() } as unknown as Router;
    onClose = vi.fn();
    onOpenAuth = vi.fn();
    vi.clearAllMocks();
  });

  it('renders login/signup when not authenticated', () => {
    new BurgerMenu({
      parentNode: root,
      isAuth: false,
      router,
      onClose,
      onOpenAuth,
    });

    expect(root.querySelector('.burger_login_btn')).toBeDefined();
    expect(root.querySelector('.burger_signup_btn')).toBeDefined();
    expect(root.querySelector('.burger_bottom_btn')).toBeNull();
  });

  it('renders logout when authenticated', () => {
    appStore.isAuth = true;

    new BurgerMenu({
      parentNode: root,
      isAuth: true,
      router,
      onClose,
      onOpenAuth,
    });

    expect(root.querySelector('.burger_bottom_btn')).toBeDefined();
    expect(root.querySelector('.burger_login_btn')).toBeNull();
  });

  it('calls router.navigate and onClose when route clicked', () => {
    new BurgerMenu({
      parentNode: root,
      isAuth: false,
      router,
      onClose,
      onOpenAuth,
    });

    const firstRoute = root.querySelector('.burger_links_list_link')!;
    firstRoute.dispatchEvent(new Event('click'));

    expect(router.navigate).toHaveBeenCalledWith(APP_PAGES[0].path);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onOpenAuth(LOGIN) when login clicked', () => {
    new BurgerMenu({
      parentNode: root,
      isAuth: false,
      router,
      onClose,
      onOpenAuth,
    });

    const loginBtn = root.querySelector('.burger_login_btn')!;
    loginBtn.dispatchEvent(new Event('click'));

    expect(onOpenAuth).toHaveBeenCalledWith(LOGIN);
  });

  it('rerenders on AUTH_CHANGE event', () => {
    new BurgerMenu({
      parentNode: root,
      isAuth: false,
      router,
      onClose,
      onOpenAuth,
    });

    expect(root.querySelector('.burger_login_btn')).toBeDefined();

    appEvents.emit(e.AUTH_CHANGE, 'true');

    expect(root.querySelector('.burger_bottom_btn')).toBeDefined();
    expect(root.querySelector('.burger_login_btn')).toBeNull();
  });

  it('highlights active route', () => {
    appStore.currentRoute = APP_PAGES[1].path;

    const menu = new BurgerMenu({
      parentNode: root,
      isAuth: false,
      router,
      onClose,
      onOpenAuth,
    });

    const items = root.querySelectorAll('.burger_links_list_link');

    expect(items[1].classList.contains(menu.highlightClass)).toBe(true);
  });
});
