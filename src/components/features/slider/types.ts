import type { ComponentProps, GameCardItemType, ResponseStatusType } from '@types';

export type SliderState = {
  /**center card index*/
  centerIndex: number;
  /** 3, 5  */
  visibleCount: number;
  isDragging: boolean;
  dragStartX: number;
  dragDeltaX: number;
  autoplayPaused: boolean;
};

export type SliderProps = Pick<ComponentProps, 'parentNode'> & {
  slides: GameCardItemType[];
  status: ResponseStatusType;
  openDetails: (slug: string) => void;
};
