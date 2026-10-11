import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SnackbarPortal } from '@components';
import type { ComponentProps } from '@types';
import type { SnackbarProps } from '@ui';

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
        attrs.forEach((a) => this.node.setAttribute(a.attr, a.value as string));
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

  class SnackbarMock {
    node: HTMLElement;
    inner: HTMLElement;
    onClose?: () => void;

    constructor({ parentNode, message, type, onClose }: SnackbarProps) {
      this.node = document.createElement('div');
      this.node.className = 'snackbar-root';

      this.inner = document.createElement('div');
      this.inner.className = `snackbar snackbar-${type}`;
      this.inner.textContent = message;

      this.onClose = onClose;

      this.node.appendChild(this.inner);
      parentNode?.append(this.node);
    }

    destroy() {
      this.node.remove();
    }
  }

  return {
    ...(actual as {}),
    Snackbar: SnackbarMock,
  };
});

describe('Components: SnackbarPortal', () => {
  let portal: SnackbarPortal;

  beforeEach(() => {
    portal = new SnackbarPortal();
    vi.clearAllMocks();
  });

  it('show() mounts portal into document.body', () => {
    portal.show('Hello', 'success');

    expect(document.body.contains(portal.node)).toBe(true);
    expect(portal.node.querySelector('.snackbar')).toBeDefined();
  });

  it('show() add text content', () => {
    portal.show('Hello', 'success');

    const content = portal.node.lastChild?.textContent ?? '';
    expect(content.trim()).toBe('Hello');
  });

  it('show() sets auto-remove timer', () => {
    vi.useFakeTimers();

    portal.show('Auto remove', 'info');

    expect(portal['snacks'][0].timer).toBeDefined();

    vi.advanceTimersByTime(5000);

    expect(portal.node.querySelector('.snackbar')).toBeNull();

    vi.useRealTimers();
  });

  it('remove() destroys snackbar and removes portal when empty', () => {
    vi.useFakeTimers();

    portal.show('Test', 'success');

    const snack = portal['snacks'][0].snack;

    portal['remove'](snack);

    snack.node.dispatchEvent(new Event('transitionend'));

    expect(portal.node.querySelector('.snackbar')).toBeNull();
    expect(document.body.contains(portal.node)).toBe(false);

    vi.useRealTimers();
  });

  it('animateOut triggers callback after transitionend', () => {
    const cb = vi.fn();
    const node = document.createElement('div');

    portal['animateOut'](node, cb);

    expect(node.classList.contains('snackbar--out')).toBe(true);

    node.dispatchEvent(new Event('transitionend'));

    expect(cb).toHaveBeenCalled();
  });
});
