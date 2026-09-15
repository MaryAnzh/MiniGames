import { Component } from '@components';
import { Header } from '@components';
import appStore from 'src/state/state';

export class HomePage extends Component {
  private store = appStore;

  protected isAuth: boolean;
  header: Header;

  constructor(parentNode: HTMLElement) {
    super({ parentNode, tagName: 'div', className: 'home-page' });
    this.isAuth = this.store.isAuth;

    this.header = new Header({ parentNode: this.node, isAuth: this.isAuth });
  }
}
