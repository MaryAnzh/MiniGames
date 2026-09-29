import type { ComponentProps, GameCardDataType, ResponseStatusType } from '@types';

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
  slides: GameCardDataType[];
  status: ResponseStatusType;
};
