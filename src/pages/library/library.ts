import { Component } from '@components';
import type { ComponentProps } from '@types';
import { LibraryIntro, LibraryFilters, LibraryCards } from './sections';

export class LibraryPage extends Component {
  constructor({ parentNode }: Pick<ComponentProps, 'parentNode'>) {
    super({
      parentNode,
      tagName: 'div',
      className: 'library',
    });

    new LibraryIntro({ parentNode: this.node });
    new LibraryFilters({ parentNode: this.node });
    new LibraryCards({ parentNode: this.node });
    // new LibraryPagination({ parentNode: this.node });
  }
}
