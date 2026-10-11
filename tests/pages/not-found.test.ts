import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundPage } from '@pages';
import type { ComponentProps } from '@types';
import type { ButtonProps } from '@ui';
import { APP_ROUTES } from '@constants';

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

      destroy(): void {
        this.node.remove();
      }
    },
  };
});

vi.mock('@ui', async (importOriginal) => {
  const actual = await importOriginal();

  class ButtonMock {
    public node: HTMLButtonElement;

    constructor(props: ButtonProps) {
      this.node = document.createElement('button');

      if (props.text) this.node.textContent = props.text;
      if (props.className) this.node.className = props.className;
      if (props.ariaLabel) this.node.setAttribute('aria-label', props.ariaLabel);

      if (props.leftIcon) this.node.dataset.leftIcon = props.leftIcon;
      if (props.rightIcon) this.node.dataset.rightIcon = props.rightIcon;

      props.parentNode?.append(this.node);
    }

    setAttributes(attrs: { attr: string; value: string | null }[]): void {
      attrs.forEach(({ attr, value }) => {
        if (value === null) {
          this.node.removeAttribute(attr);
        } else {
          this.node.setAttribute(attr, value);
        }
      });
    }

    setText(text: string): void {
      this.node.textContent = text;
    }

    destroy(): void {
      this.node.remove();
    }
  }

  return {
    ...(actual as {}),
    Button: ButtonMock,
  };
});

describe('Page: NotFoundPage', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders title and button', () => {
    new NotFoundPage({ parentNode: root });

    expect(root.querySelector('h2')?.textContent).toBe('Page not found');
    expect(root.querySelector('button')?.textContent).toBe('Back to main');
  });

  it('calls navigate when button clicked', () => {
    const navigate = vi.fn();

    new NotFoundPage({ parentNode: root, navigate });

    const btn = root.querySelector('button')!;
    btn.click();

    expect(navigate).toHaveBeenCalledWith(APP_ROUTES.HOME);
  });
});
