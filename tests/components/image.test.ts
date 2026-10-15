import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Image, type SkeletonProps } from '@ui';
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

vi.mock('@ui', async (importOriginal) => {
  const actual = await importOriginal();

  class SkeletonMock {
    public node: HTMLElement;

    constructor(props: SkeletonProps) {
      this.node = document.createElement('div');
      this.node.className = 'app-skeleton';
      this.node.setAttribute('data-color', props.color ?? 'light');
      props.parentNode?.append(this.node);
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
      if (className) this.node.classList.add(className);
      parentNode.append(this.node);
    }
  }

  return {
    ...(actual as {}),
    Skeleton: SkeletonMock,
    Icon: IconMock,
  };
});

describe('Image', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  it('renders empty icon when src is empty', () => {
    new Image({
      parentNode: root,
      src: '',
      alt: 'avatar',
      isAvatar: true,
    });

    const wrapper = root.querySelector('.app-image')!;
    expect(wrapper.classList.contains('app-image-empty-avatar')).toBe(true);

    const icon = root.querySelector('.app-icon--avatar')!;
    expect(icon).toBeDefined();
  });

  it('renders img element when src provided', () => {
    new Image({
      parentNode: root,
      src: 'http://example.com/img.png',
      alt: 'test',
    });

    const img = root.querySelector('.app-image_img')!;
    expect(img).toBeDefined();
    expect(img.getAttribute('src')).toContain('http://example.com/img.png');
  });

  it('shows skeleton after 1 second', () => {
    new Image({
      parentNode: root,
      src: 'http://example.com/img.png',
      alt: 'test',
      skeletonColor: 'dark',
    });

    expect(root.querySelector('.app-skeleton')).toBeNull();

    vi.advanceTimersByTime(1000);

    const skeleton = root.querySelector('.app-skeleton')!;
    expect(skeleton).toBeDefined();
    expect(skeleton.getAttribute('data-color')).toBe('dark');
  });

  it('removes skeleton on load', () => {
    const img = new Image({
      parentNode: root,
      src: 'http://example.com/img.png',
      alt: 'test',
    });

    vi.advanceTimersByTime(1000);
    expect(root.querySelector('.app-skeleton')).toBeDefined();

    img['img'].onload?.(new Event('load'));

    expect(root.querySelector('.app-skeleton')).toBeNull();
  });

  it('renders empty icon on error', () => {
    const img = new Image({
      parentNode: root,
      src: 'http://example.com/img.png',
      alt: 'test',
    });

    vi.advanceTimersByTime(1000);
    expect(root.querySelector('.app-skeleton')).toBeDefined();

    img['img'].onerror?.(new Event('error'));

    expect(root.querySelector('.app-skeleton')).toBeNull();
    expect(root.querySelector('.app-icon--empty_img')).toBeDefined();
  });

  it('destroy clears timers and removes element', () => {
    const img = new Image({
      parentNode: root,
      src: 'http://example.com/img.png',
      alt: 'test',
    });

    img.destroy();

    expect(root.innerHTML).toBe('');
  });
});
