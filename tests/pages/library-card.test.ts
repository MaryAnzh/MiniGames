import type { ComponentProps } from '@types';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LibraryCards } from 'src/pages/library/sections';
import { EMPTY_CARD } from 'src/pages/library/sections/library-cards/constants';

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

      append(child: HTMLElement) {
        this.node.append(child);
      }

      destroy(): void {
        this.node.remove();
      }
    },
  };
});

vi.mock('@ui', () => {
  return {
    Image: class {
      public node: HTMLElement;
      constructor({ parentNode }: { parentNode: HTMLElement }) {
        this.node = document.createElement('div');
        this.node.className = 'mock-image';
        parentNode.append(this.node);
      }
    },

    Button: class {
      public node: HTMLButtonElement;
      constructor({ parentNode, text }: { parentNode: HTMLElement; text?: string }) {
        this.node = document.createElement('button');
        this.node.textContent = text ?? '';
        parentNode.append(this.node);
      }
      setAttributes() {}
    },

    LikeButton: class {
      public node: HTMLElement;
      constructor({ parentNode }: { parentNode: HTMLElement }) {
        this.node = document.createElement('div');
        this.node.className = 'mock-like';
        parentNode.append(this.node);
      }
    },

    Skeleton: class {
      public node: HTMLElement;
      constructor({ parentNode }: { parentNode: HTMLElement }) {
        this.node = document.createElement('div');
        this.node.className = 'mock-skeleton';
        parentNode.append(this.node);
      }
    },

    SkeletonText: class {
      public node: HTMLElement;
      constructor({ parentNode }: { parentNode: HTMLElement }) {
        this.node = document.createElement('div');
        this.node.className = 'mock-skeleton-text';
        parentNode.append(this.node);
      }
    },
  };
});

describe('LibraryCards', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders default skeleton cards', () => {
    new LibraryCards({
      parentNode: root,
      defaultCardCount: 3,
      openDetails: () => {},
    });

    const cards = root.querySelectorAll('.library_game-card');
    expect(cards.length).toBe(3);
  });

  it('renderAllCards renders provided list', () => {
    const lc = new LibraryCards({
      parentNode: root,
      defaultCardCount: 2,
      openDetails: () => {},
    });

    const list = [
      {
        slug: 'game-1',
        name: 'Game One',
        cardImage: 'img1.jpg',
        category: 'Action',
        likesCount: 1000,
        price: 'free',
        rating: 4.5,
        shortDescription: 'Desc 1',
      },
      {
        slug: 'game-2',
        name: 'Game Two',
        cardImage: 'img2.jpg',
        category: 'RPG',
        likesCount: 2000,
        price: '10',
        rating: 4.8,
        shortDescription: 'Desc 2',
      },
    ];

    lc.renderAllCards(list);

    const cards = root.querySelectorAll('.library_game-card');
    expect(cards.length).toBe(2);

    const titles = [...root.querySelectorAll('.library_game-card_header_title')].map(
      (el) => el.textContent,
    );

    expect(titles).toEqual(['Game One', 'Game Two']);
  });

  it('showSkeletons renders EMPTY_CARD skeletons', () => {
    const lc = new LibraryCards({
      parentNode: root,
      defaultCardCount: 2,
      openDetails: () => {},
    });

    lc.showSkeletons();

    const titles = [...root.querySelectorAll('.library_game-card_header_title')].map(
      (el) => el.textContent,
    );

    expect(titles).toEqual([EMPTY_CARD.name, EMPTY_CARD.name]);
  });
});
