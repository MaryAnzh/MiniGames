import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Portal } from '@components';
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

describe('Components: Portal', () => {
  let content: HTMLElement;
  let portal: Portal;
  let onClose: any;

  beforeEach(() => {
    content = document.createElement('div');
    content.textContent = 'Content';

    portal = new Portal();
    onClose = vi.fn();
    portal.onClose = onClose;

    vi.clearAllMocks();
  });

  it('mount adds portal to document.body and sets overflow hidden', () => {
    portal.mount(content);

    expect(document.body.contains(portal.node)).toBe(true);
    expect(portal.node.querySelector('div')?.textContent).toBe('Content');
    expect(document.body.style.overflow).toBe('hidden');
    expect(portal.node.classList.contains('app_portal_open')).toBe(true);
  });

  it('unmount removes portal from DOM after timeout', () => {
    vi.useFakeTimers();

    portal.mount(content);
    portal.unmount();

    expect(portal.node.classList.contains('app_portal_open')).toBe(false);

    vi.advanceTimersByTime(300);

    expect(document.body.contains(portal.node)).toBe(false);
    expect(document.body.style.overflow).toBe('auto');

    vi.useRealTimers();
  });

  it('outside click triggers onClose', () => {
    portal.mount(content);

    const event = new Event('click');
    Object.defineProperty(event, 'target', { value: portal.node });

    portal.node.dispatchEvent(event);

    expect(onClose).toHaveBeenCalled();
  });

  it('outside click does NOT trigger onClose when locked', () => {
    portal.mount(content);
    portal.lock();

    const event = new Event('click');
    Object.defineProperty(event, 'target', { value: portal.node });

    portal.node.dispatchEvent(event);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('ESC key triggers onClose', () => {
    portal.mount(content);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(onClose).toHaveBeenCalled();
  });

  it('ESC key does NOT trigger onClose when locked', () => {
    portal.mount(content);
    portal.lock();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('lock prevents closing', () => {
    portal.mount(content);
    portal.lock();

    portal['closePortal']();

    expect(onClose).not.toHaveBeenCalled();
  });

  it('unlock allows closing', () => {
    portal.mount(content);
    portal.lock();
    portal.unlock();

    portal['closePortal']();

    expect(onClose).toHaveBeenCalled();
  });

  it('mount clears previous timeout', () => {
    vi.useFakeTimers();

    portal.mount(content);
    portal.unmount();

    expect(portal['timeout']).not.toBeNull();

    portal.mount(content);

    expect(portal['timeout']).toBeNull();

    vi.useRealTimers();
  });
});
