import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Footer } from '@components';
import type { ComponentProps } from '@types';
import { FOOTER_LINKS } from 'src/components/layout/footer/footer';
import { COMMUNITY_ICONS } from '@constants';

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
        attrs.forEach((a: any) => this.node.setAttribute(a.attr, a.value));
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

vi.mock('@ui', () => {
  return {
    Button: class ButtonMock {
      node = document.createElement('button');
      constructor({ parentNode, className, ariaLabel }: any) {
        this.node.className = className ?? '';
        if (ariaLabel) this.node.setAttribute('aria-label', ariaLabel);
        parentNode?.append(this.node);
      }
    },
  };
});

describe('Footer', () => {
  let root: HTMLElement;
  let router: any;

  beforeEach(() => {
    root = document.createElement('div');
    router = { navigate: vi.fn() };
    vi.clearAllMocks();
  });

  it('renders footer root element', () => {
    new Footer({ parentNode: root, router });

    const footer = root.querySelector('footer');
    expect(footer).toBeDefined();
    expect(footer?.className).toBe('footer');
  });

  it('renders brand section with logo, title and description', () => {
    new Footer({ parentNode: root, router });

    const brand = root.querySelector('.footer_brand');
    expect(brand).toBeDefined();

    expect(brand?.querySelector('.footer_brand-logo')?.innerHTML.length).toBeGreaterThan(0);
    expect(brand?.querySelector('.footer_brand-title')?.textContent).toBe('MiniGames');
    expect(brand?.querySelector('.footer_brand-desc')).toBeDefined();
  });

  it('renders footer links columns', () => {
    new Footer({ parentNode: root, router });

    const cols = root.querySelectorAll('.footer_links-col');
    expect(cols.length).toBe(2);

    const firstColItems = cols[0].querySelectorAll('.footer_links_list_item');
    expect(firstColItems.length).toBe(FOOTER_LINKS[0].list.length);

    const secondColItems = cols[1].querySelectorAll('.footer_links_list_item');
    expect(secondColItems.length).toBe(FOOTER_LINKS[1].list.length);
  });

  it('clicking first column link triggers router.navigate', () => {
    new Footer({ parentNode: root, router });

    const firstItem = root.querySelector('.footer_links_list_item');
    firstItem?.dispatchEvent(new Event('click'));

    expect(router.navigate).toHaveBeenCalledWith(FOOTER_LINKS[0].list[0].path);
  });

  it('renders community icons', () => {
    new Footer({ parentNode: root, router });

    const icons = root.querySelectorAll('.footer_community_icons_icon');
    expect(icons.length).toBe(COMMUNITY_ICONS.length);
  });

  it('renders bottom section with copyright and RS icon', () => {
    new Footer({ parentNode: root, router });

    expect(root.querySelector('.footer_bottom-copy')?.textContent).toBe(
      '© 2026 MiniGames. All rights reserved.',
    );

    expect(root.querySelector('.footer_bottom-rs-icon')?.innerHTML.length).toBeGreaterThan(0);

    expect(root.querySelector('.footer_bottom-code-text')?.textContent).toBe('@MaryAnzh');
  });
});
