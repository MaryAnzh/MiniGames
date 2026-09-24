import { Component } from '@components';
import { LEFT, SORT_GAMES } from '@constants';
import type { AlignType, ComponentProps } from '@types';
import { Button } from '@ui';

type SelectItem = {
  label: string;
  value: string;
  selected?: boolean;
};

type SelectProps = Pick<ComponentProps, 'parentNode'> & {
  list: SelectItem[];
  align?: AlignType;
};

export class Select extends Component {
  private list: SelectItem[];
  private align: AlignType;
  private trigger: Button;
  private popup: Component;
  private isOpen = false;

  private outsideHandler = (e: MouseEvent) => {
    if (!this.node.contains(e.target as Node)) {
      this.close();
    }
  };

  constructor({ parentNode, list, align = LEFT }: SelectProps) {
    super({
      parentNode,
      tagName: 'div',
      className: 'app-select',
    });

    this.list = list;
    this.align = align;

    const selectedLabel = this.list.find((i) => i.selected)?.label;
    const text = this.setSortTitle(selectedLabel);

    this.trigger = new Button({
      parentNode: this.node,
      className: 'app-select-trigger',
      rightIcon: 'ARROW_DOWN',
      text,
      color: 'light',
      corner: 'lg',
      size: 'sm',
      ariaLabel: SORT_GAMES,
      fullWidth: true,
    });

    this.trigger.setAttributes([
      { attr: 'role', value: 'button' },
      { attr: 'aria-haspopup', value: 'listbox' },
      { attr: 'aria-expanded', value: 'false' },
      { attr: 'aria-controls', value: 'sort-menu' },
    ]);

    this.trigger.node.addEventListener('click', () => this.toggle());

    this.popup = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'app-select_popup',
      attrs: [
        { attr: 'id', value: 'sort-menu' },
        { attr: 'data-align', value: this.align },
      ],
    });

    this.renderList();
    this.close();
    this.initOutsideClick();
  }

  private setSortTitle(title: string | undefined) {
    return `Sort by: ${title ?? ''}`;
  }

  private renderList() {
    this.popup.node.innerHTML = '';

    this.list.forEach(({ label, value, selected }) => {
      const row = new Button({
        parentNode: this.popup.node,
        variant: 'empty',
        color: 'light',
        className: 'app-select_popup_item',
        text: label,
        leftIcon: selected ? 'CHECKED' : undefined,
      });

      row.setAttributes([
        { attr: 'role', value: 'option' },
        { attr: 'aria-selected', value: selected ? 'true' : 'false' },
      ]);

      row.node.addEventListener('click', () => {
        this.select(value);
      });
    });
  }

  private toggle() {
    this.isOpen ? this.close() : this.open();
  }

  private open() {
    this.isOpen = true;
    this.trigger.node.setAttribute('aria-expanded', 'true');
    this.trigger.node.classList.add('app-select-trigger--open');
    this.popup.node.classList.add('app-select_popup--open');
  }

  private close() {
    this.isOpen = false;
    this.trigger.node.setAttribute('aria-expanded', 'false');
    this.trigger.node.classList.remove('app-select-trigger--open');
    this.popup.node.classList.remove('app-select_popup--open');
  }

  private select(value: string) {
    this.list = this.list.map((i) => ({
      ...i,
      selected: i.value === value,
    }));

    const selected = this.list.find((i) => i.selected);
    this.trigger.setText(this.setSortTitle(selected?.label));

    this.renderList();
    this.close();
  }

  private initOutsideClick() {
    document.addEventListener('click', this.outsideHandler);
  }

  destroy() {
    document.removeEventListener('click', this.outsideHandler);
    super.destroy();
  }
}
