import { Component, Slider } from '@components';
import { DARK, EMPTY, ERROR, LOADING, SUCCESS } from '@constants';
import type { ComponentProps, GameCardItemType, ResponseStatusType } from '@types';
import { Button } from '@ui';

type SliderSectionProps = Pick<ComponentProps, 'parentNode'> & {
  onRetry: () => Promise<void>;
  openDetails: (slug: string) => void;
};

export class SliderSection extends Component {
  private slider: Slider;
  private prevBtn!: Button;
  private nextBtn!: Button;
  private retryBtn!: Button;
  private onRetry: () => Promise<void>;
  private openDetails: (slug: string) => void;

  constructor({ parentNode, onRetry, openDetails }: SliderSectionProps) {
    super({ parentNode, tagName: 'section', className: 'home-page_slider' });

    this.onRetry = onRetry;
    this.openDetails = openDetails;

    this.renderHeader();
    this.slider = this.createSlider(); // ← создаём один раз
  }

  private renderHeader() {
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

    this.retryBtn = new Button({
      parentNode: titleWrap.node,
      ariaLabel: 'Retry',
      color: DARK,
      leftIcon: 'empty_img',
      size: 'md',
      className: 'slider_title-wrap_retry-brn',
      text: 'Retry',
    });
    this.retryBtn.node.onclick = () => this.handleRetry();
    this.retryBtn.node.style.display = 'none';

    this.prevBtn = new Button({
      parentNode: titleWrap.node,
      size: 'icon-lg',
      corner: 'circle',
      color: 'light',
      googleIcon: 'arrow_back',
      ariaLabel: 'back slider',
    });

    this.nextBtn = new Button({
      parentNode: titleWrap.node,
      size: 'icon-lg',
      corner: 'circle',
      color: 'primary',
      googleIcon: 'arrow_forward',
      ariaLabel: 'forward slider',
    });
  }

  private createSlider(slides: GameCardItemType[] = [], status: ResponseStatusType = LOADING) {
    return new Slider({
      parentNode: this.node,
      slides,
      status,
      openDetails: this.openDetails,
    });
  }

  public updateSlides(slides: GameCardItemType[], status: ResponseStatusType) {
    const isEmpty = slides.length === 0;
    const isError = status === ERROR;

    const finalStatus = isError ? ERROR : isEmpty ? EMPTY : SUCCESS;

    this.slider.update({ slides, status: finalStatus });

    if (finalStatus === SUCCESS) {
      this.prevBtn.node.onclick = () => this.slider.animatePrev();
      this.nextBtn.node.onclick = () => this.slider.animateNext();
      this.prevBtn.setAttributes([{ attr: 'disable', value: null }]);
      this.nextBtn.setAttributes([{ attr: 'disable', value: null }]);
      this.retryBtn.node.style.display = 'none';
    } else {
      this.prevBtn.setAttributes([{ attr: 'disable', value: 'true' }]);
      this.nextBtn.setAttributes([{ attr: 'disable', value: 'true' }]);
      this.retryBtn.node.style.display = 'flex';
    }
  }

  private async handleRetry() {
    this.slider.update({ slides: [], status: LOADING });

    try {
      await this.onRetry?.();
    } catch {
      this.updateSlides([], EMPTY);
    }
  }

  destroy() {
    this.prevBtn.node.onclick = null;
    this.nextBtn.node.onclick = null;
    this.retryBtn.node.onclick = null;
    this.slider.destroy();
    super.destroy();
  }
}
