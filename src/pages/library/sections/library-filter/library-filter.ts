import { Component } from '@components';
import { CENTER, RATING_DESC } from '@constants';
import type { CategoryType, ComponentProps, SortTypes } from '@types';
import { Button, Select } from '@ui';
import { CHIPS_COUNT, LOADING_CHIP, SORT_OPTIONS } from './constants';
import { arrayFromNumber } from '@utils';

type LibraryFiltersProps = Pick<ComponentProps, 'parentNode'> & {
  categories: CategoryType[];
  onCategoryChange: (value: string) => void;
  onSortChange: (value: SortTypes) => void;
};

export class LibraryFilters extends Component {
  categoriesData: CategoryType[];
  categoriesNode: Component[] = [];
  currentSot: SortTypes = RATING_DESC;
  categoriesWrapNode: Component | null = null;
  isDragStart = false;

  //callbacks
  private onCategoryChange: (value: string) => void;
  private onSortChange: (value: SortTypes) => void;

  constructor({ parentNode, categories, onCategoryChange, onSortChange }: LibraryFiltersProps) {
    super({
      parentNode,
      tagName: 'section',
      className: 'library_filters',
    });
    this.categoriesData = categories;
    this.onCategoryChange = onCategoryChange;
    this.onSortChange = onSortChange;

    this.renderCategories();
    this.renderSort();
  }

  private renderCategories() {
    this.categoriesWrapNode = new Component({
      parentNode: this.node,
      tagName: 'ul',
      className: 'library_filters_categories',
    });
    const node = this.categoriesWrapNode;
    if (node) {
      arrayFromNumber(CHIPS_COUNT).forEach((el) => this.renderChip(node.node, LOADING_CHIP, el));
    }
    this.initDragScroll(this.categoriesWrapNode.node);
  }

  renderChip(node: HTMLElement, category: CategoryType, index: number) {
    const isSkeleton = this.categoriesData.length === 0;

    const li = new Component({
      parentNode: node,
      tagName: 'li',
      className: 'library_filters_categories_item',
    });

    const tagButton = new Button({
      parentNode: li.node,
      text: category.label,
      color: category.isDefault ? 'primary' : 'light',
      size: 'sm',
      corner: 'lg',
      ariaLabel: `Category: ${category.label}`,
      variant: isSkeleton ? 'skeleton' : undefined,
    });
    if (!isSkeleton) {
      tagButton.setAttributes([
        { attr: 'id', value: `${index}_${category.label}` },
        { attr: 'role', value: 'tab' },
        { attr: 'aria-selected', value: category.isDefault ? 'true' : 'false' },
        { attr: 'data-active', value: category.isDefault ? 'true' : 'false' },
      ]);
      tagButton.node.onclick = this.selectCategory(index, category.slug);
    }

    this.categoriesNode.push(tagButton);
  }

  private renderSort() {
    const sortWrap = new Component({
      parentNode: this.node,
      className: 'library_filters_sort',
    });

    new Select({
      parentNode: sortWrap.node,
      align: CENTER,
      list: SORT_OPTIONS,
      onChange: (value: SortTypes) => {
        this.currentSot = value as SortTypes;
        this.onSortChange(value);
      },
    });
  }

  private selectCategory = (index: number, value: string) => () => {
    this.categoriesNode.forEach((btn, i) => {
      const isActive = i === index;

      btn.setAttributes([
        { attr: 'aria-selected', value: isActive ? 'true' : 'false' },
        { attr: 'data-active', value: isActive ? 'true' : 'false' },
        { attr: 'data-color', value: isActive ? 'primary' : 'light' },
      ]);
    });

    this.onCategoryChange(value);
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

  public updateCategories(categories: CategoryType[]) {
    this.categoriesData = categories;
    const list = this.categoriesWrapNode;
    if (list) {
      this.categoriesNode.forEach((el) => {
        el.node.onclick = null;
        el.destroy();
      });
      this.categoriesNode = [];
      list.node.innerHTML = '';
      categories.forEach((el, i) => {
        this.renderChip(list.node, el, i);
      });
    }
  }

  destroy() {
    this.categoriesNode.map((el) => {
      el.node.onclick = null;
    });
    super.destroy();
  }
}
