import { Component } from '@components';
import appStore from '@state';
import type { CategoriesType, ComponentProps } from '@types';
import { Button } from '@ui';

export class LibraryFilters extends Component {
  store: typeof appStore;
  categoryList: CategoriesType[];
  tagList: Button[] = [];
  isDragStart = false;

  constructor({ parentNode }: Pick<ComponentProps, 'parentNode'>) {
    super({
      parentNode,
      tagName: 'section',
      className: 'library_filters',
    });

    this.store = appStore;
    this.categoryList = this.store.categories.data;

    const list = new Component({
      parentNode: this.node,
      tagName: 'ul',
      className: 'library_filters_categories',
    });

    this.categoryList.forEach(({ isDefault, label }, index) => {
      const li = new Component({
        parentNode: list.node,
        tagName: 'li',
        className: 'library_filters_categories_item',
      });

      const tagButton = new Button({
        parentNode: li.node,
        text: label,
        color: isDefault ? 'primary' : 'light',
        size: 'sm',
        corner: 'lg',
        ariaLabel: `Category: ${label}`,
      });

      tagButton.setAttributes([
        { attr: 'id', value: `${index}_${label}` },
        { attr: 'role', value: 'tab' },
        { attr: 'aria-selected', value: isDefault ? 'true' : 'false' },
        { attr: 'data-active', value: isDefault ? 'true' : 'false' },
      ]);

      tagButton.node.addEventListener('click', this.selectCategory(index));

      this.tagList.push(tagButton);
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

    this.initDragScroll(list.node);
  }

  private selectCategory = (index: number) => () => {
    this.tagList.forEach((btn, i) => {
      const isActive = i === index;

      btn.setAttributes([
        { attr: 'aria-selected', value: isActive ? 'true' : 'false' },
        { attr: 'data-active', value: isActive ? 'true' : 'false' },
      ]);

      btn.setAttributes([{ attr: 'data-color', value: isActive ? 'primary' : 'light' }]);
    });
  };

  private initDragScroll(container: HTMLElement) {
    let isDown = false;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const DRAG_THRESHOLD = 5;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      isDragging = false;
      container.classList.add('dragging');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      isDragging = false;
      container.classList.remove('dragging');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('dragging');

      setTimeout(() => {
        isDragging = false;
      }, 0);
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;

      const x = e.pageX - container.offsetLeft;
      const walk = x - startX;

      if (Math.abs(walk) > DRAG_THRESHOLD) {
        isDragging = true;
      }

      if (isDragging) {
        e.preventDefault();
        container.scrollLeft = scrollLeft - walk;
      }
    });

    container.addEventListener(
      'click',
      (e) => {
        if (isDragging) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      true,
    );
  }

  destroy() {
    this.tagList.map((el, index) =>
      el.node.removeEventListener('click', this.selectCategory(index)),
    );
    super.destroy();
  }
}
