import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameDeveloperSection } from 'src/pages/home/components/game-developer/game-developer';

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

describe('GameDeveloperSection', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('destroy removes section', () => {
    const section = new GameDeveloperSection({ parentNode: root });
    section.destroy();
    expect(root.innerHTML).toBe('');
  });
});
