import type { Router } from '@route';

import { Component, Portal } from '@components';
import { BurgerMenu, Button, Logo, Navigate } from '@ui';

type HeaderProps = {
  parentNode: HTMLElement | null;
  isAuth: boolean;
  router: Router;
};

export class Header extends Component {
  private portal: Portal;
  private burgerMenu: BurgerMenu;
  private burgerBtn: Component;

  public isAuth: boolean = false;
  private handleOpen: () => void;

  constructor({ parentNode, isAuth, router }: HeaderProps) {
    super({ parentNode, tagName: 'header', className: 'header' });
    this.isAuth = isAuth;

    new Logo({
      parentNode: this.node,
      withText: true,
      isTitle: true,
    });

    new Navigate({
      parentNode: this.node,
      className: 'header_nav',
      router,
    });

    new Button({
      parentNode: this.node,
      className: 'header_login_btn',
      text: 'Log In',
      size: 'md',
      colorVariant: 'light',
    });

    new Button({
      parentNode: this.node,
      className: 'header_signup_btn',
      text: 'Sign Up',
      size: 'md',
      colorVariant: 'primary',
    });

    /** BURGER */
    this.portal = new Portal({});

    this.burgerMenu = new BurgerMenu({
      parentNode: this.portal.node,
      isAuth: this.isAuth,
      onClose: () => this.portal.unmount(),
    });

    this.burgerBtn = new Button({
      parentNode: this.node,
      colorVariant: 'light',
      variant: 'icon',
      icon: 'BURGER',
      className: 'header_burger_btn',
    });

    this.handleOpen = () => this.portal.mount(this.burgerMenu.node);
    this.burgerBtn.node.addEventListener('click', this.handleOpen);
  }

  destroy(): void {
    this.burgerBtn.node.removeEventListener('click', this.handleOpen);

    super.destroy();
  }
}
