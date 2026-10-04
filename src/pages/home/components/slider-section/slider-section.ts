import { Component, Portal, Slider } from '@components';
import { DARK, EMPTY, ERROR, LOADING, SUCCESS } from '@constants';
import type { ComponentProps, GameCardItemType, ResponseStatusType } from '@types';
import { Button } from '@ui';

type SliderSectionProps = Pick<ComponentProps, 'parentNode'> & {
  slides: GameCardItemType[];
  status: ResponseStatusType;
  portal: Portal;
  onRetry: () => Promise<void>;
};

export class SliderSection extends Component {
  slides: GameCardItemType[];
  status: ResponseStatusType;
  slider: Slider | null = null;
  prevBtn: Button | null = null;
  nextBtn: Button | null = null;
  retryBtn: Button;
  portal: Portal;
  onRetry: () => Promise<void>;

  constructor({ parentNode, slides, status, portal, onRetry }: SliderSectionProps) {
    super({ parentNode, tagName: 'section', className: 'home-page_slider' });
    this.portal = portal;
    this.slides = slides;
    this.status = status;
    this.onRetry = onRetry;

    this.retryBtn = new Button({
      parentNode: null,
      ariaLabel: 'Retry',
      color: DARK,
      leftIcon: 'empty_img',
      size: 'md',
      className: 'slider_title-wrap_retry-brn',
      text: 'Retry',
    });
    this.retryBtn.node.onclick = () => this.handleRetry();

    this.render();
  }

  private render() {
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
    titleWrap.append(this.retryBtn.node);
    if (this.status !== EMPTY) {
      this.retryBtn.node.style.display = 'none';
    }

    const prevBtn = new Button({
      parentNode: titleWrap.node,
      size: 'icon-lg',
      corner: 'circle',
      color: 'light',
      googleIcon: 'arrow_back',
      ariaLabel: 'back slider',
    });
    prevBtn.setAttributes([{ attr: 'role', value: 'button' }]);
    this.prevBtn = prevBtn;

    const nextBtn = new Button({
      parentNode: titleWrap.node,
      size: 'icon-lg',
      corner: 'circle',
      color: 'primary',
      googleIcon: 'arrow_forward',
      ariaLabel: 'forward slider',
    });
    nextBtn.setAttributes([{ attr: 'role', value: 'button' }]);
    this.nextBtn = nextBtn;

    this.slider = new Slider({
      parentNode: this.node,
      slides: [],
      status: LOADING,
      portal: this.portal,
    });
  }

  public updateSlides(slides: GameCardItemType[], status?: ResponseStatusType) {
    const isEmptyData = slides.length === 0;
    const isError = status === ERROR;

    this.status = isError ? ERROR : isEmptyData ? EMPTY : SUCCESS;
    if (this.slider) {
      this.slider.destroy();
    }

    const slider = new Slider({
      parentNode: this.node,
      slides,
      status: this.status,
      portal: this.portal,
    });
    this.slider = slider;
    if (this.prevBtn && this.nextBtn && status === SUCCESS) {
      this.prevBtn.node.onclick = () => slider.animatePrev();
      this.nextBtn.node.onclick = () => slider.animateNext();
      this.prevBtn.setAttributes([{ attr: 'disable', value: null }]);
      this.nextBtn.setAttributes([{ attr: 'disable', value: null }]);

      this.retryBtn.node.style.display = 'none';
    }

    if (this.prevBtn && this.nextBtn && (isEmptyData || isError)) {
      this.prevBtn.setAttributes([{ attr: 'disable', value: 'true' }]);
      this.nextBtn.setAttributes([{ attr: 'disable', value: 'true' }]);
      this.retryBtn.node.style.display = 'flex';
    }
  }

  private handleRetry = async () => {
    this.slider?.destroy();
    this.slider = new Slider({
      parentNode: this.node,
      slides: [],
      status: LOADING,
      portal: this.portal,
    });
    try {
      await this.onRetry();
    } catch {
      this.updateSlides([], EMPTY);
    }
  };

  destroy(): void {
    if (this.prevBtn) {
      this.prevBtn.node.onclick = null;
    }
    if (this.nextBtn) {
      this.nextBtn.node.onclick = null;
    }
    if (this.prevBtn) {
      this.retryBtn.node.onclick = null;
    }
    super.destroy();
  }
}
