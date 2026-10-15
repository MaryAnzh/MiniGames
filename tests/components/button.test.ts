import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Button, type GoogleIconProps, type SkeletonProps, type SpinnerProps } from '@ui';
import type { ComponentProps } from '@types';

vi.mock('@components', async (importOriginal) => {
  const actual = await importOriginal();

  class ComponentMock {
    node: HTMLElement;

    constructor({ parentNode, tagName = 'button', className, attrs, content }: ComponentProps) {
      this.node = document.createElement(tagName ?? 'button');
      if (className)
        this.node.className = Array.isArray(className) ? className.join(' ') : className;
      if (attrs) attrs.forEach((a) => this.node.setAttribute(a.attr, a.value as string));
      if (content && this.node) {
        this.node.textContent = content as string;
      }
      parentNode?.append(this.node);
    }

    setContent(text: string) {
      this.node.textContent = text;
    }

    setAttributes(attrs: { attr: string; value: string | null }[]) {
      attrs.forEach((a) => {
        if (a.value === null) {
          this.node.removeAttribute(a.attr);
        } else {
          this.node.setAttribute(a.attr, a.value);
        }
      });
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

  class GoogleIcon {
    node = document.createElement('span');
    constructor({ parentNode, iconName }: GoogleIconProps) {
      this.node.setAttribute('data-google-icon', iconName);
      parentNode?.append(this.node);
    }
    destroy() {
      this.node.remove();
    }
  }

  class Skeleton {
    node = document.createElement('span');
    constructor({ parentNode }: SkeletonProps) {
      this.node.className = 'skeleton';
      parentNode?.append(this.node);
    }
  }
  class Spinner {
    node = document.createElement('span');
    constructor({ parentNode }: SpinnerProps) {
      this.node.className = 'spinner';
      parentNode?.append(this.node);
    }
    destroy() {
      this.node.remove();
    }
  }

  return {
    ...(actual as {}),
    GoogleIcon,
    Skeleton,
    Spinner,
  };
});

/* ICON_PICKER MOCK */
vi.mock('@constants', async (importOriginal) => {
  const actual = await importOriginal();
  const ICON_PICKER = {
    info: '<svg class="svg-info"></svg>',
    arrow_right: '<svg class="svg-arrow_right"></svg>',
    arrow_down: '<svg class="svg-arrow_down"></svg>',
  };
  const APP_ROUTES = {};

  return {
    ...(actual as {}),
    ICON_PICKER,
    APP_ROUTES,
  };
});

describe('Button component', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders button with text', () => {
    new Button({ parentNode: root, text: 'Click me' });

    const btn = root.querySelector('button');
    expect(btn).not.toBeNull();

    const textNode = root.querySelector('.app_button_text');
    expect(textNode?.textContent).toBe('Click me');
  });

  it('renders left icon', () => {
    new Button({ parentNode: root, leftIcon: 'info', text: 'Add' });

    expect(root.querySelector('.svg-info')).not.toBeNull();
    expect(root.querySelector('.app_button_text')?.textContent).toBe('Add');
  });

  it('renders right icon', () => {
    new Button({ parentNode: root, rightIcon: 'arrow_right' });

    expect(root.querySelector('.svg-arrow_right')).not.toBeNull();
  });

  it('renders google icon', () => {
    new Button({ parentNode: root, googleIcon: 'google' });

    expect(root.querySelector('[data-google-icon="google"]')).toBeDefined();
  });

  it('renders skeleton variant', () => {
    new Button({ parentNode: root, variant: 'skeleton' });

    expect(root.querySelector('.skeleton')).toBeDefined();
  });

  it('setText updates textNode', () => {
    const btn = new Button({ parentNode: root, text: 'Old' });

    btn.setText('New');

    expect(root.querySelector('.app_button_text')?.textContent).toBe('New');
  });

  it('setColor updates data-color attribute', () => {
    const btn = new Button({ parentNode: root });

    btn.setColor('primary');

    expect(root.querySelector('button')?.getAttribute('data-color')).toBe('primary');
  });

  it('setDisabled toggles disabled attribute', () => {
    const btn = new Button({ parentNode: root });

    btn.setDisabled(true);
    expect(root.querySelector('button')?.getAttribute('disabled')).toBe('true');

    btn.setDisabled(false);
    expect(root.querySelector('button')?.hasAttribute('disabled')).toBe(false);
  });

  it('setGoogleIcon replaces previous google icon', () => {
    const btn = new Button({ parentNode: root, googleIcon: 'google' });

    btn.setGoogleIcon('mail');

    expect(root.querySelector('[data-google-icon="google"]')).toBeNull();
    expect(root.querySelector('[data-google-icon="mail"]')).toBeDefined();
  });

  it('setLoading(true) adds spinner and disables button', () => {
    const btn = new Button({ parentNode: root, text: 'Submit' });

    btn.setLoading(true);

    expect(root.querySelector('.spinner')).toBeDefined();
    expect(root.querySelector('button')?.getAttribute('disabled')).toBe('true');
    expect(root.querySelector('.app_button_text')?.textContent).toBe('Loading...');
  });

  it('setLoading(false) removes spinner and restores text', () => {
    const btn = new Button({ parentNode: root, text: 'Submit' });

    btn.setLoading(true);
    btn.setLoading(false);

    expect(root.querySelector('.spinner')).toBeNull();
    expect(root.querySelector('button')?.getAttribute('disabled')).toBeNull();
    expect(root.querySelector('.app_button_text')?.textContent).toBe('Submit');
  });
});
