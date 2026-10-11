import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Snackbar } from '@ui';
import type { ComponentProps } from '@types';

vi.mock('@components', async (importOriginal) => {
  const actual = await importOriginal();

  class ComponentMock {
    node: HTMLElement;

    constructor({ parentNode, tagName = 'div', className, attrs, content }: ComponentProps) {
      this.node = document.createElement(tagName ?? 'div');

      if (className) {
        this.node.className = Array.isArray(className) ? className.join(' ') : className;
      }

      if (attrs) {
        attrs.forEach((a: any) => this.node.setAttribute(a.attr, a.value));
      }

      if (content) {
        this.node.textContent = content as string;
      }

      parentNode?.append(this.node);
    }

    destroy() {
      this.node.remove();
    }
  }

  return {
    ...(actual as {}),
    Component: ComponentMock,
  };
});

vi.mock('@ui', async (importOriginal) => {
  const actual = await importOriginal();

  class IconMock {
    node = document.createElement('span');
    constructor({ parentNode, icon, className }: any) {
      this.node.className = className ?? '';
      this.node.setAttribute('data-icon', icon);
      parentNode?.append(this.node);
    }
  }

  class ButtonMock {
    node = document.createElement('button');
    constructor({ parentNode, leftIcon, className, ariaLabel }: any) {
      this.node.className = className ?? '';
      this.node.setAttribute('data-left-icon', leftIcon ?? '');
      if (ariaLabel) this.node.setAttribute('aria-label', ariaLabel);
      parentNode?.append(this.node);
    }
    destroy() {
      this.node.remove();
    }
  }

  return {
    ...(actual as {}),
    Icon: IconMock,
    Button: ButtonMock,
  };
});

describe('Snackbar', () => {
  let root: HTMLElement;
  let onClose: any;

  beforeEach(() => {
    root = document.createElement('div');
    onClose = vi.fn();
    vi.clearAllMocks();
  });

  it('renders snackbar with correct message and type', () => {
    new Snackbar({
      parentNode: root,
      message: 'Hello Snackbar',
      type: 'success',
      onClose,
    });

    const snackbar = root.querySelector('.app-snackbar')!;
    expect(snackbar).toBeDefined();
    expect(snackbar.getAttribute('data-type')).toBe('success');

    const text = root.querySelector('.app-snackbar_text')!;
    expect(text.textContent).toBe('Hello Snackbar');
  });

  it('renders icon with correct type', () => {
    new Snackbar({
      parentNode: root,
      message: 'Test',
      type: 'error',
      onClose,
    });

    const icon = root.querySelector('[data-icon="error"]');
    expect(icon).toBeDefined();
  });

  it('renders close button', () => {
    new Snackbar({
      parentNode: root,
      message: 'Test',
      type: 'info',
      onClose,
    });

    const btn = root.querySelector('.app-snackbar_close-btn');
    expect(btn).toBeDefined();
    expect(btn?.getAttribute('aria-label')).toBe('Close Snackbar');
  });

  it('clicking close button triggers onClose', () => {
    new Snackbar({
      parentNode: root,
      message: 'Click me',
      type: 'info',
      onClose,
    });

    const btn = root.querySelector('.app-snackbar_close-btn')!;
    btn.dispatchEvent(new Event('click'));

    expect(onClose).toHaveBeenCalled();
  });

  it('destroy() removes snackbar from DOM', () => {
    const snackbar = new Snackbar({
      parentNode: root,
      message: 'Destroy me',
      type: 'info',
      onClose,
    });

    expect(root.querySelector('.app-snackbar')).toBeDefined();

    snackbar.destroy();

    expect(root.querySelector('.app-snackbar')).toBeNull();
  });
});
