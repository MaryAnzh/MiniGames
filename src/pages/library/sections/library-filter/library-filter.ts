import { Component } from '@components';
import type { ComponentProps } from '@types';
import { Button } from '@ui';

export class LibraryFilters extends Component {
  private tagList: HTMLElement[] = [];

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

      const tagButton = new Button({
        parentNode: li.node,
        text: cat,
        color: index === 0 ? 'primary' : 'light',
        size: 'sm',
        corner: 'lg',
        ariaLabel: `Category: ${cat}`,
      });

      tagButton.setAttributes([
        { attr: 'role', value: 'tab' },
        { attr: 'aria-selected', value: index === 0 ? 'true' : 'false' },
      ]);

      this.tagList.push(tagButton.node);
    });

    const sortTrigger = new Button({
      parentNode: this.node,
      rightIcon: 'ARROW_DOWN',
      text: 'Sort by: Rating ↓',
      color: 'light',
      corner: 'lg',
      className: 'library_filters_sort',
      size: 'sm',
      ariaLabel: `Sort Games`,
    });
    sortTrigger.setAttributes([
      { attr: 'role', value: 'button' },
      { attr: 'aria-haspopup', value: 'listbox' },
      { attr: 'aria-expanded', value: 'false' },
      { attr: 'aria-controls', value: 'sort-menu' },
    ]);
  }
}
