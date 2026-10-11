import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Header, Portal } from '@components';
import type { ComponentProps } from '@types';
import { appStore } from '@store';
import { appEvents } from '@utils';
import { CUSTOM_EVENTS } from '@constants';
import { Router } from '@route';

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
        attrs.forEach((a) => this.node.setAttribute(a.attr, a.value as string));
      }

      if (content) {
        this.node.textContent = content as string;
      }

      parentNode?.append(this.node);
    }

    removeOnclick() {
      this.node.onclick = null;
    }

    destroy() {
      this.node.remove();
    }
  }

  class PortalMock {
    node: HTMLElement;
    mount = vi.fn();
    unmount = vi.fn();
    lock = vi.fn();
    unlock = vi.fn();
    onClose: (() => void) | null = null;
    position: string;

    constructor({ position }: { position: string }) {
      this.node = document.createElement('portal');
      this.position = position;
    }
  }

  return {
    ...(actual as {}),
    Component: ComponentMock,
    Portal: PortalMock,
    AuthDialog: vi.fn(),
  };
});

vi.mock('@ui', () => {
  return {
    Logo: class LogoMock {
      node = document.createElement('div');
      constructor({ parentNode }: { parentNode: HTMLElement }) {
        this.node.className = 'logo';
        parentNode.append(this.node);
      }
      removeOnclick() {
        this.node.onclick = null;
      }
    },

    Navigate: class NavigateMock {
      node = document.createElement('nav');
      constructor({ parentNode }: { parentNode: HTMLElement }) {
        this.node.className = 'navigate';
        parentNode.append(this.node);
      }
      removeOnclick() {
        this.node.onclick = null;
      }
    },

    Button: class ButtonMock {
      node = document.createElement('button');
      constructor({
        parentNode,
        className,
        text,
        leftIcon,
      }: {
        parentNode: HTMLElement;
        className?: string;
        text?: string;
        leftIcon?: string;
      }) {
        this.node.className = className ?? '';
        if (text) this.node.textContent = text;
        if (leftIcon) this.node.setAttribute('data-icon', leftIcon);
        parentNode.append(this.node);
      }
      removeOnclick() {
        this.node.onclick = null;
      }
    },

    BurgerMenu: class BurgerMenuMock {
      node = document.createElement('div');
      constructor() {
        this.node.className = 'burger-menu';
      }
      removeOnclick() {
        this.node.onclick = null;
      }
    },
  };
});

vi.mock('@store', () => {
  return {
    appStore: {
      isAuth: false,
      username: 'Mary',
      userEmail: 'mary@example.com',
      photoURL: '',
      logout: vi.fn(),
    },
  };
});

vi.mock('@route', () => {
  class RouterMock {
    navigate = vi.fn();
  }
  return { Router: RouterMock };
});

describe('Header', () => {
  let root: HTMLElement;
  let router: Router;
  let portal: Portal;
  let onOpenAuthDialog: (tab: 'login' | 'register') => void;

  beforeEach(() => {
    root = document.createElement('div');
    portal = new Portal({ position: 'top' });
    router = new Router(root, portal);
    onOpenAuthDialog = vi.fn();
    vi.clearAllMocks();
  });

  it('renders header with login and signup buttons when not authenticated', () => {
    appStore.isAuth = false;

    new Header({
      parentNode: root,
      router,
      portal,
      isAuth: false,
    });

    expect(root.querySelector('.header_login_btn')).toBeDefined();
    expect(root.querySelector('.header_signup_btn')).toBeDefined();
    expect(root.querySelector('.header_logout_btn')).toBeNull();
  });

  it('renders header with avatar and logout when authenticated', () => {
    appStore.isAuth = true;

    new Header({
      parentNode: root,
      router,
      portal,
      isAuth: true,
    });

    expect(root.querySelector('.header_user-avatar')).toBeDefined();
    expect(root.querySelector('.header_logout_btn')).toBeDefined();
    expect(root.querySelector('.header_login_btn')).toBeNull();
  });

  it('login button triggers onOpenAuthDialog(LOGIN)', () => {
    appStore.isAuth = false;

    new Header({
      parentNode: root,
      router,
      portal,
      onOpenAuthDialog,
      isAuth: false,
    });

    root.querySelector('.header_login_btn')!.dispatchEvent(new Event('click'));

    expect(onOpenAuthDialog).toHaveBeenCalledWith('login');
  });

  it('signup button triggers onOpenAuthDialog(REGISTER)', () => {
    appStore.isAuth = false;

    new Header({
      parentNode: root,
      router,
      portal,
      isAuth: false,
      onOpenAuthDialog,
    });

    root.querySelector('.header_signup_btn')!.dispatchEvent(new Event('click'));

    expect(onOpenAuthDialog).toHaveBeenCalledWith('register');
  });

  it('logout button triggers store.logout()', () => {
    appStore.isAuth = true;

    new Header({
      parentNode: root,
      router,
      portal,
      isAuth: true,
    });

    root.querySelector('.header_logout_btn')!.dispatchEvent(new Event('click'));

    expect(appStore.logout).toHaveBeenCalled();
  });

  it('burger button mounts burger menu into portal', () => {
    appStore.isAuth = false;

    new Header({
      parentNode: root,
      router,
      portal,
      isAuth: false,
    });

    root.querySelector('.header_burger_btn')!.dispatchEvent(new Event('click'));

    expect(portal.mount).toHaveBeenCalled();
  });

  it('AUTH_CHANGE triggers rerender()', () => {
    appStore.isAuth = false;

    new Header({
      parentNode: root,
      router,
      portal,
      isAuth: false,
    });

    appStore.isAuth = true;
    appEvents.emit(CUSTOM_EVENTS.AUTH_CHANGE, 'true');

    expect(root.querySelector('.header_logout_btn')).toBeDefined();
    expect(root.querySelector('.header_login_btn')).toBeNull();
  });
});
