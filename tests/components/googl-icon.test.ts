import type { ComponentProps } from '@types';

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

      destroy(): void {
        this.node.remove();
      }
    },
  };
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GoogleIcon } from 'src/components/ui/google-icon/google-icon';

describe('GoogleIcon', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders correct classes and content', () => {
    new GoogleIcon({
      parentNode: root,
      iconName: 'close',
      iconClass: 'custom-class',
    });

    const el = root.querySelector('span')!;
    expect(el).toBeDefined();

    expect(el.classList.contains('google-icons')).toBe(true);
    expect(el.classList.contains('material-symbols-outlined')).toBe(true);
    expect(el.classList.contains('custom-class')).toBe(true);

    expect(el.textContent).toBe('close');
  });

  it('renders without custom class', () => {
    new GoogleIcon({
      parentNode: root,
      iconName: 'menu',
    });

    const el = root.querySelector('span')!;
    expect(el).toBeDefined();

    expect(el.classList.contains('google-icons')).toBe(true);
    expect(el.classList.contains('material-symbols-outlined')).toBe(true);

    expect(el.classList.contains('')).toBe(false);

    expect(el.textContent).toBe('menu');
  });
});
