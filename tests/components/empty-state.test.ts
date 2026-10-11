import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmptyState, type ButtonProps } from '@ui';

vi.mock('../icon/icon', () => {
  return {
    Icon: class IconMock {
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

describe('EmptyState', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders description when provided', () => {
    new EmptyState({
      parentNode: root,
      title: 'No games',
      description: 'Try adding some games',
      className: 'test-empty',
    });

    const desc = root.querySelector('.app-empty-state_description')!;
    expect(desc.textContent).toBe('Try adding some games');
  });

  it('renders action button when actionText and onAction provided', () => {
    const onAction = vi.fn();

    new EmptyState({
      parentNode: root,
      title: 'Nothing here',
      actionText: 'Add item',
      onAction,
      className: 'test-empty',
    });

    const btn = root.querySelector('.app-empty-state_btn')!;
    expect(btn.textContent).toBe('Add item');

    btn.dispatchEvent(new Event('click'));
    expect(onAction).toHaveBeenCalled();
  });

  it('destroy removes content and listeners', () => {
    const onAction = vi.fn();

    const empty = new EmptyState({
      parentNode: root,
      title: 'Nothing',
      actionText: 'Retry',
      onAction,
      className: 'test-empty',
    });

    const btn = root.querySelector('.app-empty-state_btn')!;
    expect(btn).toBeDefined();

    empty.destroy();

    expect(root.innerHTML).toBe('');
  });
});
