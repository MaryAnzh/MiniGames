import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Switcher } from '@ui';
import type { AuthTabType, ComponentProps } from '@types';
import { LOGIN, REGISTER } from '@constants';

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

        if (props.attrs) {
          props.attrs.forEach(({ attr, value }) => {
            this.node.setAttribute(attr, String(value));
          });
        }

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

      destroy(): void {
        this.node.remove();
      }
    },
  };
});

describe('Switcher', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  const tabs: AuthTabType[] = [LOGIN, REGISTER];

  it('renders switcher buttons', () => {
    new Switcher({
      parentNode: root,
      tabs,
      active: 'login',
      onChange: () => {},
    });

    const buttons = root.querySelectorAll('.app_switcher_btn');
    expect(buttons.length).toBe(2);

    const texts = [...root.querySelectorAll('.app_switcher_btn_text')].map((el) => el.textContent);
    expect(texts).toEqual(['login', 'register']);
  });

  it('marks active tab correctly', () => {
    new Switcher({
      parentNode: root,
      tabs,
      active: 'register',
      onChange: () => {},
    });

    const activeBtn = root.querySelector('.is-active');
    expect(activeBtn).toBeDefined();
    expect(activeBtn?.querySelector('.app_switcher_btn_text')?.textContent).toBe('register');
  });

  it('calls onChange when clicking a tab', () => {
    const onChange = vi.fn();

    new Switcher({
      parentNode: root,
      tabs,
      active: 'login',
      onChange,
    });

    const registerBtn = [...root.querySelectorAll('.app_switcher_btn')].find((btn) =>
      btn.textContent?.includes('register'),
    )!;

    registerBtn.dispatchEvent(new Event('click'));

    expect(onChange).toHaveBeenCalledWith('register');
  });

  it('disables all tabs when setDisabled(true)', () => {
    const switcher = new Switcher({
      parentNode: root,
      tabs,
      active: 'login',
      onChange: () => {},
    });

    switcher.setDisabled(true);

    const buttons = root.querySelectorAll('.app_switcher_btn');
    buttons.forEach((btn) => {
      expect(btn.getAttribute('disabled')).toBe('true');
    });
  });

  it('removes disabled attribute when setDisabled(false)', () => {
    const switcher = new Switcher({
      parentNode: root,
      tabs,
      active: 'login',
      onChange: () => {},
    });

    switcher.setDisabled(true);
    switcher.setDisabled(false);

    const buttons = root.querySelectorAll('.app_switcher_btn');
    buttons.forEach((btn) => {
      expect(btn.getAttribute('disabled')).toBeNull();
    });
  });

  it('destroy removes all buttons and listeners', () => {
    const switcher = new Switcher({
      parentNode: root,
      tabs,
      active: 'login',
      onChange: () => {},
    });

    switcher.destroy();

    expect(root.querySelector('.app_switcher_btn')).toBeNull();
  });
});
