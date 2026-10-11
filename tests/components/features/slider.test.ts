import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SliderController } from 'src/components/features/slider/slider-controller';
import { DESKTOP_SLIDE_COUNT, MOBILE_SLIDE_COUNT } from 'src/components/features/slider/constants';
import { Slider } from '@components';
import type { GameCardItemType } from '@types';

describe('Components: Slider Controller', () => {
  let slides: GameCardItemType[];
  let onUpdateSlides: () => void;

  beforeEach(() => {
    slides = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
    ] as unknown as GameCardItemType[];

    onUpdateSlides = vi.fn();
    vi.clearAllMocks();
  });

  it('init calls updateVisibleCount and updateSlides', () => {
    const controller = new SliderController({ slides, onUpdateSlides });

    expect(onUpdateSlides).toHaveBeenCalled();
    expect(controller.state.visibleCount).toBe(DESKTOP_SLIDE_COUNT);
  });

  it('updateVisibleCount sets MOBILE_SLIDE_COUNT when width < 1024', () => {
    const controller = new SliderController({ slides, onUpdateSlides });

    Object.defineProperty(window, 'innerWidth', { value: 800 });
    controller.updateVisibleCount();

    expect(controller.state.visibleCount).toBe(MOBILE_SLIDE_COUNT);
  });

  it('updateVisibleCount sets DESKTOP_SLIDE_COUNT when width >= 1024', () => {
    const controller = new SliderController({ slides, onUpdateSlides });

    Object.defineProperty(window, 'innerWidth', { value: 1400 });
    controller.updateVisibleCount();

    expect(controller.state.visibleCount).toBe(DESKTOP_SLIDE_COUNT);
  });

  it('getVisibleSlides returns correct slice from centerIndex', () => {
    const controller = new SliderController({ slides, onUpdateSlides });

    controller.state.visibleCount = 3;
    controller.state.centerIndex = 1;

    const visible = controller.getVisibleSlides();

    expect(visible).toEqual([{ id: 2 }, { id: 3 }, { id: 4 }]);
  });

  it('getVisibleSlides wraps around the array (cyclic)', () => {
    const controller = new SliderController({ slides, onUpdateSlides });

    controller.state.visibleCount = 3;
    controller.state.centerIndex = 4;

    const visible = controller.getVisibleSlides();

    expect(visible).toEqual([{ id: 5 }, { id: 1 }, { id: 2 }]);
  });

  it('next() shifts centerIndex backward and calls updateSlides', () => {
    const controller = new SliderController({ slides, onUpdateSlides });

    controller.state.centerIndex = 0;
    controller.next();

    expect(controller.state.centerIndex).toBe(slides.length - 1);
    expect(onUpdateSlides).toHaveBeenCalledTimes(2); // init + next
  });

  it('prev() shifts centerIndex forward and calls updateSlides', () => {
    const controller = new SliderController({ slides, onUpdateSlides });

    controller.state.centerIndex = 0;
    controller.prev();

    expect(controller.state.centerIndex).toBe(1);
    expect(onUpdateSlides).toHaveBeenCalledTimes(2);
  });

  it('replaceSlides resets centerIndex and updates slides', () => {
    const controller = new SliderController({ slides, onUpdateSlides });

    const newSlides: GameCardItemType[] = [
      { id: 10 },
      { id: 20 },
      { id: 30 },
    ] as unknown as GameCardItemType[];
    controller.replaceSlides(newSlides);

    expect(controller.slides).toEqual(newSlides);
    expect(controller.state.centerIndex).toBe(0);
    expect(onUpdateSlides).toHaveBeenCalledTimes(2); // init + replaceSlides
  });
});

describe('Components: Slider component', () => {
  let root: HTMLElement;
  let slides: any[];
  let openDetails: any;

  beforeEach(() => {
    root = document.createElement('div');
    slides = [
      {
        cardImage: 'img1',
        category: 'cat',
        likesCount: 10,
        name: 'Game 1',
        price: '10',
        rating: 4,
        shortDescription: 'desc',
        slug: 'game-1',
      },
      {
        cardImage: 'img2',
        category: 'cat',
        likesCount: 20,
        name: 'Game 2',
        price: '20',
        rating: 5,
        shortDescription: 'desc',
        slug: 'game-2',
      },
    ];

    openDetails = vi.fn();
    vi.clearAllMocks();
  });

  it('renders ERROR banner', () => {
    new Slider({
      parentNode: root,
      slides,
      status: 'error',
      openDetails,
    });

    expect(root.querySelector('.app_slider-error')).toBeDefined();
  });

  it('renders SUCCESS slides', () => {
    new Slider({
      parentNode: root,
      slides,
      status: 'success',
      openDetails,
    });

    const items = root.querySelectorAll('.app_slider_body_item');
    expect(items.length).toBeGreaterThan(0);

    const titles = root.querySelectorAll('.app_slider_body_item_info_title');
    expect(titles[0]?.textContent).toBe('Game 1');
  });

  it('openDetails is called when slide clicked', () => {
    new Slider({
      parentNode: root,
      slides,
      status: 'success',
      openDetails,
    });

    const firstSlide = root.querySelector('.app_slider_body_item')!;
    firstSlide.dispatchEvent(new Event('click'));

    expect(openDetails).toHaveBeenCalledWith('game-1');
  });

  it('update() re-renders slides', () => {
    const slider = new Slider({
      parentNode: root,
      slides,
      status: 'success',
      openDetails,
    });

    const newSlides = [
      {
        cardImage: 'imgX',
        category: 'cat',
        likesCount: 99,
        name: 'Updated',
        price: '0',
        rating: 3,
        shortDescription: 'desc',
        slug: 'updated',
      },
    ];

    slider.update({ slides: newSlides, status: 'success' });

    const title = root.querySelector('.app_slider_body_item_info_title');
    expect(title?.textContent).toBe('Updated');
  });

  it('animateNext calls animate("prev")', () => {
    const slider = new Slider({
      parentNode: root,
      slides,
      status: 'success',
      openDetails,
    });

    const animateSpy = vi.spyOn(slider as any, 'animate');

    slider.animateNext();

    expect(animateSpy).toHaveBeenCalledWith('prev');
  });

  it('animatePrev calls animate("next")', () => {
    const slider = new Slider({
      parentNode: root,
      slides,
      status: 'success',
      openDetails,
    });

    const animateSpy = vi.spyOn(slider as any, 'animate');

    slider.animatePrev();

    expect(animateSpy).toHaveBeenCalledWith('next');
  });

  it('handleResize triggers re-render', () => {
    vi.useFakeTimers();

    const slider = new Slider({
      parentNode: root,
      slides,
      status: 'success',
      openDetails,
    });

    const renderSpy = vi.spyOn(slider as any, 'render');

    window.dispatchEvent(new Event('resize'));
    vi.advanceTimersByTime(200);

    expect(renderSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
