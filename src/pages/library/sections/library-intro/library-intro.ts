import { Component } from '@components';
import type { ComponentProps } from '@types';

export class LibraryIntro extends Component {
  constructor({ parentNode }: Pick<ComponentProps, 'parentNode'>) {
    super({
      parentNode,
      tagName: 'section',
      className: 'library_intro',
    });
    new Component({
      parentNode: this.node,
      tagName: 'h1',
      className: 'library_intro_title',
      content: 'Game Library',
    });

    new Component({
      parentNode: this.node,
      tagName: 'p',
      className: 'library_intro_text',
      content: 'Browse our collection of casual mini-games',
    });
  }
}
