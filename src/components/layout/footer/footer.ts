import { Component } from '@components';
import type { ComponentProps } from '@types';
import { ICON_PICKER } from '@constants';
import * as C from '@constants';

const FOOTER_LINKS = [
  { title: C.EXPLORE, list: C.FOOTER_NAV },
  { title: C.COMPANY, list: C.APP_COMPANY },
];

export class Footer extends Component {
  constructor({ parentNode }: Pick<ComponentProps, 'parentNode'>) {
    super({
      parentNode,
      tagName: 'footer',
      className: 'footer',
    });

    this.renderTop();
    this.renderBottom();
  }

  // FOOTER TOP
  private renderTop() {
    const top = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'footer_top',
    });

    this.renderBrand(top.node);
    this.renderLinks(top.node);
    this.renderCommunity(top.node);
  }

  private renderBrand(parent: HTMLElement) {
    const brand = new Component({
      parentNode: parent,
      tagName: 'div',
      className: 'footer_brand',
    });

    const logoWrap = new Component({
      parentNode: brand.node,
      tagName: 'div',
      className: 'footer_brand-logo',
    });

    logoWrap.node.insertAdjacentHTML('beforeend', ICON_PICKER.LOGO);

    new Component({
      parentNode: brand.node,
      tagName: 'h3',
      className: 'footer_brand-title',
      content: 'MiniGames',
    });

    new Component({
      parentNode: brand.node,
      tagName: 'p',
      className: 'footer_brand-desc',
      content:
        'Take a short break and have fun. Hundreds of curated casual mini-games right in your web browser. No download required.',
    });
  }

  private renderLinks(parent: HTMLElement) {
    const wrap = new Component({
      parentNode: parent,
      tagName: 'div',
      className: 'footer_links',
    });

    FOOTER_LINKS.forEach(({ title, list }) => {
      const col = new Component({
        parentNode: wrap.node,
        tagName: 'div',
        className: 'footer_links-col',
      });

      new Component({
        parentNode: col.node,
        tagName: 'h4',
        className: 'footer_links-title',
        content: title,
      });

      const listNode = new Component({
        parentNode: col.node,
        tagName: 'ul',
        className: 'footer_links_list',
      });

      list.forEach(({ name, path }) => {
        const item = new Component({
          parentNode: listNode.node,
          tagName: 'li',
          className: 'footer_links_list_item',
        });

        new Component({
          parentNode: item.node,
          tagName: 'a',
          className: 'footer_links_list_item_link',
          content: name,
          attrs: [{ attr: 'href', value: path }],
        });
      });
    });
  }

  private renderCommunity(parent: HTMLElement) {
    const col = new Component({
      parentNode: parent,
      tagName: 'div',
      className: 'footer_community',
    });

    new Component({
      parentNode: col.node,
      tagName: 'h4',
      className: 'footer_community-title',
      content: C.COMMUNITY,
    });

    const iconsWrap = new Component({
      parentNode: col.node,
      tagName: 'ul',
      className: 'footer_community-icons',
    });

    C.COMMUNITY_ICONS.forEach((icon) => {
      new Component({
        parentNode: iconsWrap.node,
        tagName: 'span',
        className: ['footer_community-icon', 'material-symbols-rounded', 'google-icons'],
        content: icon,
        attrs: [{ attr: 'title', value: `Go to ${icon}` }],
      });
    });
  }

  private renderBottom() {
    const bottom = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'footer_bottom',
    });

    new Component({
      parentNode: bottom.node,
      tagName: 'span',
      className: 'footer_bottom-copy',
      content: '© 2026 MiniGames. All rights reserved.',
    });

    const rsWrap = new Component({
      parentNode: bottom.node,
      tagName: 'div',
      className: 'footer_bottom-rs',
    });

    const rsIcon = new Component({
      parentNode: rsWrap.node,
      tagName: 'a',
      className: 'footer_bottom-rs-icon',
      attrs: [
        { attr: 'href', value: 'https://rs.school/' },
        { attr: 'target', value: '_blank' },
      ],
    });
    rsIcon.node.insertAdjacentHTML('beforeend', ICON_PICKER.RS);

    new Component({
      parentNode: rsWrap.node,
      tagName: 'span',
      className: 'footer_bottom-rs-text',
      content: 'RS School',
    });

    const codeWrap = new Component({
      parentNode: bottom.node,
      tagName: 'div',
      className: 'footer_bottom-code',
    });

    new Component({
      parentNode: codeWrap.node,
      tagName: 'a',
      className: ['footer_bottom-code-icon', 'google-icons', 'material-symbols-rounded'],
      content: 'code',
      attrs: [
        { attr: 'href', value: 'https://github.com/MaryAnzh' },
        { attr: 'target', value: '_blank' },
      ],
    });

    new Component({
      parentNode: codeWrap.node,
      tagName: 'span',
      className: 'footer_bottom-code-text',
      content: '@MaryAnzh',
    });

    new Component({
      parentNode: bottom.node,
      tagName: 'span',
      className: 'footer_bottom-love',
      content: 'Designed with love',
    });
  }
}
