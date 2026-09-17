import { Component } from '@components';
import type { ComponentProps } from '@types';
import { Button } from '@ui';

type HeroSectionProps = Pick<ComponentProps, 'parentNode'>;

export class HeroSection extends Component {
  constructor({ parentNode }: HeroSectionProps) {
    super({ parentNode, tagName: 'section', className: 'home-page_hero' });

    const textWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'hero_text-wrap ',
    });

    new Component({
      parentNode: textWrap.node,
      tagName: 'span',
      className: 'hero_accent',
    });

    new Component({
      parentNode: textWrap.node,
      tagName: 'h2',
      className: 'hero_title',
      content: 'Take a Short Break & Have Fun',
    });

    new Component({
      parentNode: textWrap.node,
      tagName: 'p',
      className: 'hero_text',
      content: 'Discover hundreds of curated casual mini-games right in your browser.',
    });

    new Button({
      parentNode: textWrap.node,
      colorVariant: 'primary',
      size: 'sm',
      text: 'Browse Library',
    });
  }
}
