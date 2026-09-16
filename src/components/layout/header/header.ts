import { Component } from '@components';
import { Button, Logo } from '@ui';

type HeaderProps = {
  parentNode: HTMLElement;
  isAuth: boolean;
};

export class Header extends Component {
  public isAuth: boolean = false;

  constructor({ parentNode, isAuth }: HeaderProps) {
    super({ parentNode, tagName: 'header', className: 'header' });
    this.isAuth = isAuth;

    new Logo({
      parentNode: this.node,
      withText: true,
      isTitle: true,
    });

    new Button({
      parentNode: this.node,
      text: 'Sign Up',
      size: 'sm',
      colorVariant: 'primary',
    }).node.classList.add('header_login_btn');

    new Button({
      parentNode: this.node,
      colorVariant: 'light',
      variant: 'icon',
      icon: 'BURGER',
    });
  }

  destroy(): void {
    super.destroy();
  }
}
