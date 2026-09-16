import { Component } from '@components';

export class HomePage extends Component {
  constructor(parentNode: HTMLElement) {
    super({ parentNode, tagName: 'div', className: 'home-page', content: 'Home page' });
  }
}
