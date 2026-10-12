import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SliderSection } from 'src/pages/home/components/slider-section/slider-section';
import { SUCCESS, EMPTY, ERROR } from '@constants';
import type { GameCardItemType, ResponseStatusType } from '@types';

vi.mock('@components', () => {
  return {
    Component: class ComponentMock {
      public node: HTMLElement;

      constructor(props: {
        parentNode?: HTMLElement;
        tagName?: string;
        className?: string | string[];
        content?: string;
      }) {
        const tag = props.tagName ?? 'div';
        this.node = document.createElement(tag);

        if (props.className) {
          this.node.className = Array.isArray(props.className)
            ? props.className.join(' ')
            : props.className;
        }

        if (props.content) {
          this.node.textContent = props.content;
        }

        props.parentNode?.append(this.node);
      }

      destroy() {
        this.node.remove();
      }
    },

    Slider: class {
      public node: HTMLElement;
      public update: (data: { slides: GameCardItemType[]; status: ResponseStatusType }) => void;
      public animatePrev: () => void;
      public animateNext: () => void;

      constructor(props: {
        parentNode: HTMLElement;
        slides: GameCardItemType[];
        status: ResponseStatusType;
        openDetails: (slug: string) => void;
      }) {
        this.node = document.createElement('div');
        this.node.className = 'slider-component';
        props.parentNode.append(this.node);

        this.update = vi.fn();
        this.animatePrev = vi.fn();
        this.animateNext = vi.fn();
      }

      destroy() {
        this.node.remove();
      }
    },
  };
});

describe('SliderSection', () => {
  let root: HTMLElement;
  let onRetry: () => Promise<void>;
  let openDetails: () => void;

  beforeEach(() => {
    root = document.createElement('div');
    onRetry = vi.fn().mockResolvedValue(undefined);
    openDetails = vi.fn();
    vi.clearAllMocks();
  });

  it('renders header and slider', () => {
    new SliderSection({ parentNode: root, onRetry, openDetails });

    const section = root.querySelector('.home-page_slider');
    expect(section).not.toBeNull();

    const title = section?.querySelector('.slider_title-wrap_title');
    expect(title?.textContent).toBe('New Games');

    const slider = section?.querySelector('.slider-component');
    expect(slider).not.toBeNull();

    const prevBtn = section?.querySelector('[aria-label="back slider"]');
    const nextBtn = section?.querySelector('[aria-label="forward slider"]');
    expect(prevBtn).not.toBeNull();
    expect(nextBtn).not.toBeNull();
  });

  it('updateSlides SUCCESS enables buttons and hides retry', () => {
    const sliderSection = new SliderSection({ parentNode: root, onRetry, openDetails });

    sliderSection.updateSlides([{ slug: 'g1' } as GameCardItemType], SUCCESS);

    const prevBtn = root.querySelector('[aria-label="back slider"]') as HTMLElement;
    const nextBtn = root.querySelector('[aria-label="forward slider"]') as HTMLElement;
    const retryBtn = root.querySelector('.slider_title-wrap_retry-brn') as HTMLElement;

    expect(prevBtn.getAttribute('disable')).toBeNull();
    expect(nextBtn.getAttribute('disable')).toBeNull();
    expect(retryBtn.style.display).toBe('none');
  });

  it('updateSlides EMPTY disables buttons and shows retry', () => {
    const sliderSection = new SliderSection({ parentNode: root, onRetry, openDetails });

    sliderSection.updateSlides([], EMPTY);

    const prevBtn = root.querySelector('[aria-label="back slider"]') as HTMLElement;
    const nextBtn = root.querySelector('[aria-label="forward slider"]') as HTMLElement;
    const retryBtn = root.querySelector('.slider_title-wrap_retry-brn') as HTMLElement;

    expect(prevBtn.getAttribute('disable')).toBe('true');
    expect(nextBtn.getAttribute('disable')).toBe('true');
    expect(retryBtn.style.display).toBe('flex');
  });

  it('updateSlides ERROR disables buttons and shows retry', () => {
    const sliderSection = new SliderSection({ parentNode: root, onRetry, openDetails });

    sliderSection.updateSlides([], ERROR);

    const retryBtn = root.querySelector('.slider_title-wrap_retry-brn') as HTMLElement;
    expect(retryBtn.style.display).toBe('flex');
  });

  it('handleRetry calls onRetry and updates slider', async () => {
    const sliderSection = new SliderSection({ parentNode: root, onRetry, openDetails });

    await sliderSection['handleRetry']();

    expect(onRetry).toHaveBeenCalled();
    expect(sliderSection['slider'].update).toHaveBeenCalled();
  });

  it('destroy removes slider section', () => {
    const sliderSection = new SliderSection({ parentNode: root, onRetry, openDetails });

    sliderSection.destroy();
    expect(root.innerHTML).toBe('');
  });
});
