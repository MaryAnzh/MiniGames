import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Select } from '@ui';
import type { ButtonProps } from '@ui';
import type { ComponentProps } from '@types';
import { LEFT } from '@constants';

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

describe('Select', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  const list = [
    { label: 'Newest', value: 'newest', selected: true },
    { label: 'Oldest', value: 'oldest' },
    { label: 'Popular', value: 'popular' },
  ];

  it('renders trigger with selected label', () => {
    new Select({
      parentNode: root,
      list,
      align: LEFT,
      onChange: () => {},
    });

    const trigger = root.querySelector('.app-select-trigger')!;
    expect(trigger.textContent).toContain('Newest');
  });

  it('renders popup list items', () => {
    new Select({
      parentNode: root,
      list,
      align: LEFT,
      onChange: () => {},
    });

    const items = root.querySelectorAll('.app-select_popup_item');
    expect(items.length).toBe(3);
  });

  it('opens popup on trigger click', () => {
    new Select({
      parentNode: root,
      list,
      align: LEFT,
      onChange: () => {},
    });

    const trigger = root.querySelector('.app-select-trigger')!;
    trigger.dispatchEvent(new Event('click'));

    const popup = root.querySelector('.app-select_popup')!;
    expect(popup.classList.contains('app-select_popup--open')).toBe(true);
  });

  it('closes popup on outside click', () => {
    new Select({
      parentNode: root,
      list,
      align: LEFT,
      onChange: () => {},
    });

    const trigger = root.querySelector('.app-select-trigger')!;
    trigger.dispatchEvent(new Event('click'));

    document.dispatchEvent(new Event('click'));

    const popup = root.querySelector('.app-select_popup')!;
    expect(popup.classList.contains('app-select_popup--open')).toBe(false);
  });

  it('selects item and calls onChange', () => {
    const onChange = vi.fn();

    new Select({
      parentNode: root,
      list,
      align: LEFT,
      onChange,
    });

    const item = [...root.querySelectorAll('.app-select_popup_item')].find(
      (el) => el.textContent === 'Popular',
    )!;

    item.dispatchEvent(new Event('click'));

    const trigger = root.querySelector('.app-select-trigger')!;
    expect(trigger.textContent).toContain('Popular');

    expect(onChange).toHaveBeenCalledWith('popular');
  });

  it('updates aria-expanded when opening and closing', () => {
    new Select({
      parentNode: root,
      list,
      align: LEFT,
      onChange: () => {},
    });

    const trigger = root.querySelector('.app-select-trigger')!;

    trigger.dispatchEvent(new Event('click'));
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    trigger.dispatchEvent(new Event('click'));
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
