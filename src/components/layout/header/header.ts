import type { Router } from '@route';

import { Component, Portal } from '@components';
import { BurgerMenu, Button, Logo, Navigate } from '@ui';
import type { AuthTabType } from '@types';
import { CUSTOM_EVENTS, LIGHT, LOGIN, REGISTER } from '@constants';
import { appEvents } from '@utils';
import { appStore } from '@store';
import { Avatar } from 'src/components/ui/avatar/avatar';

type HeaderProps = {
  parentNode: HTMLElement | null;
  isAuth: boolean;
  router: Router;
  portal: Portal;
  onOpenAuthDialog?: (tag: AuthTabType) => void;
};

export class Header extends Component {
  private children: Component[] = [];
  private store: typeof appStore;
  private portal: Portal;
  private router!: Router;

  private burgerMenu!: BurgerMenu;
  private burgerBtn!: Component;
  private loginBtn!: Button;
  private signinBtn!: Button;
  private logoutBtn!: Button;

  private onOpenAuthDialog?: (tag: AuthTabType) => void;
  private handleOpen!: () => void;

  public isAuth: boolean;

  constructor({ parentNode, router, onOpenAuthDialog, portal }: HeaderProps) {
    super({ parentNode, tagName: 'header', className: 'header' });
    this.store = appStore;

    this.isAuth = this.store.isAuth;
    this.router = router;
    this.portal = portal;
    this.onOpenAuthDialog = onOpenAuthDialog;

    appEvents.on(CUSTOM_EVENTS.AUTH_CHANGE, (value) => {
      const next = value === 'true';

      if (this.isAuth === next) return;

      this.isAuth = next;
      this.rerender();
    });

    this.render();
  }

  rerender() {
    this.removeListeners();
    this.node.innerHTML = '';
    this.render();
  }

  render() {
    /** BRAND */
    const logo = new Logo({
      parentNode: this.node,
      withText: true,
      isTitle: true,
    });
    this.children.push(logo);

    /** NAVIGATION */
    const nav = new Navigate({
      parentNode: this.node,
      className: 'header_nav',
      router: this.router,
    });
    this.children.push(nav);

    if (this.isAuth) {
      const avatar = new Avatar({
        parentNode: this.node,
        email: this.store.userEmail,
        username: this.store.username,
        avatarUrl: this.store.photoURL,
        className: 'header_user-avatar',
      });
      this.children.push(avatar);

      this.logoutBtn = new Button({
        parentNode: this.node,
        className: 'header_logout_btn',
        text: 'Logout',
        response: 'md',
        color: LIGHT,
      });
      this.logoutBtn.node.onclick = () => this.store.logout();
    } else {
      /** LOGIN BUTTON */
      this.loginBtn = new Button({
        parentNode: this.node,
        className: 'header_login_btn',
        text: 'Log In',
        response: 'md',
        color: LIGHT,
      });
      this.loginBtn.node.onclick = () => this.onOpenAuthDialog?.(LOGIN);

      /** SIGNUP BUTTON */
      this.signinBtn = new Button({
        parentNode: this.node,
        className: 'header_signup_btn',
        text: 'Sign Up',
        response: 'md',
        color: 'primary',
      });
      this.signinBtn.node.onclick = () => this.onOpenAuthDialog?.(REGISTER);
    }
    /** BURGER MENU */
    this.burgerMenu = new BurgerMenu({
      parentNode: null,
      router: this.router,
      isAuth: this.isAuth,
      onClose: () => this.portal.unmount(),
      onOpenAuth: (tab: AuthTabType) => {
        this.onOpenAuthDialog?.(tab);
        this.portal.unmount();
      },
    });

    this.burgerBtn = new Button({
      parentNode: this.node,
      color: 'light',
      leftIcon: 'burger',
      size: 'icon-md',
      className: 'header_burger_btn',
    });

    this.handleOpen = () => this.portal.mount(this.burgerMenu.node, this.burgerMenu);
    this.burgerBtn.node.onclick = this.handleOpen;
    this.children.push(logo, this.loginBtn, this.burgerBtn, this.signinBtn, this.burgerMenu);
  }

  removeListeners = () => {
    this.children.filter(Boolean).forEach((node) => node.removeOnclick());
  };

  destroy(): void {
    this.removeListeners();
    this.children.forEach((el) => el && el.destroy());
    super.destroy();
  }
}
