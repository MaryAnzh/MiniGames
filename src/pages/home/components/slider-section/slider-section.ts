import { Component } from '@components';
import { LOADING, SUCCESS } from '@constants';
import type { ComponentProps, GameCardDataType, ResponseStatus } from '@types';
import { Button } from '@ui';
import { Slider } from 'src/components/features/slider/slider';

type SliderSectionProps = Pick<ComponentProps, 'parentNode'> & {
  slides: GameCardDataType[];
  status: ResponseStatus;
};

export class SliderSection extends Component {
  constructor({ parentNode, slides, status }: SliderSectionProps) {
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
    const prevBtn = new Button({
      parentNode: titleWrap.node,
      size: 'icon-lg',
      corner: 'circle',
      color: 'light',
      googleIcon: 'arrow_back',
      ariaLabel: 'back slider',
      disabled: status !== SUCCESS,
    });
    prevBtn.setAttributes([{ attr: 'role', value: 'button' }]);

    const nextBtn = new Button({
      parentNode: titleWrap.node,
      size: 'icon-lg',
      corner: 'circle',
      color: 'primary',
      googleIcon: 'arrow_forward',
      ariaLabel: 'forward slider',
      disabled: status !== SUCCESS,
    });
    nextBtn.setAttributes([{ attr: 'role', value: 'button' }]);

    const slider = new Slider({
      parentNode: this.node,
      slides,
      status,
    });

    prevBtn.node.onclick = () => slider.animatePrev();
    nextBtn.node.onclick = () => slider.animateNext();
  }
}
