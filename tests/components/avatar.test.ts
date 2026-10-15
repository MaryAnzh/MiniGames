import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Avatar } from '@ui';
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

vi.mock('@utils', () => {
  return {
    getInitials: (name: string): string => {
      return name.trim().charAt(0).toUpperCase();
    },

    getProfileName: ({ email, username }: { email: string; username: string }): string => {
      if (username) return username;
      if (email) return email.split('@')[0];
      return '';
    },

    getRandomAvatarColor: () => ({
      token: '--avatar-color-1',
      hex: '#fff000',
    }),
  };
});

describe('Avatar', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    vi.clearAllMocks();
  });

  it('renders name and initials when no avatarUrl provided', () => {
    new Avatar({
      parentNode: root,
      className: 'test-avatar',
      username: 'Mary',
      email: '',
      avatarUrl: '',
    });

    const nameNode = root.querySelector('.app-avatar_name')!;
    expect(nameNode.textContent).toBe('Mary');

    const wrap = root.querySelector('.app-avatar_img-wrap')!;
    expect(wrap.textContent).toBe('M'); // getInitials("Mary") → "M"

    expect(wrap.getAttribute('title')).toBe('Mary');
    expect(wrap.getAttribute('style')).toContain('var(--avatar-color-1)');
  });

  it('uses email when username is empty', () => {
    new Avatar({
      parentNode: root,
      className: 'test-avatar',
      username: '',
      email: 'user@example.com',
      avatarUrl: '',
    });

    const nameNode = root.querySelector('.app-avatar_name')!;
    expect(nameNode.textContent).toBe('user'); // correct behavior

    const wrap = root.querySelector('.app-avatar_img-wrap')!;
    expect(wrap.textContent).toBe('U');
  });
});
