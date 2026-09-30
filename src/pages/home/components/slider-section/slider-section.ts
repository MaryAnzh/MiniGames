import { Component } from '@components';
import { SUCCESS } from '@constants';
import type { ComponentProps, GameCardItemType, ResponseStatusType } from '@types';
import { Button } from '@ui';
import { Slider } from 'src/components/features/slider/slider';

type SliderSectionProps = Pick<ComponentProps, 'parentNode'> & {
  slides: GameCardItemType[];
  status: ResponseStatusType;
};

export class SliderSection extends Component {
  slides: GameCardItemType[];
  status: ResponseStatusType;
  slider: Slider;
  prevBtn: Button;
  nextBtn: Button;

  constructor({ parentNode, slides, status }: SliderSectionProps) {
    super({ parentNode, tagName: 'section', className: 'home-page_slider' });
    this.slides = slides;
    this.status = status;

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
    this.prevBtn = new Button({
      parentNode: titleWrap.node,
      size: 'icon-lg',
      corner: 'circle',
      color: 'light',
      googleIcon: 'arrow_back',
      ariaLabel: 'back slider',
      disabled: this.status !== SUCCESS,
    });
    this.prevBtn.setAttributes([{ attr: 'role', value: 'button' }]);

    this.nextBtn = new Button({
      parentNode: titleWrap.node,
      size: 'icon-lg',
      corner: 'circle',
      color: 'primary',
      googleIcon: 'arrow_forward',
      ariaLabel: 'forward slider',
      disabled: this.status !== SUCCESS,
    });
    this.nextBtn.setAttributes([{ attr: 'role', value: 'button' }]);

    this.slider = new Slider({
      parentNode: this.node,
      slides,
      status,
    });

    this.prevBtn.node.onclick = () => this.slider.animatePrev();
    this.nextBtn.node.onclick = () => this.slider.animateNext();
  }

  public update(status: ResponseStatusType, games?: GameCardItemType[]) {
    this.status = status;
    this.slides = games ? games : [];
  }

  public updateSlides(slides: GameCardItemType[]) {
    this.slider.updateSlides(slides);
    this.prevBtn.node.removeAttribute('disabled');
    this.nextBtn.node.removeAttribute('disabled');
  }

  destroy(): void {
    if (this.prevBtn) {
      this.prevBtn.node.onclick = null;
    }
    if (this.nextBtn) {
      this.nextBtn.node.onclick = null;
    }
    super.destroy();
  }
}
