import type { GameCardItemType } from '@types';
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
  slides: GameCardItemType[];
  onUpdateSlides: (slides: GameCardItemType[]) => void;
};

export class SliderController {
  slides: GameCardItemType[];
  state: SliderState;

  private onUpdateSlides: (slides: GameCardItemType[]) => void;

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
  }

  updateVisibleCount() {
    const w = window.innerWidth;
    this.state.visibleCount = w < 1024 ? MOBILE_SLIDE_COUNT : DESKTOP_SLIDE_COUNT;
  }

  updateSlides() {
    const visible = this.getVisibleSlides();
    this.onUpdateSlides(visible);
  }

  public getVisibleSlides(): GameCardItemType[] {
    const { centerIndex, visibleCount } = this.state;

    const visible: GameCardItemType[] = [];

    for (let i = 0; i < visibleCount; i++) {
      const idx = (centerIndex + i) % this.slides.length;
      visible.push(this.slides[idx]);
    }

    return visible;
  }

  public setSlides(slides: GameCardItemType[]) {
    this.slides = slides;
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

  next() {
    this.state.centerIndex = (this.state.centerIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlides();
  }

  prev() {
    this.state.centerIndex = (this.state.centerIndex + 1) % this.slides.length;
    this.updateSlides();
  }
}
