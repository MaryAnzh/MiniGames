import type { Router } from '@route';

import { Component, Portal } from '@components';
import { BurgerMenu, Button, Logo, Navigate } from '@ui';
import type { AuthTabType } from '@types';
import { LIGHT, LOGIN, REGISTER } from '@constants';

type HeaderProps = {
  parentNode: HTMLElement | null;
  isAuth: boolean;
  router: Router;
  portal: Portal;
  onOpenAuthDialog?: (tag: AuthTabType) => void;
};

export class Header extends Component {
  private burgerMenu: BurgerMenu;
  private burgerBtn: Component;
  private portal: Portal;
  private onOpenAuthDialog?: (tag: AuthTabType) => void;

  public isAuth: boolean = false;
  private handleOpen: () => void;

  constructor({ parentNode, isAuth, router, onOpenAuthDialog, portal }: HeaderProps) {
    super({ parentNode, tagName: 'header', className: 'header' });
    this.isAuth = isAuth;
    this.portal = portal;
    this.onOpenAuthDialog = onOpenAuthDialog;

    /** BRAND */
    new Logo({
      parentNode: this.node,
      withText: true,
      isTitle: true,
    });

    /** NAVIGATION */
    new Navigate({
      parentNode: this.node,
      className: 'header_nav',
      router,
    });

    /** LOGIN BUTTON */
    const loginButton = new Button({
      parentNode: this.node,
      className: 'header_login_btn',
      text: 'Log In',
      response: 'md',
      color: LIGHT,
    });
    loginButton.node.onclick = () => onOpenAuthDialog?.(LOGIN);

    /** SIGNUP BUTTON */
    const signinButton = new Button({
      parentNode: this.node,
      className: 'header_signup_btn',
      text: 'Sign Up',
      response: 'md',
      color: 'primary',
    });
    signinButton.node.onclick = () => onOpenAuthDialog?.(REGISTER);

    /** BURGER MENU */
    this.burgerMenu = new BurgerMenu({
      parentNode: null,
      router,
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

    this.handleOpen = () => portal.mount(this.burgerMenu.node, this.burgerMenu);
    this.burgerBtn.node.onclick = this.handleOpen;
  }

  destroy(): void {
    this.burgerBtn.node.removeEventListener('click', this.handleOpen);
    super.destroy();
  }
}
