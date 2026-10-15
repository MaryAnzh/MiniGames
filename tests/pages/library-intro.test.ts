import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LibraryIntro } from 'src/pages/library/sections/library-intro/library-intro';

vi.mock('@components', () => {
  return {
    Component: class ComponentMock {
      public node: HTMLElement;

      constructor(props: {
        parentNode?: HTMLElement;
        tagName?: string;
        className?: string | string[];
        content?: string;
      }) {
        const tag = props.tagName ?? 'div';
        this.node = document.createElement(tag);

        if (props.className) {
          this.node.className = Array.isArray(props.className)
            ? props.className.join(' ')
            : props.className;
        }

        if (props.content) {
          this.node.textContent = props.content;
        }

        props.parentNode?.append(this.node);
      }

      destroy() {
        this.node.remove();
      }
    },
  };
});

describe('LibraryIntro', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders intro section with title and text', () => {
    new LibraryIntro({ parentNode: root });

    const section = root.querySelector('section');
    expect(section).not.toBeNull();
    expect(section?.classList.contains('library_intro')).toBe(true);

    const title = section?.querySelector('.library_intro_title');
    expect(title?.textContent).toBe('Game Library');

    const text = section?.querySelector('.library_intro_text');
    expect(text?.textContent).toBe('Browse our collection of casual mini-games');
  });

  it('destroy removes intro section', () => {
    const intro = new LibraryIntro({ parentNode: root });
    intro.destroy();
    expect(root.innerHTML).toBe('');
  });
});
