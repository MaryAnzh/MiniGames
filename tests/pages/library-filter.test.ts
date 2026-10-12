import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LibraryFilters } from 'src/pages/library/sections';
import type { ComponentProps, SortTypes } from '@types';

vi.mock('@components', () => {
  return {
    Component: class ComponentMock {
      public node: HTMLElement;
      constructor(props: ComponentProps) {
        const tag = props.tagName ?? 'div';
        this.node = document.createElement(tag);
        if (props.className) {
          this.node.className = Array.isArray(props.className)
            ? props.className.join(' ')
            : props.className;
        }
        if (props.content) {
          this.node.textContent = String(props.content);
        }
        props.parentNode?.append(this.node);
      }
      setAttributes(attrs: { attr: string; value: string }[]) {
        attrs.forEach(({ attr, value }) => this.node.setAttribute(attr, value));
      }
      destroy() {
        this.node.remove();
      }
    },
  };
});

vi.mock('@ui', () => {
  return {
    Button: class {
      public node: HTMLButtonElement;
      constructor({
        parentNode,
        text,
        ariaLabel,
      }: {
        parentNode: HTMLElement;
        text?: string;
        ariaLabel?: string;
      }) {
        this.node = document.createElement('button');
        this.node.textContent = text ?? '';
        if (ariaLabel) this.node.setAttribute('aria-label', ariaLabel);
        parentNode.append(this.node);
      }
      setAttributes(attrs: { attr: string; value: string }[]) {
        attrs.forEach(({ attr, value }) => this.node.setAttribute(attr, value));
      }
      destroy() {
        this.node.remove();
      }
    },
    Select: class {
      public node: HTMLSelectElement;
      constructor({
        parentNode,
        list,
        onChange,
      }: {
        parentNode: HTMLElement;
        list: { value: string; label: string }[];
        onChange: (e: string) => void;
      }) {
        this.node = document.createElement('select');
        list.forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          this.node.append(option);
        });
        this.node.onchange = (e: Event) => {
          const target = e.target as HTMLSelectElement | null;
          if (target) {
            const t = target.value;
            onChange(t);
          }
        };
        parentNode.append(this.node);
      }
    },
  };
});

vi.mock('@utils', () => {
  return {
    arrayFromNumber: (n: number) => Array.from({ length: n }, (_, i) => i),
  };
});

describe('LibraryFilters', () => {
  let root: HTMLElement;
  let onCategoryChange: (value: string) => void;
  let onSortChange: (value: SortTypes) => void;

  beforeEach(() => {
    root = document.createElement('div');
    onCategoryChange = vi.fn();
    onSortChange = vi.fn();
    vi.clearAllMocks();
  });

  it('renders skeleton chips when no categories provided', () => {
    new LibraryFilters({
      parentNode: root,
      categories: [],
      onCategoryChange,
      onSortChange,
    });
    const chips = root.querySelectorAll('.library_filters_categories_item');
    expect(chips.length).toBeGreaterThan(0);
    const btn = chips[0].querySelector('button');
    expect(btn).not.toBeNull();
  });

  it('updates categories correctly', () => {
    const lf = new LibraryFilters({
      parentNode: root,
      categories: [{ label: 'Old', slug: 'old', isDefault: true }],
      onCategoryChange,
      onSortChange,
    });
    lf.updateCategories([
      { label: 'New', slug: 'new', isDefault: false },
      { label: 'Another', slug: 'another', isDefault: true },
    ]);
    const buttons = [...root.querySelectorAll('button')];
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe('New');
    expect(buttons[1].textContent).toBe('Another');
  });

  it('renders sort select and triggers onSortChange', () => {
    new LibraryFilters({
      parentNode: root,
      categories: [],
      onCategoryChange,
      onSortChange,
    });
    const select = root.querySelector('select')!;
    const firstOption = select.querySelector('option')!;
    select.value = firstOption.value;
    select.dispatchEvent(new Event('change'));
    expect(onSortChange).toHaveBeenCalledWith(firstOption.value);
  });

  it('handles drag scroll events', () => {
    new LibraryFilters({
      parentNode: root,
      categories: [],
      onCategoryChange,
      onSortChange,
    });
    const container = root.querySelector('.library_filters_categories')!;
    container.dispatchEvent(new MouseEvent('mousedown'));
    expect(container.classList.contains('dragging')).toBe(true);
    container.dispatchEvent(new MouseEvent('mouseup'));
    expect(container.classList.contains('dragging')).toBe(false);
  });

  it('destroy clears event listeners', () => {
    const lf = new LibraryFilters({
      parentNode: root,
      categories: [{ label: 'Test', slug: 'test', isDefault: true }],
      onCategoryChange,
      onSortChange,
    });
    lf.destroy();
    expect(root.innerHTML).toBe('');
  });
});
