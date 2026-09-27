import type { SlideCardType } from '@types';

type SliderControllerProps = {
  root: HTMLElement;
  slides: HTMLElement[];
  games: SlideCardType[];
  onCardClick: (duration: 'prev' | 'next') => void;
};

export class SliderController {
  root: HTMLElement;
  slides: HTMLElement[];
  games: SlideCardType[];
  centerIndex = 0;
  visibleCount = 5;

  autoplayTimer: number | null = null;
  isDragging = false;
  dragStartX = 0;
  dragDeltaX = 0;

  constructor({ root, slides, games, onCardClick }: SliderControllerProps) {
    this.root = root;
    this.slides = slides;
    this.games = games;
  }
}
