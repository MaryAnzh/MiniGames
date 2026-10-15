import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LikeButton } from '@ui';
import type { ComponentProps } from '@types';
import { ADD_TO_FAVORITES, YOUR_FAVORITES } from '@constants';

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

vi.mock('@constants', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...(actual as {}),
    ADD_TO_FAVORITES: 'Add to favorites',
    YOUR_FAVORITES: 'Your favorites',
    LOADING: 'Loading',
    SUCCESS: 'success',
  };
});

describe('LikeButton component', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders with text when withText=true and isFavorite=false', () => {
    new LikeButton({
      parentNode: root,
      withText: true,
      isFavorite: false,
    });

    expect(root.querySelector('.app-like-button')).toBeDefined();
    expect(root.querySelector('.app_button_text')?.textContent).toBe(ADD_TO_FAVORITES);
  });

  it('renders with text when withText=true and isFavorite=true', () => {
    new LikeButton({
      parentNode: root,
      withText: true,
      isFavorite: true,
    });

    expect(root.querySelector('.app_button_text')?.textContent).toBe(YOUR_FAVORITES);
  });

  it('renders count when withText=false', () => {
    new LikeButton({
      parentNode: root,
      value: 42,
    });

    expect(root.querySelector('.app_button_text')?.textContent).toBe('42');
  });

  it('setLiked toggles aria-pressed and class', () => {
    const btn = new LikeButton({
      parentNode: root,
      withText: true,
      isFavorite: false,
    });

    btn.setLiked(true);

    const node = root.querySelector('.app-like-button')!;
    expect(node.getAttribute('aria-pressed')).toBe('true');
    expect(node.classList.contains('app-like-button_liked')).toBe(true);
    expect(root.querySelector('.app_button_text')?.textContent).toBe('Your favorites');

    btn.setLiked(false);

    expect(node.getAttribute('aria-pressed')).toBe('false');
    expect(node.classList.contains('app-like-button_liked')).toBe(false);
    expect(root.querySelector('.app_button_text')?.textContent).toBe('Add to favorites');
  });

  it('setLoading(true) adds loading class and spinner', () => {
    const btn = new LikeButton({
      parentNode: root,
      withText: true,
      isFavorite: false,
    });

    btn.setLoading(true);

    const node = root.querySelector('.app-like-button')!;
    expect(node.classList.contains('app-like-button_loading')).toBe(true);
    expect(root.querySelector('.spinner')).toBeDefined();
    expect(root.querySelector('.app_button_text')?.textContent).toBe('Loading...');
  });

  it('setLoading(false) removes loading class and spinner', () => {
    const btn = new LikeButton({
      parentNode: root,
      withText: true,
      isFavorite: false,
    });

    btn.setLoading(true);
    btn.setLoading(false);

    const node = root.querySelector('.app-like-button')!;
    expect(node.classList.contains('app-like-button_loading')).toBe(false);
    expect(root.querySelector('.spinner')).toBeNull();
    expect(root.querySelector('.app_button_text')?.textContent).toBe('Add to favorites');
  });

  it('callback toggles like state and updates count', async () => {
    const callback = vi.fn().mockResolvedValue({
      status: 'success',
      data: {
        isLikedByCurrentUser: true,
        likesCount: 777,
      },
    });

    new LikeButton({
      parentNode: root,
      withText: false,
      value: 100,
      callback,
    });

    const node = root.querySelector('.app-like-button')!;

    await node.dispatchEvent(new Event('click'));

    expect(callback).toHaveBeenCalled();
    expect(node.getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelector('.app_button_text')?.textContent).toBe('777');
    expect(node.getAttribute('title')).toBe('777');
  });
});
