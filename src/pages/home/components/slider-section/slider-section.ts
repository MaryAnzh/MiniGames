import { Component } from '@components';
import type { ComponentProps } from '@types';
import { Button } from '@ui';
import { Slider } from 'src/components/features/slider/slider';

type SliderSectionProps = Pick<ComponentProps, 'parentNode'>;

export class SliderSection extends Component {
  constructor({ parentNode }: SliderSectionProps) {
    super({ parentNode, tagName: 'section', className: 'home-page_slider' });

    const titleWrap = new Component({
      parentNode: this.node,
      tagName: 'div',
      className: 'slider_title-wrap',
    });

    new Component({
      parentNode: titleWrap.node,
      tagName: 'span',
      className: 'slider_title-wrap_tag',
    });

    new Component({
      parentNode: titleWrap.node,
      tagName: 'h2',
      className: 'slider_title-wrap_title',
      content: 'New Games',
    });
    new Button({
      parentNode: titleWrap.node,
      variant: 'round',
      colorVariant: 'light',
      googleIcon: 'arrow_back',
      ariaLabel: 'back slider',
    });
    new Button({
      parentNode: titleWrap.node,
      variant: 'round',
      colorVariant: 'primary',
      googleIcon: 'arrow_forward',
      ariaLabel: 'forward slider',
    });

    new Slider({
      parentNode: this.node,
    });
  }
}
