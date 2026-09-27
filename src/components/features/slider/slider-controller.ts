import type { GameCardDataType } from '@types';
import { DESKTOP_SLIDE_COUNT, MOBILE_SLIDE_COUNT } from './constants';

export type SliderState = {
  centerIndex: number;
  visibleCount: number;
  isDragging: boolean;
  dragStartX: number;
  dragDeltaX: number;
  autoplayPaused: boolean;
};

type SliderControllerProps = {
  slides: GameCardDataType[];
  onUpdateSlides: (slides: GameCardDataType[]) => void;
};

export class SliderController {
  slides: GameCardDataType[];
  state: SliderState;
  private onUpdateSlides: (slides: GameCardDataType[]) => void;

  constructor({ slides, onUpdateSlides }: SliderControllerProps) {
    this.slides = slides;
    this.onUpdateSlides = onUpdateSlides;

    this.state = {
      centerIndex: 0,
      visibleCount: DESKTOP_SLIDE_COUNT,
      isDragging: false,
      dragStartX: 0,
      dragDeltaX: 0,
      autoplayPaused: false,
    };

    this.init();
  }

  init() {
    this.updateVisibleCount();
    this.updateSlides();

    window.addEventListener('resize', () => {
      this.updateVisibleCount();
      this.updateSlides();
    });
  }

  updateVisibleCount() {
    const w = window.innerWidth;

    this.state.visibleCount = w < 768 ? MOBILE_SLIDE_COUNT : DESKTOP_SLIDE_COUNT;
  }

  updateSlides() {
    const { centerIndex, visibleCount } = this.state;

    const half = Math.floor(visibleCount / 2);
    const visible: GameCardDataType[] = [];

    for (let i = -half; i <= half; i++) {
      const idx = (centerIndex + i + this.slides.length) % this.slides.length;
      visible.push(this.slides[idx]);
    }

    this.onUpdateSlides(visible);
  }

  public getVisibleSlides(): GameCardDataType[] {
    const { centerIndex, visibleCount } = this.state;

    const half = Math.floor(visibleCount / 2);
    const visible: GameCardDataType[] = [];

    for (let i = -half; i <= half; i++) {
      const idx = (centerIndex + i + this.slides.length) % this.slides.length;
      visible.push(this.slides[idx]);
    }

    return visible;
  }

  next() {
    this.state.centerIndex = (this.state.centerIndex + 1) % this.slides.length;

    this.updateSlides();
  }

  prev() {
    this.state.centerIndex = (this.state.centerIndex - 1 + this.slides.length) % this.slides.length;

    this.updateSlides();
  }
}
