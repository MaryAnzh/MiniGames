import { Component } from '@components';
import type { ComponentProps } from '@types';
import { Button } from '@ui';

export class LibraryFilters extends Component {
  constructor({ parentNode }: Pick<ComponentProps, 'parentNode'>) {
    super({
      parentNode,
      tagName: 'section',
      className: 'library_filters',
    });

    const categories = ['All Games', 'Puzzle', 'Card', 'Match', 'Farm', 'Strategy', 'Arcade'];

    const list = new Component({
      parentNode: this.node,
      tagName: 'ul',
      className: 'library_filters_categories',
    });

    categories.forEach((cat, index) => {
      const li = new Component({
        parentNode: list.node,
        tagName: 'li',
        className: 'library_filters_categories_item',
      });

      new Button({
        parentNode: li.node,
        text: cat,
        color: index === 0 ? 'primary' : 'light',
        size: 'sm',
        corner: 'lg',
      });
    });

    //const sortButton =
    new Button({
      parentNode: this.node,
      rightIcon: 'ARROW_DOWN',
      text: 'Sort by: Rating ↓',
      color: 'light',
      corner: 'lg',
      className: 'library_filters_sort',
      size: 'sm',
    });
  }
}
