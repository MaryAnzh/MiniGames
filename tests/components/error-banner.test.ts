import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ErrorBanner, type ButtonProps } from '@ui';
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

vi.mock('@ui', async (importOriginal) => {
  const actual = await importOriginal();

  class ButtonMock {
    public node: HTMLButtonElement;

    constructor(props: ButtonProps) {
      this.node = document.createElement('button');

      if (props.text) this.node.textContent = props.text;
      if (props.className) this.node.className = props.className;
      if (props.ariaLabel) this.node.setAttribute('aria-label', props.ariaLabel);

      props.parentNode?.append(this.node);
    }

    setAttributes(attrs: { attr: string; value: string | null }[]): void {
      attrs.forEach(({ attr, value }) => {
        if (value === null) this.node.removeAttribute(attr);
        else this.node.setAttribute(attr, value);
      });
    }

    setText(text: string): void {
      this.node.textContent = text;
    }

    destroy(): void {
      this.node.remove();
    }
  }

  class IconMock {
    public node: HTMLElement;

    constructor({
      parentNode,
      icon,
      className,
    }: {
      parentNode: HTMLElement;
      icon: string;
      className?: string;
    }) {
      this.node = document.createElement('span');

      // Реальное поведение Icon
      this.node.classList.add('app-icon');
      this.node.classList.add(`app-icon--${icon}`);

      if (className) {
        this.node.classList.add(className);
      }

      parentNode.append(this.node);
    }
  }

  return {
    ...(actual as {}),
    Button: ButtonMock,
    Icon: IconMock,
  };
});

describe('ErrorBanner', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders close button when onClose provided', () => {
    const onClose = vi.fn();

    new ErrorBanner({
      parentNode: root,
      message: 'Error',
      onClose,
    });

    const closeBtn = root.querySelector('[aria-label="Close button"]')!;
    expect(closeBtn).toBeDefined();

    closeBtn.dispatchEvent(new Event('click'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders retry button when onRetry provided', () => {
    const onRetry = vi.fn();

    new ErrorBanner({
      parentNode: root,
      message: 'Error',
      onRetry,
    });

    const retryBtn = root.querySelector('.app-error-banner_retry')!;
    expect(retryBtn.textContent).toBe('Retry');

    retryBtn.dispatchEvent(new Event('click'));
    expect(onRetry).toHaveBeenCalled();
  });

  it('destroy removes content and listeners', () => {
    const onRetry = vi.fn();

    const banner = new ErrorBanner({
      parentNode: root,
      message: 'Error',
      onRetry,
    });

    const retryBtn = root.querySelector('.app-error-banner_retry')!;
    expect(retryBtn).toBeDefined();

    banner.destroy();

    expect(root.querySelector('.app-error-banner_retry')).toBeNull();
    expect(root.innerHTML).toBe('');
  });
});
