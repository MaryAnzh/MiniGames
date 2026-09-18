import { Component } from '@components';
import type { Router } from '@route';
import { Button, Logo, Navigate } from '@ui';

type HeaderProps = {
  parentNode: HTMLElement | null;
  isAuth: boolean;
  router: Router;
};

export class Header extends Component {
  public isAuth: boolean = false;

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

    new Button({
      parentNode: this.node,
      colorVariant: 'light',
      variant: 'icon',
      icon: 'BURGER',
    }).node.classList.add('header_burger_btn');
  }

  destroy(): void {
    super.destroy();
  }
}
