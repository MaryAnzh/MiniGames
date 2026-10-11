import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Skeleton } from 'src/components/ui/skeleton/skeleton';
import type { ComponentProps } from '@types';
import { SkeletonText } from '@ui';

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

        if (props.attrs) {
          props.attrs.forEach(({ attr, value }) => {
            this.node.setAttribute(attr, String(value));
          });
        }

        if (props.content) {
          this.node.textContent = String(props.content);
        }

        props.parentNode?.append(this.node);
      }

      setAttributes(attrs: { attr: string; value: string | null }[]): void {
        attrs.forEach(({ attr, value }) => {
          if (value === null) this.node.removeAttribute(attr);
          else this.node.setAttribute(attr, value);
        });
      }

      destroy(): void {
        this.node.remove();
      }
    },
  };
});

describe('Skeleton', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders base skeleton class', () => {
    new Skeleton({
      parentNode: root,
      className: 'test-skeleton',
    });

    const el = root.querySelector('.app-skeleton')!;
    expect(el).toBeDefined();
    expect(el.classList.contains('test-skeleton')).toBe(true);
  });

  it('applies color variant', () => {
    new Skeleton({
      parentNode: root,
      color: 'dark',
      className: 'test-skeleton',
    });

    const el = root.querySelector('.app-skeleton')!;
    expect(el.getAttribute('data-color')).toBe('dark');
  });

  it('does not include width/height when not provided', () => {
    new Skeleton({
      parentNode: root,
      className: 'test-skeleton',
    });

    const el = root.querySelector('.app-skeleton')!;
    const style = el.getAttribute('style');

    expect(style).toBeNull();
  });
});

describe('SkeletonText', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders single skeleton item when rows=1 and columns=1', () => {
    new SkeletonText({
      parentNode: root,
      rows: 1,
      columns: 1,
      color: 'light',
      className: 'test-skeleton-text',
    });

    const wrapper = root.querySelector('.app-skeleton-text')!;
    expect(wrapper.classList.contains('app-skeleton-text_one')).toBe(true);
    expect(wrapper.classList.contains('test-skeleton-text')).toBe(true);

    const item = root.querySelector('.app-skeleton-text_skeleton')!;
    expect(item).toBeDefined();
    expect(item.getAttribute('data-color')).toBe('light');

    const rows = root.querySelectorAll('.app-skeleton-text_row');
    expect(rows.length).toBe(0);
  });

  it('renders multiple rows and columns', () => {
    new SkeletonText({
      parentNode: root,
      rows: 3,
      columns: 2,
      color: 'dark',
      variant: 'multi',
    });

    const wrapper = root.querySelector('.app-skeleton-text')!;
    expect(wrapper.classList.contains('app-skeleton-text_multi')).toBe(true);

    const rows = root.querySelectorAll('.app-skeleton-text_row');
    expect(rows.length).toBe(3);

    const items = root.querySelectorAll('.app-skeleton-text_skeleton');
    expect(items.length).toBe(3 * 2);

    items.forEach((item) => {
      expect(item.getAttribute('data-color')).toBe('dark');
    });
  });

  it('applies custom className', () => {
    new SkeletonText({
      parentNode: root,
      className: 'custom-text',
    });

    const wrapper = root.querySelector('.app-skeleton-text')!;
    expect(wrapper.classList.contains('custom-text')).toBe(true);
  });
});
