import { Component } from '@components';

type HeaderProps = {
  parentNode: HTMLElement;
  isAuth: boolean;
};

export class Header extends Component {
  public isAuth: boolean = false;

  constructor({ parentNode, isAuth }: HeaderProps) {
    super({ parentNode, tagName: 'header', className: 'header', content: 'Header work' });
    this.isAuth = isAuth;
  }

  destroy(): void {
    super.destroy();
  }
}
